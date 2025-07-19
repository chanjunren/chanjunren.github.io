export default function Shapes() {
  return (
    <g stroke="currentColor" strokeWidth="2">
      <circle r="20" fill="#205d9e" cx="70" cy="40" />
      <circle r="20" fill="none" cx="200" cy="70" />
      <rect
        fill="#ef4444"
        x="100"
        y="60"
        width="40"
        height="40"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: "rotate(45deg)",
        }}
      />
      <rect
        fill="#22c55e"
        x="-5"
        y="40"
        width="40"
        height="40"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: "rotate(45deg)",
        }}
      />
      <rect fill="#205d9e" x="220" y="-10" width="40" height="40" />
      <polygon
        points="0 40, 40 40, 40 0"
        fill="#eab308"
        transform="translate(140 0)"
      />
    </g>
  );
}
