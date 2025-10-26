import React, { useState } from "react";
import { Line } from "react-chartjs-2";
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

  // Fetch data count
  const { data, loading, refetch, error } = useGetData(`/admin/counts.php`);

  const stats = [
    {
      title: "Room Pending Booking",
      value: data ? data.pendingRoomBookings : "-",
      //  percent: data ? `+${data.pendingRoomBookings}%` : "-",
      color: "green",
    },
    {
      title: "Function Hall Bookings",
      value: data ? data.functionHallBookings : "-",
      // percent: data ? `+${data.functionHallBookings}%` : "-",
      color: "red",
    },
    {
      title: "Not Verified Users",
      value: data ? data.notVerifiedUsers : "-",
      // percent: data ? `+${data.notVerifiedUsers}%` : "-",
      color: "blue",
    },
    {
      title: "Verified Users",
      value: data ? data.verifiedUsers : "-",
      // percent: data ? `+${data.verifiedUsers}%` : "-",
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

  // Dummy bookings grouped by year
  const bookingsByYear = {
    2023: [20, 30, 40, 50, 35, 60, 45, 55, 65, 70, 80, 90],
    2024: [25, 35, 30, 60, 50, 75, 60, 70, 80, 90, 100, 110],
    2025: [45, 60, 40, 80, 75, 90, 85, 95, 100, 110, 120, 130],
  };

  const chartData = {
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
        label: `Bookings in ${selectedYear}`,
        data: bookingsByYear[selectedYear],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Bookings Per Month - ${selectedYear}` },
    },
  };

  return (
    <div className="dark:bg-gray-800 bg-gray-100 min-h-screen">
      <h1 className="text-lg font-bold mb-4 dark:text-white text-black">
        Dashboard Overview
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md flex flex-col justify-between"
          >
            <h2 className="text-sm text-gray-600 dark:text-gray-200 font-medium">
              {item.title}
            </h2>
            <p className={`text-2xl font-bold text-${item.color}-500`}>
              {item.value}
            </p>
            <span className={`text-sm text-${item.color}-400`}>
              {item.percent}
            </span>
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
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Graph */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
