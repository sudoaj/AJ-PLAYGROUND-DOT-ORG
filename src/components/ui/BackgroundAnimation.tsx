// src/components/ui/BackgroundAnimation.tsx
'use client';

import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* Line 1 */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', animation: 'float-translate 20s ease-in-out infinite 0s' }}>
        <div className="h-px bg-border opacity-10" style={{ width: '200px', transform: 'rotate(-25deg)' }}></div>
      </div>
      {/* Line 2 */}
      <div style={{ position: 'absolute', top: '30%', left: '75%', animation: 'float-translate 25s ease-in-out infinite 2s' }}>
        <div className="h-px bg-border opacity-10" style={{ width: '150px', transform: 'rotate(35deg)' }}></div>
      </div>
      {/* Line 3 */}
      <div style={{ position: 'absolute', top: '70%', left: '15%', animation: 'float-translate 18s ease-in-out infinite 4s' }}>
        <div className="h-px bg-border opacity-10" style={{ width: '250px', transform: 'rotate(10deg)' }}></div>
      </div>
      {/* Line 4 */}
      <div style={{ position: 'absolute', top: '85%', left: '60%', animation: 'float-translate 22s ease-in-out infinite 1s' }}>
        <div className="h-px bg-border opacity-10" style={{ width: '180px', transform: 'rotate(-40deg)' }}></div>
      </div>
        {/* Line 5 */}
      <div style={{ position: 'absolute', top: '50%', left: '40%', animation: 'float-translate 28s ease-in-out infinite 3s' }}>
        <div className="h-px bg-border opacity-10" style={{ width: '220px', transform: 'rotate(5deg)' }}></div>
      </div>
    </div>
  );
};

export default BackgroundAnimation;
