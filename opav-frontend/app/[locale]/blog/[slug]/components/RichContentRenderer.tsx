/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";
import QuoteBlock from "./QuoteBlock";

interface RichContentRendererProps {
  content: any; // Strapi rich text content
  locale: string;
}

export default function RichContentRenderer({
  content,
  locale: _locale,
}: RichContentRendererProps) {
  // Si el contenido es un string simple (texto plano)
  if (typeof content === "string") {
    return (
      <section className="relative bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          {content.split("\n\n").map((paragraph, index) => {
            // Detectar si es una lista con bullets
            if (paragraph.trim().startsWith("•")) {
              const items = paragraph
                .split("\n")
                .filter((line) => line.trim().startsWith("•"))
                .map((line) => line.trim().substring(1).trim());

              return (
                <motion.ul
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="font-['IBM_Plex_Serif'] text-lg lg:text-xl text-gray-800 leading-relaxed space-y-3 list-disc list-outside ml-6 mb-6"
                >
                  {items.map((item, i) => (
                    <li key={i} className="pl-2">
                      {item}
                    </li>
                  ))}
                </motion.ul>
              );
            }

            // Párrafo normal
            return (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="font-['IBM_Plex_Serif'] text-lg lg:text-xl text-gray-800 leading-relaxed mb-6"
                style={{
                  lineHeight: "1.8",
                  letterSpacing: "-0.01em",
                }}
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>
      </section>
    );
  }

  // Si el contenido es un array (formato complejo de Strapi)
  if (!content || !Array.isArray(content)) {
    return null;
  }

  const renderNode = (node: any, index: number) => {
    switch (node.type) {
      case "paragraph":
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="font-['IBM_Plex_Serif'] text-lg lg:text-xl text-gray-800 leading-relaxed mb-6"
            style={{
              lineHeight: "1.8",
              letterSpacing: "-0.01em",
            }}
          >
            {node.children?.map((child: any, i: number) =>
              renderInlineContent(child, i)
            )}
          </motion.p>
        );

      case "heading":
        const HeadingTag = `h${node.level}` as
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        const headingClasses = {
          2: "font-['Inter'] font-bold text-3xl lg:text-4xl text-gray-900 mb-6 mt-12",
          3: "font-['Inter'] font-bold text-2xl lg:text-3xl text-gray-900 mb-5 mt-10",
          4: "font-['Inter'] font-semibold text-xl lg:text-2xl text-gray-900 mb-4 mt-8",
          5: "font-['Inter'] font-semibold text-lg lg:text-xl text-gray-900 mb-4 mt-6",
          6: "font-['Inter'] font-semibold text-base lg:text-lg text-gray-900 mb-3 mt-6",
        };

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <HeadingTag
              className={
                headingClasses[node.level as keyof typeof headingClasses] ||
                headingClasses[2]
              }
            >
              {node.children?.map((child: any, i: number) =>
                renderInlineContent(child, i)
              )}
            </HeadingTag>
          </motion.div>
        );

      case "list":
        const ListTag = node.format === "ordered" ? "ol" : "ul";
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <ListTag
              className={`font-['IBM_Plex_Serif'] text-lg lg:text-xl text-gray-800 leading-relaxed space-y-3 ${
                node.format === "ordered" ? "list-decimal" : "list-disc"
              } list-outside ml-6`}
            >
              {node.children?.map((child: any, i: number) => (
                <li key={i} className="pl-2">
                  {child.children?.map((innerChild: any, j: number) =>
                    renderInlineContent(innerChild, j)
                  )}
                </li>
              ))}
            </ListTag>
          </motion.div>
        );

      case "quote":
        const quoteText = node.children
          ?.map((child: any) => child.text || "")
          .join("");
        return <QuoteBlock key={index} quote={quoteText} />;

      case "image":
        const imageUrl = getStrapiMedia(node.image?.url);
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="my-12"
          >
            <figure>
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={node.image?.alternativeText || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                )}
              </div>
              {node.image?.caption && (
                <figcaption className="mt-3 text-center text-sm text-gray-600 italic font-['Inter']">
                  {node.image.caption}
                </figcaption>
              )}
            </figure>
          </motion.div>
        );

      case "code":
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-8"
          >
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm">
              <code>{node.children?.[0]?.text || ""}</code>
            </pre>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderInlineContent = (node: any, index: number) => {
    if (node.type === "text") {
      let text = node.text;

      if (node.bold) {
        text = (
          <strong key={index} className="font-bold">
            {text}
          </strong>
        );
      }

      if (node.italic) {
        text = (
          <em key={index} className="italic">
            {text}
          </em>
        );
      }

      if (node.underline) {
        text = (
          <u key={index} className="underline">
            {text}
          </u>
        );
      }

      if (node.strikethrough) {
        text = (
          <s key={index} className="line-through">
            {text}
          </s>
        );
      }

      if (node.code) {
        text = (
          <code
            key={index}
            className="bg-gray-100 text-[#d50058] px-2 py-1 rounded font-mono text-base"
          >
            {text}
          </code>
        );
      }

      return text;
    }

    if (node.type === "link") {
      return (
        <a
          key={index}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d50058] hover:text-[#ff1a8c] underline transition-colors font-medium"
        >
          {node.children?.map((child: any, i: number) =>
            renderInlineContent(child, i)
          )}
        </a>
      );
    }

    return null;
  };

  return (
    <section className="relative bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <article className="prose prose-lg max-w-none">
          {content.map((node: any, index: number) => renderNode(node, index))}
        </article>
      </div>
    </section>
  );
}
