import React from 'react';

/* Flat t-shirt silhouettes per style, used in cards across the site. */
const TEE = {
  classic: 'M44 16 L24 26 L14 44 L26 52 L34 46 L34 104 L86 104 L86 46 L94 52 L106 44 L96 26 L76 16 C76 26 68 32 60 32 C52 32 44 26 44 16 Z',
  oversize: 'M40 18 L16 30 L8 52 L24 60 L30 52 L30 108 L90 108 L90 52 L96 60 L112 52 L104 30 L80 18 C80 28 71 34 60 34 C49 34 40 28 40 18 Z',
  long: 'M44 16 L24 26 L12 96 L26 100 L34 52 L34 104 L86 104 L86 52 L94 100 L108 96 L96 26 L76 16 C76 26 68 32 60 32 C52 32 44 26 44 16 Z',
  hoodie: 'M44 26 L24 34 L14 52 L26 60 L34 54 L34 104 L86 104 L86 54 L94 60 L106 52 L96 34 L76 26 Z',
};

const Tee = ({ color, variant = 'classic' }) => (
  <svg viewBox="0 0 120 120" className="tee-svg" aria-hidden>
    {variant === 'hoodie' && (
      <path d="M40 28 C40 10 80 10 80 28 C80 34 73 38 60 38 C47 38 40 34 40 28 Z" fill={color} stroke="rgba(0,0,0,0.10)" strokeWidth="1.5" />
    )}
    <path d={TEE[variant]} fill={color} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
    {variant === 'hoodie' && (
      <>
        <line x1="55" y1="38" x2="54" y2="54" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="65" y1="38" x2="66" y2="54" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export default Tee;
