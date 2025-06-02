import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getTopupStat } from "../../../store/features/dashboardSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

interface Dataset {
  label?: string;
  data: string[] | undefined;
  backgroundColor: string;
  borderWidth?: number;
  borderColor?: string;
  barThickness?: number;
}

interface ILineBar {
  labels: string[];
  datasets: Dataset[];
}

export function TopupStat() {
  const { topup_status, topupsCountByMonth } = useAppSelector(
    (state) => state.dashboard
  );
  const dispatch = useAppDispatch();
  const [year, setYear] = useState(currentYear);

  const [lineBarData, setData] = useState<ILineBar>({
    labels: [],
    datasets: [
      {
        label: "Topups",
        data: [],
        borderColor: "var(--primary)",
        backgroundColor: "var(--primary)",
      },
    ],
  });

  useEffect(() => {
    if (year) {
      dispatch(getTopupStat(year));
    }
  }, [year, dispatch]);

  useEffect(() => {
    const chart = () => {
      setData({
        labels: topupsCountByMonth.labels || [],
        datasets: [
          {
            data: topupsCountByMonth.data,
            barThickness: 20,
            backgroundColor: "var(--primary)",
            borderWidth: 0.5,
            label: "Topups",
          },
        ],
      });
    };
    chart();
    return () => {
      setData({
        labels: [],
        datasets: [
          {
            data: ["0"],
            backgroundColor: "var(--primary)",
            borderWidth: 1,
          },
        ],
      });
    };
  }, [topupsCountByMonth]);

  return (
    <>
      {topup_status === "loading" ? (
        <div role="topup_status" className="animate-pulse">
          <div className="w-full bg-slate-100 dark:bg-strokedark h-60"></div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs flex gap-4 items-center mb-2">
              <div className="font-semibold text-body dark:text-bodydark">
                Total no of topups
              </div>
              <div className="text-secondary dark:text-bodydark">|</div>
              <ul className="cursor-pointer flex items-center list-disc ml-2 gap-6">
                <li
                  className={`ml-0 ${
                    year === currentYear
                      ? "text-primary dark:text-primary"
                      : "text-secondary dark:text-bodydark"
                  }`}
                  onClick={() => setYear(currentYear)}
                >
                  This year
                </li>
              </ul>
            </div>
            <div className="max-h-60">
              {lineBarData.labels.length > 0 && (
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      x: {
                        grid: { drawOnChartArea: false },
                      },
                      y: {
                        ticks: { stepSize: 1 },
                        grid: { drawOnChartArea: false },
                      },
                    },
                    layout: { padding: 20 },
                    plugins: {
                      legend: { position: "bottom", display: false },
                      title: { display: false, text: "" },
                    },
                    elements: { bar: { borderRadius: 6, borderWidth: 1 } },
                  }}
                  data={lineBarData}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
