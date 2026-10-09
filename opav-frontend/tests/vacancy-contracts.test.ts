import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import schema from "../../opav-cms/src/api/vacante/content-types/vacante/schema.json";
import es from "../messages/es.json";
import en from "../messages/en.json";
import VacancyHero from "../app/[locale]/vacantes/[slug]/_components/VacancyHero";
import JobCard from "../components/JobCard";

for (const [locale, messages] of Object.entries({ es, en })) {
  const t = createTranslator({ locale, messages, namespace: "jobs" });
  const contracts: Record<string, string> = messages.jobs.contractTypes;

  test(`${locale}: translations cover exactly the CMS contract enum`, () => {
    assert.deepEqual(Object.keys(contracts).sort(), [...schema.attributes.tipoContrato.enum].sort());
    assert.equal(contracts.por_obra, locale === "es" ? "Por Obra" : "Contract");
    assert.equal(contracts.freelance, "Freelance");
  });

  for (const tipoContrato of schema.attributes.tipoContrato.enum) {
    test(`${locale}: hero and card render ${tipoContrato} as a translated label`, () => {
      const contractType = t(`contractTypes.${tipoContrato}` as Parameters<typeof t>[0]);
      const job = {
        id: 1, titulo: "Administrador residencial", descripcion: "Descripción",
        tipoContrato, ciudad: "Bogotá", area: "Administración", activa: true,
        slug: "administrador-residencial", empresa: "OPAV",
      };
      const hero = renderToStaticMarkup(createElement(VacancyHero, {
        ...job, salario: null, nivelEducativo: null, brandColor: "#d50058",
        brandName: "OPAV", locale, backText: "Volver", contractType,
      }));
      const card = renderToStaticMarkup(createElement(JobCard, {
        job, locale, index: 0, translations: messages.jobs.card, contractTypes: contracts,
      }));
      for (const html of [hero, card]) {
        assert.ok(html.includes(`>${contracts[tipoContrato]}<`));
        assert.doesNotMatch(html, /jobs\.contractTypes\.|por_obra|porObra/);
      }
    });
  }
}
