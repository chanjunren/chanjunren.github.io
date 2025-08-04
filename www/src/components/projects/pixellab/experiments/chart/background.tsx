export function Background({ data }) {
  return (
    <g>
      <g strokeWidth="0.3">
        <polygon
          points="50,20 22,40 32,74 68,74 78,40"
          stroke="var(--ifm-font-color-base)"
          fill="var(--ifm-background-color)"
        />
        <g
          stroke="var(--ifm-font-color-base)"
          strokeDasharray="0.5"
          fill="none"
        >
          <polygon points="50,44 45,48 47,54 53,54 55,48" />
          <line x1="50" y1="20" x2="50" y2="44" />
          <line x1="22" y1="40" x2="45" y2="48" />
          <line x1="32" y1="74" x2="47" y2="54" />
          <line x1="68" y1="74" x2="53" y2="54" />
          <line x1="78" y1="40" x2="55" y2="48" />
          <g stroke="var(--ifm-font-color-base)" strokeOpacity="0.26">
            <polygon points="50,40 41,47 44,58 56,58 59,47" />
            <polygon points="50,35 36,45 41,62 59,62 64,45" />
            <polygon points="50,30 31,43 38,66 62,66 69,43" />
            <polygon points="50,25 26,42 35,70 65,70 74,42" />
          </g>
        </g>
      </g>
      <g
        style={{ fill: "var(--gray11)" }}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="3"
      >
        {/* <text x="50" y="15">
          Neutral {data.neutral}
        </text>
        <text x="15" y="39">
          Sell {data.sell}
        </text>
        <text x="29" y="80">
          Strong sell {data.strongSell}
        </text>
        <text x="71" y="80">
          Strong buy {data.strongBuy}
        </text>
        <text x="85" y="39">
          Buy {data.buy}
        </text> */}
      </g>
    </g>
  );
}
