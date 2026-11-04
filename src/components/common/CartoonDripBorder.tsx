import React from 'react';

interface CartoonDripBorderProps {
  color?: string;
  className?: string;
  flip?: boolean;
}

export const CartoonDripBorder: React.FC<CartoonDripBorderProps> = ({
  color = '#FF5722',
  className = '',
  flip = false,
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className} ${
        flip ? 'rotate-180' : ''
      }`}
    >
      <svg
        viewBox="0 0 1200 42"
        preserveAspectRatio="none"
        className="w-full h-4 sm:h-6 fill-current transition-colors duration-500"
        style={{ color }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 L1200,0 L1200,10 Q1150,38 1110,12 Q1060,42 1010,14 Q960,36 910,8 Q850,44 800,16 Q740,38 680,10 Q620,40 570,14 Q510,42 450,16 Q390,38 330,8 Q260,42 200,14 Q140,40 80,10 Q40,32 0,8 Z" />
      </svg>
    </div>
  );
};
