// components/DonutLogo.jsx
export default function DonutLogo({ size = 64, className = '' }) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-spin-slow ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Donut base */}
        <circle cx="32" cy="32" r="28" fill="#F9C784" />
        {/* Donut hole */}
        <circle cx="32" cy="32" r="12" fill="#fff" />
        {/* Chocolate glaze */}
        <path
          d="M32 10
            a22 22 0 1 0 0.01 0
            q0 7 7 7
            t7-7
            q0 7 7 7
            t7-7"
          fill="#7B3F00"
        />
        {/* Sprinkles */}
        <ellipse cx="45" cy="18" rx="2" ry="0.7" fill="#F87070" />
        <ellipse cx="22" cy="17" rx="2" ry="0.7" fill="#4ADE80" />
        <ellipse cx="40" cy="50" rx="2" ry="0.7" fill="#60A5FA" />
        <ellipse cx="28" cy="45" rx="2" ry="0.7" fill="#FACC15" />
        <ellipse cx="50" cy="38" rx="2" ry="0.7" fill="#A78BFA" />
        <ellipse cx="17" cy="39" rx="2" ry="0.7" fill="#F472B6" />
      </svg>
    </div>
  );
}
