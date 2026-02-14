"use client";

interface ScrollToFormButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollToFormButton({
  children,
  className = "",
}: ScrollToFormButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a href="#form" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
