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
        px-6 py-3 flex-shrink-0
        cursor-pointer transition-all duration-100
        ${
          isSelected
            ? "bg-white border-b-3 border-primary shadow-md"
            : "bg-white border-b-3 border-primary-grey"
        }
      `}
    >
      <span
        className={`
        text-sm mb-1
        ${isSelected ? "text-primary" : "text-primary-grey"}
      `}
      >
        {day}
      </span>

      <span
        className={`
        text-3xl font-bold text-center
        ${isSelected ? "text-primary" : "text-primary-grey"}
      `}
      >
        {date}
      </span>

      {month && (
        <span
          className={`
          text-xs font-bold mt-1
          ${isSelected ? "text-primary" : "text-primary-grey"}
        `}
        >
          {month}
        </span>
      )}

      {isToday && (
        <span
          className={`text-xs font-bold mt-1 ${
            isSelected ? "text-primary" : "text-primary-grey"
          }`}
        >
          오늘
        </span>
      )}
    </div>
  );
};

export default DayCard;
