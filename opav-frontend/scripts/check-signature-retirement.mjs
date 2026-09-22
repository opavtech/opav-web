import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { inflateSync } from "node:zlib";
import ts from "typescript";

const source = readFileSync(new URL("../lib/signature-retirement.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { signatureRetirement, isSignatureImageRetired, transparentSignatureImage } =
  await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

for (const [filename, date] of Object.entries(signatureRetirement)) {
  assert.ok(existsSync(new URL(`../public/firma/FIR/img/${filename}`, import.meta.url)));
  const path = `/firma/FIR/img/${filename}`;
  assert.equal(isSignatureImageRetired(path, Date.parse(date) - 1), false);
  assert.equal(isSignatureImageRetired(path, Date.parse(date)), true);
}
for (const path of [
  "/firma/FIR/img/unknown.png", "/firma/FIR/img/toString",
  "/other/linkedin.png", "/firma/FIR/Firma_Sergio.html",
]) {
  assert.equal(isSignatureImageRetired(path, Date.parse("2030-01-01")), false);
}

const png = Buffer.from(transparentSignatureImage());
assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(png.readUInt32BE(16), 1);
assert.equal(png.readUInt32BE(20), 1);
assert.equal(png[25], 6); // RGBA
const data = [];
for (let offset = 8; offset < png.length;) {
  const length = png.readUInt32BE(offset);
  if (png.toString("ascii", offset + 4, offset + 8) === "IDAT") {
    data.push(png.subarray(offset + 8, offset + 8 + length));
  }
  offset += length + 12;
}
assert.deepEqual([...inflateSync(Buffer.concat(data))], [0, 0, 0, 0, 0]);
console.log("OK: fechas, originales, exclusiones y PNG transparente.");
