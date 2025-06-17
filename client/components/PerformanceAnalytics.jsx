import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import './PerformanceAnalytics.css'; // Import the CSS file

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceAnalytics = ({ userId }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(`/api/performance/${userId}`);
        const data = await response.json();
        setPerformanceData(data.performanceData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching performance data", error);
      }
    };

    fetchPerformanceData();
  }, [userId]);

  if (loading) return <div className="loading-message">Loading performance data...</div>;

  // Extract data for charting
  const subjects = [...new Set(performanceData.map((item) => item.subject))];
  const accuracyData = subjects.map((subject) => {
    const subjectData = performanceData.filter((item) => item.subject === subject);
    const totalScore = subjectData.reduce((acc, item) => acc + item.score, 0);
    const totalQuestions = subjectData.reduce((acc, item) => acc + item.totalQuestions, 0);
    return totalQuestions ? (totalScore / totalQuestions) * 100 : 0;
  });

  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: "Accuracy by Subject (%)",
        data: accuracyData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="performance-analytics">
      <h3>Quiz Performance Analytics</h3>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
