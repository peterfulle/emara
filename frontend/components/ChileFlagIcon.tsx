export default function ChileFlagIcon({ className = "w-6 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fondo blanco superior */}
      <rect width="24" height="8" fill="white"/>
      
      {/* Franja roja inferior */}
      <rect y="8" width="24" height="8" fill="#D52B1E"/>
      
      {/* Cuadro azul */}
      <rect width="8" height="8" fill="#0039A6"/>
      
      {/* Estrella blanca */}
      <path 
        d="M4 2L4.5 3.5L6 4L4.5 4.5L4 6L3.5 4.5L2 4L3.5 3.5L4 2Z" 
        fill="white"
      />
    </svg>
  );
}
