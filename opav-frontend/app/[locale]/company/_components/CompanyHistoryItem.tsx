"use client";

interface Props {
  index: number;
  year: number;
  title: string;
  description: string;
  setRef: (el: HTMLDivElement | null) => void;
}

export default function CompanyHistoryItem({
  index,
  year,
  title,
  description,
  setRef,
}: Props) {
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={setRef}
      data-index={index}
      className={`history-item-wrapper ${isLeft ? "item-left" : "item-right"}`}
    >
      {/* Hexágono - Nodo del timeline */}
      <div className="hex-wrapper">
        <div className="hex">
          <div className="hex-inner" />
          <div className="hex-glow" />
        </div>
      </div>

      {/* Línea conectora */}
      <div
        className={`connector-line ${
          isLeft ? "connector-left" : "connector-right"
        }`}
      />

      {/* Card Container */}
      <div className="history-card-container">
        {/* Card Principal */}
        <div className="history-card">
          {/* Efecto Sheen */}
          <div className="sheen-effect" />

          {/* Año como watermark */}
          <div className="year-watermark">
            <span className="year-text">{year}</span>
          </div>

          {/* Contenido */}
          <div className="card-content">
            <h4 className="card-title">{title}</h4>
            <p className="card-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
