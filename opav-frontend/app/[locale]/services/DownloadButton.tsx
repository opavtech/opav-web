"use client";

interface DownloadButtonProps {
  children: React.ReactNode;
  className: string;
  type: string;
  style?: React.CSSProperties;
}

export default function DownloadButton({
  children,
  className,
  type,
  style,
}: DownloadButtonProps) {
  const handleClick = () => {
    alert(`Brochure ${type} descargado`);
  };

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
