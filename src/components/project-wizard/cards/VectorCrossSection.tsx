
import React from 'react';

interface VectorCrossSectionProps {
  upperWidth: number;
  depth: number;
  lowerWidth: number;
}

const VectorCrossSection: React.FC<VectorCrossSectionProps> = ({ 
  upperWidth, 
  depth, 
  lowerWidth 
}) => {
  // SVG dimensions
  const svgWidth = 400;
  const svgHeight = 300;
  const margin = 50;
  
  // Calculate scaling factors
  const maxWidth = Math.max(upperWidth, lowerWidth);
  const scaleX = (svgWidth - 2 * margin) / maxWidth;
  const scaleY = (svgHeight - 2 * margin) / depth;
  
  // Calculate points for the trapezoid
  const centerX = svgWidth / 2;
  const topY = margin;
  const bottomY = svgHeight - margin;
  
  const upperHalfWidth = (upperWidth * scaleX) / 2;
  const lowerHalfWidth = (lowerWidth * scaleX) / 2;
  
  // Trapezoid points
  const points = [
    `${centerX - upperHalfWidth},${topY}`, // Top left
    `${centerX + upperHalfWidth},${topY}`, // Top right
    `${centerX + lowerHalfWidth},${bottomY}`, // Bottom right
    `${centerX - lowerHalfWidth},${bottomY}` // Bottom left
  ].join(' ');
  
  return (
    <div className="w-full h-64 bg-white border rounded-lg flex items-center justify-center">
      <svg width={svgWidth} height={svgHeight} className="border">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Water level (optional) */}
        <rect 
          x={centerX - upperHalfWidth} 
          y={topY + (bottomY - topY) * 0.3} 
          width={upperWidth * scaleX} 
          height={(bottomY - topY) * 0.5}
          fill="#3b82f6" 
          fillOpacity="0.3"
        />
        
        {/* Channel cross-section */}
        <polygon 
          points={points}
          fill="none"
          stroke="#1f2937"
          strokeWidth="2"
        />
        
        {/* Dimension lines and labels */}
        {/* Upper width */}
        <line 
          x1={centerX - upperHalfWidth} 
          y1={topY - 20} 
          x2={centerX + upperHalfWidth} 
          y2={topY - 20}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX - upperHalfWidth} 
          y1={topY - 25} 
          x2={centerX - upperHalfWidth} 
          y2={topY - 15}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX + upperHalfWidth} 
          y1={topY - 25} 
          x2={centerX + upperHalfWidth} 
          y2={topY - 15}
          stroke="#374151" 
          strokeWidth="1"
        />
        <text 
          x={centerX} 
          y={topY - 25} 
          textAnchor="middle" 
          className="text-xs font-medium fill-gray-700"
        >
          Upper Width: {upperWidth}m
        </text>
        
        {/* Depth */}
        <line 
          x1={centerX - upperHalfWidth - 20} 
          y1={topY} 
          x2={centerX - upperHalfWidth - 20} 
          y2={bottomY}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX - upperHalfWidth - 25} 
          y1={topY} 
          x2={centerX - upperHalfWidth - 15} 
          y2={topY}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX - upperHalfWidth - 25} 
          y1={bottomY} 
          x2={centerX - upperHalfWidth - 15} 
          y2={bottomY}
          stroke="#374151" 
          strokeWidth="1"
        />
        <text 
          x={centerX - upperHalfWidth - 35} 
          y={(topY + bottomY) / 2} 
          textAnchor="middle" 
          className="text-xs font-medium fill-gray-700"
          transform={`rotate(-90 ${centerX - upperHalfWidth - 35} ${(topY + bottomY) / 2})`}
        >
          Depth: {depth}m
        </text>
        
        {/* Lower width */}
        <line 
          x1={centerX - lowerHalfWidth} 
          y1={bottomY + 20} 
          x2={centerX + lowerHalfWidth} 
          y2={bottomY + 20}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX - lowerHalfWidth} 
          y1={bottomY + 15} 
          x2={centerX - lowerHalfWidth} 
          y2={bottomY + 25}
          stroke="#374151" 
          strokeWidth="1"
        />
        <line 
          x1={centerX + lowerHalfWidth} 
          y1={bottomY + 15} 
          x2={centerX + lowerHalfWidth} 
          y2={bottomY + 25}
          stroke="#374151" 
          strokeWidth="1"
        />
        <text 
          x={centerX} 
          y={bottomY + 35} 
          textAnchor="middle" 
          className="text-xs font-medium fill-gray-700"
        >
          Lower Width: {lowerWidth}m
        </text>
        
        {/* Title */}
        <text 
          x={centerX} 
          y={20} 
          textAnchor="middle" 
          className="text-sm font-semibold fill-gray-800"
        >
          Hydraulic Cross-Section Design
        </text>
      </svg>
    </div>
  );
};

export default VectorCrossSection;
