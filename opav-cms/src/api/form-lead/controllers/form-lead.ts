import { factories } from "@strapi/strapi";
const hubspot = require("@hubspot/api-client");

export default factories.createCoreController(
  "api::form-lead.form-lead",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const data = ctx.request.body.data;

        // 1. Guardar en Strapi
        const entry = await strapi.entityService.create(
          "api::form-lead.form-lead",
          {
            data: {
              ...data,
              enviadoHubspot: false,
            },
          }
        );

        // 2. Enviar a HubSpot
        try {
          const hubspotClient = new hubspot.Client({
            accessToken: process.env.HUBSPOT_API_KEY,
          });

          const contactData = {
            properties: {
              email: data.email,
              firstname:
                data.nombreCompleto?.split(" ")[0] || data.nombreCompleto,
              lastname:
                data.nombreCompleto?.split(" ").slice(1).join(" ") || "",
              phone: data.telefono || "",
              company: data.empresa || "",
              // Campos personalizados
              message: data.mensaje || "",
              hs_lead_status: "NEW",
              lifecyclestage: "lead",
            },
          };

          const hubspotContact =
            await hubspotClient.crm.contacts.basicApi.create(contactData);

          // Actualizar el lead con el ID de HubSpot
          await strapi.entityService.update(
            "api::form-lead.form-lead",
            entry.id,
            {
              data: {
                enviadoHubspot: true,
                hubspotContactId: hubspotContact.id,
              },
            }
          );

          strapi.log.info(`Lead enviado a HubSpot: ${hubspotContact.id}`);
        } catch (hubspotError: any) {
          strapi.log.error(
            "Error al enviar a HubSpot:",
            hubspotError?.body?.message || hubspotError.message
          );
          // El lead se guarda en Strapi aunque falle HubSpot
        }

        return { data: entry, message: "Formulario enviado exitosamente" };
      } catch (error) {
        strapi.log.error("Error al crear form-lead:", error);
        ctx.throw(500, error);
      }
    },
  })
);
