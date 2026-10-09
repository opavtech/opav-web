import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import VacancyMarkdown from "../app/[locale]/vacantes/[slug]/_components/VacancyMarkdown";

const render = (content: string) =>
  renderToStaticMarkup(
    createElement(VacancyMarkdown, { content, brandColor: "#d50058" }),
  );

test("renders paragraphs, emphasis and explicit Markdown line breaks", () => {
  const html = render("**Educación:** Profesional.\n\n**Experiencia:** Dos años.  \nDisponibilidad inmediata.");
  assert.match(html, /<p><strong>Educación:<\/strong> Profesional\.<\/p>/);
  assert.match(html, /<p><strong>Experiencia:<\/strong> Dos años\.<br\/>\nDisponibilidad inmediata\.<\/p>/);
  assert.ok(!html.includes("**"));
});

test("preserves nested unordered and ordered lists with inline formatting", () => {
  const html = render("- **Formación:**\n  - Administración\n  - Finanzas\n- Experiencia\n\n1. Enviar hoja de vida\n2. Entrevista");
  assert.match(html, /<ul>\n<li><strong>Formación:<\/strong>\n<ul>\n<li>Administración<\/li>\n<li>Finanzas<\/li>\n<\/ul>\n<\/li>/);
  assert.match(html, /<ol>\n<li>Enviar hoja de vida<\/li>\n<li>Entrevista<\/li>\n<\/ol>/);
});

test("preserves HTTPS, email and relative links", () => {
  const html = render("[Web](https://example.com) [Correo](mailto:jobs@example.com) [Vacantes](/es/vacantes)");
  for (const href of ["https://example.com", "mailto:jobs@example.com", "/es/vacantes"]) {
    assert.ok(html.includes(`href="${href}"`));
  }
});

test("handles empty and malformed Markdown without rewriting editorial text", () => {
  assert.doesNotThrow(() => render(""));
  const html = render("**Educación: sin cierre\n\n[Enlace incompleto](\n\nTexto - con guion");
  assert.match(html, /\*\*Educación: sin cierre/);
  assert.match(html, /\[Enlace incompleto\]\(/);
  assert.match(html, /Texto - con guion/);
  assert.ok(!html.includes("<li>"));
});

test("does not interpret raw HTML or event handlers from the CMS", () => {
  const html = render('Antes <img src=x onerror="alert(1)"> después\n\n<script>alert(1)</script>\n\n<iframe src="https://example.com"></iframe>\n\n<a href="javascript:alert(1)">Enlace</a>');
  assert.doesNotMatch(html, /<(?:script|iframe|img|a)\b/);
  assert.doesNotMatch(html, /onerror|javascript:|alert\(1\)/);
  assert.match(html, /Antes .* después/);
});

for (const url of ["javascript:alert%281%29", "JaVaScRiPt:alert%281%29", "javascript&#58;alert%281%29", "vbscript:msgbox%281%29", "data:text/html;base64,PHNjcmlwdD4="]) {
  test(`blocks unsafe Markdown URL: ${url}`, () => {
    const html = render(`[Enlace](${url})\n\n![Imagen](${url})`);
    assert.doesNotMatch(html, /(?:href|src)="(?:javascript|vbscript|data):/i);
    assert.match(html, /<a href="">Enlace<\/a>/);
  });
}
