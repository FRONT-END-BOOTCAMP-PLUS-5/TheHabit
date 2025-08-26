import React from 'react';

interface ChallengeBadgeProps {
  challengeType: '21일' | '66일' | '무제한';
  className?: string;
}

const ChallengeBadge: React.FC<ChallengeBadgeProps> = ({ challengeType, className = '' }) => {
  const getBadgeStyle = () => {
    switch (challengeType) {
      case '21일':
        return {
          background: 'linear-gradient(135deg, #c0c0c0, #e5e5e5)',
          borderColor: '#a0a0a0',
          textColor: '#4a5568',
        };
      case '66일':
        return {
          background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
          borderColor: '#d4af37',
          textColor: '#744210',
        };
      case '무제한':
        return {
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
          borderColor: '#e53e3e',
          textColor: '#742a2a',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #c0c0c0, #e5e5e5)',
          borderColor: '#a0a0a0',
          textColor: '#4a5568',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg min-w-[4rem] ${className}`}
      style={
        {
          background: style.background,
          color: style.textColor,
          border: `2px solid ${style.borderColor}`,
          boxShadow: `0 0 8px #ffd700, 0 0 12px #ffd700, 0 0 16px #ffd700, inset 0 1px 0 ${style.borderColor}20`,
        } as React.CSSProperties
      }
    >
      {challengeType}
    </div>
  );
};

export default ChallengeBadge;
