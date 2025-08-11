"use client";

interface DayCardProps {
  day: string;
  date: number;
  month?: string;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  date,
  month,
  isToday,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center text-center
        px-6 py-3 rounded-lg flex-shrink-0
        cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-white border-2 border-primary shadow-md -mt-1"
            : "bg-white border-2 border-primary-grey"
        }
      `}
    >
      <span
        className={`
        text-sm mb-1
        ${isSelected ? "text-primary" : "text-gray-400"}
      `}
      >
        {day}
      </span>

      <span
        className={`
        text-2xl font-bold text-center
        ${isSelected ? "text-primary" : "text-gray-400"}
      `}
      >
        {date}
      </span>

      {month && (
        <span
          className={`
          text-xs mt-1
          ${isSelected ? "text-primary" : "text-gray-400"}
        `}
        >
          {month}
        </span>
      )}

      {isToday && (
        <span
          className={`text-xs mt-1 ${
            isSelected ? "text-primary" : "text-gray-400"
          }`}
        >
          오늘
        </span>
      )}
    </div>
  );
};

export default DayCard;
