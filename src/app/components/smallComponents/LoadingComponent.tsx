import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div className="loading">
      <svg width="64" height="48" xmlns="http://www.w3.org/2000/svg">
        <polyline 
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" 
          id="back" 
          className="fill-none stroke-[#ff4d5033]"
          style={{ strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
        <polyline 
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" 
          id="front" 
          className="fill-none stroke-[#ff4d4f] animate-dash"
          style={{ strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
      </svg>
      <style jsx>{`
        @keyframes dash {
          72.5% {
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash {
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: dash 1.4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent;