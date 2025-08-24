interface ChallengeBadgeProps {
  badge: string;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export default function ChallengeBadge({
  badge,
  size = 'md',
  showAnimation = true,
}: ChallengeBadgeProps) {
  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case '21일':
        return {
          className:
            'bg-gradient-to-r from-gray-300 to-gray-500 border-gray-200 shadow-gray-200/50',
          boxShadow: 'rgba(156, 163, 175, 0.5)',
        };
      case '66일':
        return {
          className:
            'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-300 shadow-yellow-300/50',
          boxShadow: 'rgba(234, 179, 8, 0.5)',
        };
      case '무제한':
        return {
          className: 'bg-gradient-to-r from-red-400 to-red-600 border-red-300 shadow-red-300/50',
          boxShadow: 'rgba(239, 68, 68, 0.5)',
        };
      default:
        return {
          className:
            'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-300 shadow-gray-300/50',
          boxShadow: 'rgba(156, 163, 175, 0.5)',
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs';
      case 'md':
        return 'px-2.5 py-0.5 text-sm';
      case 'lg':
        return 'px-3 py-1 text-base';
      default:
        return 'px-2.5 py-0.5 text-sm';
    }
  };

  const styles = getBadgeStyles(badge);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`${sizeClasses} font-bold text-white rounded-full shadow-lg border-2 ${
        showAnimation ? 'animate-pulse' : ''
      } ${styles.className}`}
      style={{
        boxShadow: `0 0 10px ${styles.boxShadow}`,
        animation: showAnimation ? 'glow 2s ease-in-out infinite alternate' : 'none',
      }}
    >
      {badge}
    </span>
  );
}
