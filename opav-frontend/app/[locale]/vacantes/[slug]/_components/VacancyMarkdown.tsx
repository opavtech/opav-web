import type { CSSProperties } from "react";
import Markdown from "react-markdown";

interface VacancyMarkdownProps {
  content: string;
  brandColor: string;
}

export default function VacancyMarkdown({
  content,
  brandColor,
}: VacancyMarkdownProps) {
  return (
    <div
      className="text-base sm:text-lg leading-relaxed text-gray-700 break-words
        [&>:first-child]:mt-0 [&>:last-child]:mb-0
        [&_p]:my-4 [&_strong]:font-bold [&_strong]:text-gray-900
        [&_h1]:text-2xl [&_h2]:text-2xl [&_h3]:text-xl
        [&_h4]:text-lg [&_h5]:text-base [&_h6]:text-base
        [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold
        [&_:is(h1,h2,h3,h4,h5,h6)]:text-gray-900
        [&_:is(h1,h2,h3,h4,h5,h6)]:mt-6
        [&_:is(h1,h2,h3,h4,h5,h6)]:mb-3
        [&_ul]:list-disc [&_ol]:list-decimal
        [&_ul]:my-4 [&_ol]:my-4 [&_ul]:pl-6 [&_ol]:pl-6
        [&_li]:my-2 [&_li]:pl-1 [&_li]:list-item
        [&_li::marker]:text-[var(--vacancy-accent)]
        [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[var(--vacancy-accent)]
        [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2
        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300
        [&_blockquote]:pl-4 [&_blockquote]:my-4
        [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4
        [&_code]:text-sm [&_hr]:my-6 [&_img]:max-w-full [&_img]:h-auto"
      style={{ "--vacancy-accent": brandColor } as CSSProperties}
    >
      {/* Keep Markdown's safe URL transform and never interpret CMS HTML. */}
      <Markdown skipHtml>{content}</Markdown>
    </div>
  );
}
