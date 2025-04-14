import type React from "react";

export type ActivityLevel = "none" | "minimal" | "average" | "high";

export interface CellData {
  date: Date;
  value: number;
  activityLevel?: ActivityLevel;
}

export interface HabitGridProps {
  /**
   * The data for each cell in the grid
   */
  data: Array<CellData>;

  /**
   * Custom colors for activity levels
   * If not provided, default Tailwind colors will be used
   */
  colors?: {
    none: string;
    minimal: string;
    average: string;
    high: string;
  };

  /**
   * Optional tooltip component to display on hover
   */
  TooltipComponent?: React.ComponentType<{ cell: CellData }>;

  /**
   * Optional class name for the grid container
   */
  className?: string;
}

/**
 * Maps a numeric value to an activity level
 */
function getActivityLevel(value: number, maxValue: number): ActivityLevel {
  if (value === 0) return "none";
  if (value <= maxValue * 0.25) return "minimal";
  if (value <= maxValue * 0.75) return "average";
  return "high";
}

// Create a unique identifier for each week based on its first day
function getWeekKey(week: Array<CellData | null>, index: number): string {
  let firstDay = week.find((cell) => cell !== null);
  return firstDay
    ? `week-${firstDay.date.toISOString()}`
    : `empty-week-${index}`;
}

// Create a unique identifier for each day cell
function getDayKey(
  weekIndex: number,
  dayIndex: number,
  cell: CellData | null,
): string {
  if (cell === null) {
    return `empty-${weekIndex}-${dayIndex}`;
  }
  return `cell-${cell.date.toISOString()}`;
}

/**
 * HabitGrid component that displays a grid of squares representing activity over time
 */
export function HabitGrid({
  data,
  colors,
  TooltipComponent,
  className = "",
}: HabitGridProps) {
  let defaultColors = {
    none: "bg-gray-100",
    minimal: "bg-green-100",
    average: "bg-green-300",
    high: "bg-green-500",
  } as const;

  let cellColors = colors || defaultColors;

  let maxValue = Math.max(...data.map((cell) => cell.value));

  // Sort data by date
  let sortedData = [...data].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // Create a 7x53 grid (53 weeks x 7 days)
  let weeks: Array<Array<CellData | null>> = Array(53)
    .fill(null)
    .map(() => Array(7).fill(null));

  // Fill the grid with data
  for (let [index, cell] of sortedData.entries()) {
    let dayOfWeek = cell.date.getDay();
    let weekIndex = Math.floor(index / 7);
    if (weekIndex < 53) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      weeks[weekIndex]![dayOfWeek] = cell;
    }
  }

  return (
    <div className={className}>
      <div className="flex gap-0.5">
        {weeks.map((week, weekIndex) => (
          <div
            key={getWeekKey(week, weekIndex)}
            className="flex flex-col gap-0.5"
          >
            {week.map((cell, dayIndex) => {
              if (!cell) {
                return (
                  <div
                    key={getDayKey(weekIndex, dayIndex, null)}
                    className="w-[10px] h-[10px] bg-gray-50"
                  />
                );
              }

              let activityLevel =
                cell.activityLevel || getActivityLevel(cell.value, maxValue);
              let colorClass = cellColors[activityLevel];

              return (
                <div
                  key={getDayKey(weekIndex, dayIndex, cell)}
                  className="relative group"
                >
                  <div
                    className={`w-[10px] h-[10px] ${colorClass}`}
                    title={`${cell.date.toLocaleDateString()}: ${cell.value}`}
                  />

                  {TooltipComponent && (
                    <TooltipComponent cell={{ ...cell, activityLevel }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
