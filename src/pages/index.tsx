import { type CellData, HabitGrid } from "../components/habit-grid";

// Sample tooltip component
function CustomTooltip({ cell }: { cell: CellData }) {
  return (
    <div className="absolute z-10 left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="bg-gray-800 text-white p-2 rounded shadow-lg text-sm">
        <div className="font-bold">{cell.date.toLocaleDateString()}</div>
        <div>Value: {cell.value}</div>
        <div>Activity: {cell.activityLevel}</div>
      </div>
    </div>
  );
}

// Generate sample data for the last 30 days
function generateSampleData(days: number): Array<CellData> {
  let data: Array<CellData> = [];
  let today = new Date();

  for (let i = 0; i < days; i++) {
    let date = new Date(today);
    date.setDate(today.getDate() - i);

    // Generate a random value between 0 and 10
    let value = Math.floor(Math.random() * 11);

    data.push({
      date,
      value,
    });
  }

  return data;
}

export default async function HomePage() {
  // Generate sample data for different time ranges
  let weekData = generateSampleData(7);
  let monthData = generateSampleData(30);
  let yearData = generateSampleData(365);

  return (
    <div className="container mx-auto p-4">
      <title>Habit Grid</title>
      <h1 className="text-4xl font-bold tracking-tight mb-6">Habit Grid</h1>
      <p className="mb-8">A GitHub-like grid of habits</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Weekly View</h2>
          <HabitGrid
            data={weekData}
            TooltipComponent={CustomTooltip}
            className="max-w-md"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Monthly View</h2>
          <HabitGrid
            data={monthData}
            TooltipComponent={CustomTooltip}
            className="max-w-3xl"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Yearly View</h2>
          <HabitGrid
            data={yearData}
            TooltipComponent={CustomTooltip}
            className="max-w-5xl"
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Custom Colors</h2>
          <HabitGrid
            data={weekData}
            colors={{
              none: "bg-gray-200",
              minimal: "bg-blue-300",
              average: "bg-blue-500",
              high: "bg-blue-700",
            }}
            className="max-w-md"
          />
        </section>
      </div>
    </div>
  );
}

export let getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
