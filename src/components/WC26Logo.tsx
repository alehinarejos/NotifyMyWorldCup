import React from "react";

export const WC26Logo: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.2))" }}
    >
      <defs>
        {/* Degradado metálico dorado para el trofeo */}
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE259" />
          <stop offset="30%" stop-color="#FFA751" />
          <stop offset="70%" stop-color="#FFE259" />
          <stop offset="100%" stop-color="#C39738" />
        </linearGradient>
        {/* Degradado metálico plateado/blanco para el texto "26" */}
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#94A3B8" />
        </linearGradient>
        {/* Degradado verde malaquita para los anillos del trofeo */}
        <linearGradient id="malachiteGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00FF88" />
          <stop offset="100%" stop-color="#00A753" />
        </linearGradient>
      </defs>
      
      {/* Texto de Fondo: "2" y "6" Apilados */}
      <g>
        <text 
          x="24" 
          y="23" 
          fontFamily="'Outfit', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="26" 
          fill="url(#textGrad)" 
          textAnchor="middle" 
          letterSpacing="-1.5"
          dominantBaseline="middle"
        >
          2
        </text>
        <text 
          x="24" 
          y="42" 
          fontFamily="'Outfit', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="26" 
          fill="url(#textGrad)" 
          textAnchor="middle" 
          letterSpacing="-1.5"
          dominantBaseline="middle"
        >
          6
        </text>
      </g>
      
      {/* Silueta del Trofeo de la Copa del Mundo en Primer Plano */}
      {/* Anillos de la Base */}
      <path d="M17 41 H31 V43 H17 Z" fill="url(#trophyGold)" />
      <path d="M18 39 H30 V41 H18 Z" fill="url(#malachiteGreen)" />
      <path d="M17 37 H31 V39 H17 Z" fill="url(#trophyGold)" />
      <path d="M18 35 H30 V37 H18 Z" fill="url(#malachiteGreen)" />
      <path d="M16 43 H32 V45 C32 46 31 46.5 30 46.5 H18 C17 46.5 16 46 16 45 Z" fill="url(#trophyGold)" />

      {/* Cuerpo y Brazos Estilizados */}
      <path 
        d="M21 35 
           C20 31.5 20.5 28.5 22 26 
           C21.5 25.8 19 24.5 18 22.5 
           C16.8 20.2 17.5 17 19.5 15.5 
           C21 14.5 22.5 15 23.5 17 
           C23.8 15.2 23.9 12 24 9 
           C24.1 12 24.2 15.2 24.5 17 
           C25.5 15 27 14.5 28.5 15.5 
           C30.5 17 31.2 20.2 30 22.5 
           C29 24.5 26.5 25.8 26 26 
           C27.5 28.5 28 31.5 27 35 Z" 
        fill="url(#trophyGold)" 
      />
      
      {/* Globo Terrestre en la Cúspide */}
      <circle cx="24" cy="11.5" r="5.5" fill="url(#trophyGold)" />
      
      {/* Detalles del Globo */}
      <path d="M20 9.5 C21.5 10 22.5 10.5 24 10.5 C25.5 10.5 26.5 10 28 9.5" stroke="#FFA751" strokeWidth="0.8" />
      <path d="M19 12.5 C21 12.5 22 13 24 13 C26 13 27 12.5 29 12.5" stroke="#FFA751" strokeWidth="0.8" />
      <path d="M24 6 V17" stroke="#FFE259" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.3" />
    </svg>
  );
};
