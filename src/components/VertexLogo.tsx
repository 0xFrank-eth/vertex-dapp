interface VertexLogoProps {
  size?: number;
}

export function VertexLogo({ size = 28 }: VertexLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-left node */}
      <rect x="0" y="0" width="5" height="5" fill="#22c55e" />

      {/* Top-right node */}
      <rect x="27" y="0" width="5" height="5" fill="#22c55e" />

      {/* Bottom-center node */}
      <rect x="13.5" y="27" width="5" height="5" fill="#22c55e" />

      {/* Top connector — thin edge, network feel */}
      <line
        x1="5" y1="2.5"
        x2="27" y2="2.5"
        stroke="#22c55e"
        strokeWidth="1"
        strokeOpacity="0.35"
      />

      {/* V left arm */}
      <line
        x1="2.5" y1="5"
        x2="16" y2="27"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="square"
      />

      {/* V right arm */}
      <line
        x1="29.5" y1="5"
        x2="16" y2="27"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
