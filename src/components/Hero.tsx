import React from "react";

interface HeroProps {
  title: string;
  description?: string;
  span?: number;
}

export function Hero({ title, description, span = 8 }: HeroProps) {
  return (
    <div 
      className="hero-content" 
      style={{ "--hero-span": span } as React.CSSProperties}
    >
      <h1 className="hero-title">{title}</h1>
      {description && <p className="hero-description">{description}</p>}
    </div>
  );
}
