/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { v2: cloudinary } = require('cloudinary');

const DATABASE_URL = process.env.DATABASE_URL;
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'opav/strapi';

if (!DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!CLOUDINARY_NAME) throw new Error('Missing CLOUDINARY_NAME');
if (!CLOUDINARY_KEY) throw new Error('Missing CLOUDINARY_KEY');
if (!CLOUDINARY_SECRET) throw new Error('Missing CLOUDINARY_SECRET');

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
  secure: true,
});

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

function extToFormat(ext) {
  if (!ext) return undefined;
  return ext.replace('.', '').toLowerCase();
}

function buildDerivedUrl(publicId, resourceType, fmt, fallbackExt) {
  const format = extToFormat(fmt?.ext || fallbackExt);

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType || 'image',
    type: 'upload',
    format,
    transformation: [
      {
        width: fmt?.width || undefined,
        height: fmt?.height || undefined,
        crop: 'limit',
      },
    ],
  });
}

function getLocalPathFromUrl(url) {
  if (!url) return null;
  const filename = path.basename(decodeURIComponent(url));
  return path.join(uploadsDir, filename);
}

async function uploadOriginal(file) {
  const localPath = getLocalPathFromUrl(file.url);

  if (!localPath || !fs.existsSync(localPath)) {
    throw new Error(`Local file not found for id=${file.id} url=${file.url}`);
  }

  const publicId = `${CLOUDINARY_FOLDER}/${file.hash}`;

  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    resource_type: 'auto',
    overwrite: true,
    unique_filename: false,
    use_filename: false,
    invalidate: true,
  });

  return result;
}

function mapFormatsToCloudinary(file, uploadResult) {
  if (!file.formats || typeof file.formats !== 'object') return null;

  const resourceType = uploadResult.resource_type || 'image';
  const publicId = uploadResult.public_id;

  const newFormats = {};

  for (const [key, fmt] of Object.entries(file.formats)) {
    if (!fmt || typeof fmt !== 'object') continue;

    newFormats[key] = {
      ...fmt,
      url: buildDerivedUrl(publicId, resourceType, fmt, file.ext),
    };
  }

  return newFormats;
}

async function run() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('railway')
      ? { rejectUnauthorized: false }
      : false,
  });

  await client.connect();

  const { rows } = await client.query(`
    SELECT
      id,
      name,
      alternative_text,
      caption,
      width,
      height,
      formats,
      hash,
      ext,
      mime,
      size,
      url,
      preview_url,
      provider,
      provider_metadata,
      folder_path,
      created_at,
      updated_at,
      published_at,
      created_by_id,
      updated_by_id,
      locale,
      focal_point
    FROM files
    ORDER BY id;
  `);

  console.log(`Found ${rows.length} file(s)`);

  for (const file of rows) {
    const isAlreadyCloudinary =
      file.provider === 'cloudinary' &&
      typeof file.url === 'string' &&
      file.url.includes('res.cloudinary.com');

    if (isAlreadyCloudinary) {
      console.log(`Skipping id=${file.id} already in Cloudinary`);
      continue;
    }

    try {
      console.log(`Uploading id=${file.id} name=${file.name}`);

      const uploadResult = await uploadOriginal(file);
      const newFormats = mapFormatsToCloudinary(file, uploadResult);

      const providerMetadata = {
        public_id: uploadResult.public_id,
        asset_id: uploadResult.asset_id,
        version: uploadResult.version,
        resource_type: uploadResult.resource_type,
        secure_url: uploadResult.secure_url,
      };

      await client.query(
        `
        UPDATE files
        SET
          url = $1,
          preview_url = NULL,
          provider = $2,
          provider_metadata = $3::jsonb,
          formats = $4::jsonb,
          updated_at = NOW()
        WHERE id = $5
        `,
        [
          uploadResult.secure_url,
          'cloudinary',
          JSON.stringify(providerMetadata),
          JSON.stringify(newFormats),
          file.id,
        ]
      );

      console.log(`Updated id=${file.id}`);
    } catch (error) {
      console.error(`Failed id=${file.id} name=${file.name}`);
      console.error(error.message);
    }
  }

  await client.end();
  console.log('Migration finished');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
