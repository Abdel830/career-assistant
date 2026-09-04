export default function ScoreCircle({ score, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return 'oklch(0.70 0.20 145)'; // green
    if (score >= 60) return 'oklch(0.78 0.18 80)';  // yellow/orange
    if (score >= 40) return 'oklch(0.75 0.18 60)';   // orange
    return 'oklch(0.65 0.25 25)';                     // red
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="score-circle"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="score-circle-bg"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="score-circle-fill"
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ '--score-offset': offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-text-muted font-medium">/ 100</span>
      </div>
    </div>
  );
}
