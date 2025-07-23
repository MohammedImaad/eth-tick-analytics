import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [vwap, setVwap] = useState(null);
  const [stdDev, setStdDev] = useState(null);
  const [mvDevData, setMvDevData] = useState([]);

  const fetchVwap = async () => {
    try {
      const response = await fetch("http://localhost:5001/csv/vwap.csv");
      const text = await response.text();
      const lines = text.trim().split("\n");
      if (lines.length > 1) setVwap(parseFloat(lines[1]));
    } catch (err) {
      console.error("VWAP fetch error:", err);
    }
  };

  const fetchStdDev = async () => {
    try {
      const response = await fetch("http://localhost:5001/csv/stdDev.csv");
      const text = await response.text();
      const lines = text.trim().split("\n");
      if (lines.length > 1) setStdDev(parseFloat(lines[1]));
    } catch (err) {
      console.error("StdDev fetch error:", err);
    }
  };

  const fetchMvDev = async () => {
    try {
      const response = await fetch("http://localhost:5001/csv/mvDev.csv");
      const text = await response.text();
      const lines = text.trim().split("\n").slice(1); // skip header
      const cleaned = lines.map((l) => parseFloat(l)).filter((v) => !isNaN(v));
      setMvDevData(cleaned);
    } catch (err) {
      console.error("mvDev fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVwap();
    fetchStdDev();
    fetchMvDev();
    const interval = setInterval(() => {
      fetchVwap();
      fetchStdDev();
      fetchMvDev();
    }, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: mvDevData.map((_, i) => i),
    datasets: [
      {
        label: "mvDev",
        data: mvDevData,
        fill: false,
        backgroundColor: "#36a2eb",
        borderColor: "#0077ff",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Index" } },
      y: { title: { display: true, text: "Price" } },
    },
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>KDB+ Analytics Dashboard</h2>
      <div style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        <p><strong>VWAP:</strong> {vwap !== null ? vwap.toFixed(4) : "Loading..."}</p>
        <p><strong>Standard Deviation:</strong> {stdDev !== null ? stdDev.toFixed(4) : "Loading..."}</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h3>Moving Deviation (mvDev)</h3>
        {mvDevData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Loading mvDev data...</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
