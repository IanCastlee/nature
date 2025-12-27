import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { icons } from "../../constant/icon";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import useGetData from "../../hooks/useGetData";
import Button from "../admin_atoms/Button";
import CurrentOccupants from "./CurrentOccupants";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [chartData, setChartData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Paid Bookings",
        data: Array(12).fill(0),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });

  const [showCurrentOccupants, setShowCurrentOccupants] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  // Fetch general counts
  const { data, loading, refetch, error } = useGetData(`/admin/counts.php`);

  // Fetch bookings per month using the reusable hook
  const {
    data: chartInfo,
    loading: chartLoading,
    refetch: refetchChart,
  } = useGetData(`/admin/get-bookings-per-month.php?year=${selectedYear}`);

  // Update chart data whenever chartInfo changes
  useEffect(() => {
    if (chartInfo && chartInfo.monthlyPaid) {
      setChartData({
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Paid Bookings",
            data: chartInfo.monthlyPaid,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
          },
        ],
      });
    }
  }, [chartInfo]);

  const stats = [
    {
      title: "Pending Room Bookings",
      value: data ? data.pendingRoomBookings : "-",
      color: "green",
    },
    {
      title: "Pending Function Hall Bookings",
      value: data ? data.functionHallBookings : "-",
      color: "red",
    },
    {
      title: "Most Booked Room",
      value: data ? data.mostBookedRooms.join(", ") : "-",
      color: "blue",
    },
    {
      title: "Most Booked Function Hall",
      value: data ? data.mostBookedHalls.join(", ") : "-",
      color: "yellow",
    },
  ];

  const facilities = [
    {
      title: "Rooms",
      color: "green",
      details: [
        { label: "Available Rooms", value: data ? data.availableRooms : "-" },
        {
          label: "Not Available Rooms",
          value: data ? data.notAvailableRooms : "-",
        },
      ],
    },
    {
      title: "Function Halls",
      color: "orange",
      details: [
        { label: "Available Rooms", value: data ? data.availableHalls : "-" },
        {
          label: "Not Available Rooms",
          value: data ? data.notAvailableHalls : "-",
        },
      ],
    },
    {
      title: "Cottages",
      color: "red",
      details: [
        {
          label: "Available Rooms",
          value: data ? data.availableCottages : "-",
        },
        {
          label: "Not Available Rooms",
          value: data ? data.notAvailableCottages : "-",
        },
      ],
    },
    {
      title: "Under Maintenance",
      color: "blue",
      details: [
        { label: "Room(s)", value: data ? data.roomsUnderMaintenance : "-" },
        {
          label: "Function Hall(s)",
          value: data ? data.hallsUnderMaintenance : "-",
        },
      ],
    },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Bookings Per Month - ${selectedYear}` },
    },
  };

  const {
    data: yearlyData,
    loading: yearlyLoading,
    refetch: refetchYearly,
  } = useGetData(`/admin/get-years.php`);

  useEffect(() => {
    if (yearlyData?.length) {
      setSelectedYear(yearlyData[0]);
    }
  }, [yearlyData]);

  return (
    <>
      <div className="dark:bg-gray-800 bg-gray-100 min-h-screen">
        <div className="w-full flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold mb-4 dark:text-white text-black">
            Dashboard Overview
          </h1>
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={() => setShowCurrentOccupants(true)}
              className="flex flex-row items-center h-[35px] bg-gray-700 hover:bg-gray-800 text-white text-xs font-medium px-3 rounded-md transition-colors"
              label={<>Current Occupants</>}
            />
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md flex flex-col justify-between border-l-4"
              style={{ borderLeftColor: item.color }}
            >
              <h2 className="text-sm text-gray-600 dark:text-gray-200 font-medium">
                {item.title}
              </h2>
              {Array.isArray(item.value) ? (
                <div
                  className={`flex flex-col mt-1 text-sm font-semibold text-${item.color}-500 space-y-1`}
                >
                  {item.value.map((val, idx) => (
                    <span key={idx}>{val}</span>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm font-semibold text-${item.color}-500 mt-1`}
                >
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Facilities */}
        <div>
          <h2 className="text-lg font-semibold mb-3 dark:text-white text-black">
            Facilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {facilities.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md flex flex-col justify-between border-l-4"
                style={{ borderLeftColor: item.color }}
              >
                <h2 className="text-sm text-gray-600 dark:text-gray-200 font-semibold">
                  {item.title}
                </h2>
                {item.details && (
                  <div className="mt-3 space-y-1">
                    {item.details.map((detail, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-gray-600 dark:text-gray-300"
                      >
                        <span>{detail.label}</span>
                        <span className="font-semibold">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-4 flex justify-end">
          <label className="text-xs text-gray-700 dark:text-gray-200 font-medium mr-2 self-center">
            Filter by Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border dark:bg-gray-900 dark:border-gray-500 dark:text-gray-200 rounded px-2 py-1 text-xs"
          >
            {yearlyLoading && <option>Loading...</option>}

            {!yearlyLoading &&
              yearlyData?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>

        {/* Graph */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
          {chartLoading ? (
            <p>Loading chart...</p>
          ) : (
            <>
              <Line data={chartData} options={options} />

              {/* Yearly Income */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Yearly Income ({selectedYear})
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₱{Number(chartInfo?.totalPaid || 0).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {showCurrentOccupants && (
        <CurrentOccupants close={() => setShowCurrentOccupants(false)} />
      )}
    </>
  );
};

export default Dashboard;
