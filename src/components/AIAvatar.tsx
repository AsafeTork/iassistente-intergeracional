import './AIAvatar.css';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function AIAvatar({ size = 'md', className = '' }: Props) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const px = sizeMap[size];

  return (
    <span
      className={`ai-avatar ai-avatar--${size} ${className}`}
      role="img"
      aria-label="Assistente de IA"
    >
      <span className="ai-avatar-float ai-avatar-glow">
        <svg
          width={px}
          height={px}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antena */}
          <line x1="24" y1="4" x2="24" y2="12" stroke="#1351b4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="3" r="2.5" fill="#ffd23f" />

          {/* Cabeça */}
          <rect x="10" y="12" width="28" height="22" rx="8" stroke="#1351b4" strokeWidth="1.8" fill="none" />

          {/* Olhos */}
          <circle cx="18" cy="22" r="3" fill="#ffd23f" />
          <circle cx="30" cy="22" r="3" fill="#ffd23f" />
          <circle cx="19" cy="21" r="1" fill="#fff" />
          <circle cx="31" cy="21" r="1" fill="#fff" />

          {/* Sorriso sutil */}
          <path d="M19 29 Q24 32 29 29" stroke="#1351b4" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}
