'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedSvgBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('mousemove', handleMouseMove);
      svgElement.addEventListener('mouseenter', () => setIsHovered(true));
      svgElement.addEventListener('mouseleave', () => setIsHovered(false));
    }

    return () => {
      if (svgElement) {
        svgElement.removeEventListener('mousemove', handleMouseMove);
        svgElement.removeEventListener('mouseenter', () => setIsHovered(true));
        svgElement.removeEventListener('mouseleave', () => setIsHovered(false));
      }
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{ cursor: 'none' }}
    >
      {/* Gradient Definitions */}
      <defs>
        {/* Ocean gradient */}
        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4682B4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#191970" stopOpacity="0.4" />
        </linearGradient>

        {/* Tech gradient */}
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#5B73FF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#9D50BB" stopOpacity="0.1" />
        </linearGradient>

        {/* Flower gradient */}
        <radialGradient id="flowerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FF69B4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C71585" stopOpacity="0.2" />
        </radialGradient>

        {/* Sand gradient */}
        <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F4A460" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#DEB887" stopOpacity="0.2" />
        </linearGradient>

        {/* Filter for glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Beach/Ocean Background */}
      <rect width="100%" height="100%" fill="url(#oceanGradient)" />
      
      {/* Animated Waves */}
      <g className="waves">
        <path
          d="M0,600 Q480,550 960,600 T1920,600 L1920,1080 L0,1080 Z"
          fill="url(#sandGradient)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 20,10; 0,0"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        
        <path
          d="M0,650 Q360,620 720,650 T1440,650 T1920,650 L1920,1080 L0,1080 Z"
          fill="url(#oceanGradient)"
          opacity="0.5"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; -15,5; 0,0"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Tech Circuit Patterns */}
      <g className="tech-patterns" opacity={isHovered ? "0.6" : "0.3"}>
        {/* Circuit lines */}
        <g stroke="url(#techGradient)" strokeWidth="2" fill="none" filter="url(#glow)">
          <path d="M100,100 L300,100 L300,200 L500,200">
            <animate attributeName="stroke-dasharray" values="0,100; 100,0; 0,100" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M1500,300 L1700,300 L1700,400 L1900,400">
            <animate attributeName="stroke-dasharray" values="0,100; 100,0; 0,100" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M800,150 L1000,150 L1000,250 L1200,250">
            <animate attributeName="stroke-dasharray" values="0,100; 100,0; 0,100" dur="5s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Tech nodes */}
        <g fill="url(#techGradient)">
          <circle cx="300" cy="100" r="5">
            <animate attributeName="r" values="5; 8; 5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="200" r="5">
            <animate attributeName="r" values="5; 8; 5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="1700" cy="300" r="5">
            <animate attributeName="r" values="5; 8; 5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="1000" cy="150" r="5">
            <animate attributeName="r" values="5; 8; 5" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      {/* Floating Flowers */}
      <g className="flowers">
        {/* Flower 1 */}
        <g transform={`translate(${200 + mousePosition.x * 50}, ${250 + mousePosition.y * 30})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="20s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 10,5; 0,0"
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.1; 1"}
              dur="2s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Flower petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-15"
                rx="8"
                ry="20"
                fill="url(#flowerGradient)"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.6"}
              >
                <animate attributeName="ry" values="20; 25; 20" dur="3s" repeatCount="indefinite" />
              </ellipse>
            ))}
            {/* Flower center */}
            <circle cx="0" cy="0" r="6" fill="#FFD700" opacity="0.8" />
          </g>
        </g>

        {/* Flower 2 */}
        <g transform={`translate(${1400 + mousePosition.x * -30}, ${180 + mousePosition.y * 40})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360; 0"
              dur="25s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -8,3; 0,0"
              dur="5s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.1; 1"}
              dur="2.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Flower petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-12"
                rx="6"
                ry="18"
                fill="url(#flowerGradient)"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.7"}
              >
                <animate attributeName="ry" values="18; 22; 18" dur="4s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="5" fill="#FF6347" opacity="0.9" />
          </g>
        </g>

        {/* Flower 3 */}
        <g transform={`translate(${800 + mousePosition.x * 40}, ${400 + mousePosition.y * -20})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="30s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,8; 0,0"
              dur="6s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.2; 1" : "1; 1.05; 1"}
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Flower petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-10"
                rx="5"
                ry="15"
                fill="url(#flowerGradient)"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.8" : "0.5"}
              >
                <animate attributeName="ry" values="15; 18; 15" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="4" fill="#FFB347" opacity="0.8" />
          </g>
        </g>

        {/* Flower 4 - Cherry Blossom */}
        <g transform={`translate(${600 + mousePosition.x * 25}, ${150 + mousePosition.y * 35})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="15s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 8,-5; 0,0"
              dur="5s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.1; 1"}
              dur="2.2s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Cherry blossom petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <g key={i} transform={`rotate(${angle})`}>
                <path
                  d="M0,-8 Q-3,-15 0,-18 Q3,-15 0,-8"
                  fill="#FFB6C1"
                  opacity={isHovered ? "0.9" : "0.6"}
                >
                  <animate attributeName="opacity" values="0.6; 0.9; 0.6" dur="4s" repeatCount="indefinite" />
                </path>
              </g>
            ))}
            <circle cx="0" cy="0" r="3" fill="#FF69B4" opacity="0.8" />
          </g>
        </g>

        {/* Flower 5 - Sunflower */}
        <g transform={`translate(${1200 + mousePosition.x * -40}, ${450 + mousePosition.y * 25})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="18s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -6,4; 0,0"
              dur="7s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.6; 1" : "1; 1.2; 1"}
              dur="3.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Sunflower petals */}
            {Array.from({length: 12}, (_, i) => i * 30).map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-18"
                rx="4"
                ry="12"
                fill="#FFD700"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.7"}
              >
                <animate attributeName="ry" values="12; 16; 12" dur="4s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="8" fill="#8B4513" opacity="0.8" />
            <circle cx="0" cy="0" r="6" fill="#DAA520" opacity="0.9" />
          </g>
        </g>

        {/* Flower 6 - Rose */}
        <g transform={`translate(${300 + mousePosition.x * 60}, ${500 + mousePosition.y * -15})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="22s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 12,6; 0,0"
              dur="6s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.15; 1"}
              dur="2.8s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Rose petals - layered */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-12"
                rx="6"
                ry="16"
                fill="#FF1493"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.8" : "0.5"}
              >
                <animate attributeName="ry" values="16; 20; 16" dur="3.8s" repeatCount="indefinite" />
              </ellipse>
            ))}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-8"
                rx="4"
                ry="12"
                fill="#FF69B4"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.6"}
              >
                <animate attributeName="ry" values="12; 15; 12" dur="3.2s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="4" fill="#8B0000" opacity="0.8" />
          </g>
        </g>

        {/* Flower 7 - Tulip */}
        <g transform={`translate(${800 + mousePosition.x * -50}, ${150 + mousePosition.y * 45})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="16s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 8,-3; 0,0"
              dur="5s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.1; 1"}
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Tulip petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path
                key={i}
                d="M0,-20 Q-8,-15 -6,-5 Q0,-8 6,-5 Q8,-15 0,-20"
                fill="#FF6347"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.7"}
              >
                <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="4s" repeatCount="indefinite" />
              </path>
            ))}
            <circle cx="0" cy="0" r="4" fill="#FFD700" opacity="0.8" />
          </g>
        </g>

        {/* Flower 8 - Lotus */}
        <g transform={`translate(${1600 + mousePosition.x * 35}, ${320 + mousePosition.y * -25})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="25s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -10,8; 0,0"
              dur="8s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.2; 1"}
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Lotus petals - outer layer */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-16"
                rx="5"
                ry="18"
                fill="#FFB6C1"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.8" : "0.6"}
              >
                <animate attributeName="ry" values="18; 22; 18" dur="5s" repeatCount="indefinite" />
              </ellipse>
            ))}
            {/* Lotus petals - inner layer */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-12"
                rx="4"
                ry="14"
                fill="#FF69B4"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.7"}
              >
                <animate attributeName="ry" values="14; 17; 14" dur="4.5s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="5" fill="#FFD700" opacity="0.9" />
          </g>
        </g>

        {/* Flower 9 - Daisy */}
        <g transform={`translate(${500 + mousePosition.x * 40}, ${600 + mousePosition.y * -20})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="14s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 6,10; 0,0"
              dur="6s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.08; 1"}
              dur="2.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Daisy petals */}
            {Array.from({length: 16}, (_, i) => i * 22.5).map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-14"
                rx="3"
                ry="10"
                fill="#FFFFFF"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.8"}
              >
                <animate attributeName="ry" values="10; 13; 10" dur="3s" repeatCount="indefinite" />
              </ellipse>
            ))}
            <circle cx="0" cy="0" r="4" fill="#FFD700" opacity="0.9" />
          </g>
        </g>

        {/* Flower 10 - Hibiscus */}
        <g transform={`translate(${1100 + mousePosition.x * -45}, ${80 + mousePosition.y * 35})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="19s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -12,5; 0,0"
              dur="7s"
              repeatCount="indefinite"
              additive="sum"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.6; 1" : "1; 1.15; 1"}
              dur="3.8s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Hibiscus petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M0,-18 Q-12,-10 -8,0 Q0,-5 8,0 Q12,-10 0,-18"
                fill="#FF4500"
                transform={`rotate(${angle})`}
                opacity={isHovered ? "0.9" : "0.7"}
              >
                <animate attributeName="opacity" values="0.5; 0.9; 0.5" dur="4.5s" repeatCount="indefinite" />
              </path>
            ))}
            <circle cx="0" cy="0" r="3" fill="#8B0000" opacity="0.8" />
            {/* Hibiscus center stamen */}
            <circle cx="0" cy="-8" r="1" fill="#FFD700" opacity="0.9">
              <animate attributeName="cy" values="-8; -12; -8" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>

      {/* Laptops and Code Elements */}
      <g className="laptops-and-code">
        {/* Laptop 1 */}
        <g transform={`translate(${150 + mousePosition.x * 30}, ${350 + mousePosition.y * 20})`}>
          <g className="hover:scale-125 transition-transform duration-700">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,3; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.2; 1" : "1; 1.05; 1"}
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Laptop base */}
            <rect x="-25" y="10" width="50" height="30" rx="3" fill="url(#techGradient)" opacity="0.8" />
            {/* Laptop screen */}
            <rect x="-22" y="-20" width="44" height="32" rx="2" fill="#1a1a1a" opacity="0.9" />
            <rect x="-20" y="-18" width="40" height="28" rx="1" fill="#000" opacity="1" />
            {/* Screen content - code lines */}
            <rect x="-18" y="-15" width="15" height="1" fill="#00ff00" opacity="0.8">
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="-18" y="-12" width="25" height="1" fill="#00ffff" opacity="0.8">
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <rect x="-18" y="-9" width="20" height="1" fill="#ffff00" opacity="0.8">
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="-18" y="-6" width="30" height="1" fill="#ff00ff" opacity="0.8">
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="1.8s" repeatCount="indefinite" />
            </rect>
            {/* Keyboard */}
            <rect x="-20" y="15" width="40" height="20" rx="2" fill="#333" opacity="0.9" />
            {/* Keys */}
            {Array.from({length: 6}, (_, i) => (
              <rect key={i} x={-15 + i * 6} y="18" width="4" height="3" rx="0.5" fill="#666" opacity="0.8" />
            ))}
          </g>
        </g>

        {/* Laptop 2 */}
        <g transform={`translate(${1500 + mousePosition.x * -35}, ${420 + mousePosition.y * 15})`}>
          <g className="hover:scale-125 transition-transform duration-700">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -8,4; 0,0"
              dur="10s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 5; 0; -5; 0"
              dur="12s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.08; 1"}
              dur="5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Laptop base */}
            <rect x="-30" y="12" width="60" height="35" rx="4" fill="url(#techGradient)" opacity="0.9" />
            {/* Laptop screen */}
            <rect x="-27" y="-25" width="54" height="40" rx="3" fill="#2a2a2a" opacity="0.9" />
            <rect x="-25" y="-23" width="50" height="36" rx="2" fill="#000" opacity="1" />
            {/* Terminal window */}
            <rect x="-23" y="-21" width="46" height="3" fill="#333" opacity="0.9" />
            <circle cx="-20" cy="-19.5" r="1" fill="#ff5f56" />
            <circle cx="-17" cy="-19.5" r="1" fill="#ffbd2e" />
            <circle cx="-14" cy="-19.5" r="1" fill="#27ca3f" />
            {/* Terminal content */}
            <text x="-22" y="-15" fontSize="3" fill="#00ff00" opacity="0.8">$</text>
            <rect x="-18" y="-17" width="12" height="1" fill="#00ff00" opacity="0.7">
              <animate attributeName="width" values="0; 12; 0" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="-22" y="-13" width="18" height="1" fill="#ffffff" opacity="0.6">
              <animate attributeName="opacity" values="0.3; 0.8; 0.3" dur="2s" repeatCount="indefinite" />
            </rect>
          </g>
        </g>

        {/* Laptop 3 - Gaming Laptop */}
        <g transform={`translate(${900 + mousePosition.x * 25}, ${500 + mousePosition.y * -30})`}>
          <g className="hover:scale-125 transition-transform duration-700">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 4,-2; 0,0"
              dur="9s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; -3; 0; 3; 0"
              dur="11s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.1; 1"}
              dur="4.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Gaming laptop base */}
            <rect x="-28" y="12" width="56" height="32" rx="4" fill="url(#techGradient)" opacity="0.9" />
            {/* RGB lighting strip */}
            <rect x="-26" y="42" width="52" height="2" rx="1" fill="#ff00ff" opacity="0.8">
              <animate attributeName="fill" values="#ff00ff; #00ffff; #ffff00; #ff00ff" dur="2s" repeatCount="indefinite" />
            </rect>
            {/* Gaming laptop screen */}
            <rect x="-26" y="-22" width="52" height="36" rx="3" fill="#1a1a1a" opacity="0.9" />
            <rect x="-24" y="-20" width="48" height="32" rx="2" fill="#000" opacity="1" />
            {/* Game interface */}
            <rect x="-22" y="-18" width="44" height="28" rx="1" fill="#001122" opacity="0.9" />
            {/* Health bar */}
            <rect x="-20" y="-16" width="20" height="2" fill="#00ff00" opacity="0.8">
              <animate attributeName="width" values="20; 10; 20" dur="4s" repeatCount="indefinite" />
            </rect>
            {/* Mini-map */}
            <rect x="15" y="-16" width="6" height="6" fill="#333" opacity="0.8" />
            <circle cx="18" cy="-13" r="1" fill="#ff0000" opacity="0.9">
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Game elements */}
            <rect x="-18" y="-10" width="12" height="8" fill="#444" opacity="0.7" />
            <rect x="-15" y="-7" width="6" height="2" fill="#ff6600" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </g>
        </g>

        {/* Laptop 4 - MacBook */}
        <g transform={`translate(${650 + mousePosition.x * -40}, ${200 + mousePosition.y * 50})`}>
          <g className="hover:scale-125 transition-transform duration-700">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -6,7; 0,0"
              dur="12s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.06; 1"}
              dur="6s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* MacBook base - sleek design */}
            <rect x="-32" y="14" width="64" height="28" rx="6" fill="url(#techGradient)" opacity="0.9" />
            {/* Apple logo */}
            <circle cx="0" cy="28" r="3" fill="#ffffff" opacity="0.3" />
            {/* MacBook screen */}
            <rect x="-30" y="-24" width="60" height="40" rx="4" fill="#2a2a2a" opacity="0.9" />
            <rect x="-28" y="-22" width="56" height="36" rx="3" fill="#000" opacity="1" />
            {/* macOS interface */}
            <rect x="-26" y="-20" width="52" height="3" fill="#333" opacity="0.9" />
            {/* Traffic lights */}
            <circle cx="-22" cy="-18.5" r="1.5" fill="#ff5f56" />
            <circle cx="-18" cy="-18.5" r="1.5" fill="#ffbd2e" />
            <circle cx="-14" cy="-18.5" r="1.5" fill="#27ca3f" />
            {/* Xcode interface */}
            <rect x="-24" y="-15" width="20" height="25" fill="#1e1e1e" opacity="0.9" />
            <rect x="-2" y="-15" width="24" height="25" fill="#2d2d2d" opacity="0.9" />
            {/* Code syntax highlighting */}
            <rect x="-22" y="-12" width="8" height="1" fill="#ff7b72" opacity="0.8" />
            <rect x="-22" y="-10" width="12" height="1" fill="#79c0ff" opacity="0.8" />
            <rect x="-22" y="-8" width="6" height="1" fill="#a5d6ff" opacity="0.8" />
            <rect x="-22" y="-6" width="15" height="1" fill="#7ee787" opacity="0.8" />
            {/* File tree */}
            <rect x="0" y="-12" width="20" height="1" fill="#f0883e" opacity="0.7" />
            <rect x="0" y="-10" width="18" height="1" fill="#79c0ff" opacity="0.7" />
            <rect x="0" y="-8" width="16" height="1" fill="#a5d6ff" opacity="0.7" />
          </g>
        </g>

        {/* Code Symbols */}
        {/* Floating Code Brackets */}
        <g transform={`translate(${400 + mousePosition.x * 45}, ${100 + mousePosition.y * 25})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="15s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.1; 1"}
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
            <text fontSize="24" fill="url(#techGradient)" opacity={isHovered ? "0.9" : "0.6"} textAnchor="middle">
              &lt;/&gt;
              <animate attributeName="opacity" values="0.4; 0.9; 0.4" dur="4s" repeatCount="indefinite" />
            </text>
          </g>
        </g>

        {/* Floating Code Braces */}
        <g transform={`translate(${1300 + mousePosition.x * -25}, ${250 + mousePosition.y * 35})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="360; 0"
              dur="18s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.08; 1"}
              dur="3.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            <text fontSize="28" fill="url(#techGradient)" opacity={isHovered ? "0.9" : "0.7"} textAnchor="middle">
              &#123;&#125;
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="3s" repeatCount="indefinite" />
            </text>
          </g>
        </g>

        {/* Floating Function Symbol */}
        <g transform={`translate(${700 + mousePosition.x * 55}, ${320 + mousePosition.y * -10})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 180; 360"
              dur="20s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.6; 1" : "1; 1.12; 1"}
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            <text fontSize="22" fill="url(#techGradient)" opacity={isHovered ? "0.9" : "0.6"} textAnchor="middle">
              fn()
              <animate attributeName="opacity" values="0.4; 0.8; 0.4" dur="5s" repeatCount="indefinite" />
            </text>
          </g>
        </g>

        {/* Git Branch Symbol */}
        <g transform={`translate(${950 + mousePosition.x * -20}, ${150 + mousePosition.y * 40})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="25s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.06; 1"}
              dur="4.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Git branch lines */}
            <path d="M-10,-5 Q0,0 10,5 M-10,5 Q0,0 10,-5" stroke="url(#techGradient)" strokeWidth="2" fill="none" opacity={isHovered ? "0.9" : "0.6"}>
              <animate attributeName="stroke-dasharray" values="0,20; 20,0; 0,20" dur="6s" repeatCount="indefinite" />
            </path>
            <circle cx="-10" cy="-5" r="3" fill="url(#techGradient)" opacity="0.8" />
            <circle cx="10" cy="5" r="3" fill="url(#techGradient)" opacity="0.8" />
            <circle cx="0" cy="0" r="2" fill="url(#flowerGradient)" opacity="0.9" />
          </g>
        </g>

        {/* Database Symbol */}
        <g transform={`translate(${500 + mousePosition.x * 35}, ${480 + mousePosition.y * 20})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 6,-4; 0,0"
              dur="7s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.1; 1"}
              dur="3.8s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Database cylinder */}
            <ellipse cx="0" cy="-10" rx="15" ry="4" fill="url(#techGradient)" opacity="0.8" />
            <rect x="-15" y="-10" width="30" height="20" fill="url(#techGradient)" opacity="0.7" />
            <ellipse cx="0" cy="10" rx="15" ry="4" fill="url(#techGradient)" opacity="0.8" />
            <ellipse cx="0" cy="0" rx="15" ry="4" fill="url(#techGradient)" opacity="0.6">
              <animate attributeName="opacity" values="0.4; 0.8; 0.4" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* API Symbol */}
        <g transform={`translate(${1100 + mousePosition.x * -45}, ${380 + mousePosition.y * 30})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="16s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.09; 1"}
              dur="4.2s"
              repeatCount="indefinite"
              additive="sum"
            />
            <text fontSize="18" fill="url(#techGradient)" opacity={isHovered ? "0.9" : "0.6"} textAnchor="middle">
              API
              <animate attributeName="opacity" values="0.4; 0.9; 0.4" dur="3.5s" repeatCount="indefinite" />
            </text>
            {/* Connection lines */}
            <circle cx="0" cy="0" r="20" fill="none" stroke="url(#techGradient)" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="20; 25; 20" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* React Logo Symbol */}
        <g transform={`translate(${250 + mousePosition.x * 65}, ${400 + mousePosition.y * -35})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.6; 1" : "1; 1.12; 1"}
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* React atom structure */}
            <ellipse cx="0" cy="0" rx="25" ry="8" fill="none" stroke="#61DAFB" strokeWidth="2" opacity="0.7">
              <animate attributeName="stroke-dasharray" values="0,100; 50,50; 0,100" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="0" rx="25" ry="8" fill="none" stroke="#61DAFB" strokeWidth="2" opacity="0.7" transform="rotate(60)">
              <animate attributeName="stroke-dasharray" values="0,100; 50,50; 0,100" dur="4s" repeatCount="indefinite" begin="1s" />
            </ellipse>
            <ellipse cx="0" cy="0" rx="25" ry="8" fill="none" stroke="#61DAFB" strokeWidth="2" opacity="0.7" transform="rotate(120)">
              <animate attributeName="stroke-dasharray" values="0,100; 50,50; 0,100" dur="4s" repeatCount="indefinite" begin="2s" />
            </ellipse>
            <circle cx="0" cy="0" r="4" fill="#61DAFB" opacity="0.9">
              <animate attributeName="r" values="4; 6; 4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* Node.js Symbol */}
        <g transform={`translate(${1350 + mousePosition.x * -55}, ${150 + mousePosition.y * 45})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="12s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.08; 1"}
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Node.js hexagon */}
            <polygon points="-12,0 -6,-10 6,-10 12,0 6,10 -6,10" fill="#339933" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="3s" repeatCount="indefinite" />
            </polygon>
            <text x="0" y="3" fontSize="8" fill="#ffffff" textAnchor="middle" opacity="0.9">N</text>
          </g>
        </g>

        {/* TypeScript Symbol */}
        <g transform={`translate(${750 + mousePosition.x * 30}, ${350 + mousePosition.y * 40})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="14s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.1; 1"}
              dur="3.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#3178C6" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="4s" repeatCount="indefinite" />
            </rect>
            <text x="0" y="4" fontSize="12" fill="#ffffff" textAnchor="middle" fontWeight="bold">TS</text>
          </g>
        </g>

        {/* Docker Symbol */}
        <g transform={`translate(${450 + mousePosition.x * -25}, ${250 + mousePosition.y * 55})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 8,6; 0,0"
              dur="9s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.3; 1" : "1; 1.07; 1"}
              dur="5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Docker container blocks */}
            <rect x="-15" y="-8" width="30" height="16" rx="2" fill="#2496ED" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="4s" repeatCount="indefinite" />
            </rect>
            <rect x="-12" y="-5" width="6" height="3" fill="#ffffff" opacity="0.7" />
            <rect x="-3" y="-5" width="6" height="3" fill="#ffffff" opacity="0.7" />
            <rect x="6" y="-5" width="6" height="3" fill="#ffffff" opacity="0.7" />
            <rect x="-12" y="0" width="6" height="3" fill="#ffffff" opacity="0.7" />
            <rect x="-3" y="0" width="6" height="3" fill="#ffffff" opacity="0.7" />
            <rect x="6" y="0" width="6" height="3" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        {/* VS Code Symbol */}
        <g transform={`translate(${1200 + mousePosition.x * 40}, ${250 + mousePosition.y * -20})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="18s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.4; 1" : "1; 1.09; 1"}
              dur="4.5s"
              repeatCount="indefinite"
              additive="sum"
            />
            {/* VS Code icon shape */}
            <path d="M-12,-12 L12,-6 L12,6 L-12,12 L-8,0 Z" fill="#007ACC" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="3.5s" repeatCount="indefinite" />
            </path>
            <path d="M-8,-8 L8,-2 L8,2 L-8,8 Z" fill="#ffffff" opacity="0.9" />
          </g>
        </g>

        {/* GitHub Symbol */}
        <g transform={`translate(${600 + mousePosition.x * -35}, ${450 + mousePosition.y * 25})`}>
          <g className="hover:scale-150 transition-transform duration-500">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0; 360"
              dur="20s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values={isHovered ? "1; 1.5; 1" : "1; 1.11; 1"}
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
            <circle cx="0" cy="0" r="12" fill="#333333" opacity="0.8">
              <animate attributeName="opacity" values="0.6; 1; 0.6" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* GitHub cat silhouette */}
            <circle cx="-3" cy="-6" r="2" fill="#ffffff" opacity="0.9" />
            <circle cx="3" cy="-6" r="2" fill="#ffffff" opacity="0.9" />
            <path d="M-4,-2 Q0,2 4,-2 Q2,4 0,3 Q-2,4 -4,-2" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
      </g>

      {/* Tech Circuit Patterns */}
      <g className="circuit-patterns" opacity={isHovered ? "0.4" : "0.2"}>
        {Array.from({ length: 15 }, (_, i) => (
          <circle
            key={i}
            cx={100 + (i * 120) % 1920}
            cy={50 + (i * 80) % 500}
            r="2"
            fill="url(#techGradient)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${10 + mousePosition.x * 20},${5 + mousePosition.y * 15}; 0,0`}
              dur={`${3 + (i % 3)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2; 0.8; 0.2"
              dur={`${2 + (i % 2)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* Interactive Cursor Effect */}
      {isHovered && (
        <g transform={`translate(${mousePosition.x * 1920}, ${mousePosition.y * 1080})`}>
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="none"
            stroke="url(#techGradient)"
            strokeWidth="2"
            opacity="0.6"
          >
            <animate attributeName="r" values="20; 40; 20" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle
            cx="0"
            cy="0"
            r="5"
            fill="url(#flowerGradient)"
            opacity="0.8"
          >
            <animate attributeName="r" values="5; 8; 5" dur="0.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Ambient light effects */}
      <g className="ambient-light" opacity="0.3">
        <ellipse cx="400" cy="200" rx="100" ry="50" fill="url(#flowerGradient)">
          <animate attributeName="opacity" values="0.1; 0.3; 0.1" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="1500" cy="300" rx="80" ry="40" fill="url(#techGradient)">
          <animate attributeName="opacity" values="0.1; 0.4; 0.1" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="900" cy="500" rx="120" ry="60" fill="url(#oceanGradient)">
          <animate attributeName="opacity" values="0.1; 0.2; 0.1" dur="10s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  );
}
