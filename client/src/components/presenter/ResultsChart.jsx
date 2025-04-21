import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../../styles/results-chart.css';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ResultsChart = ({ questionType, responses, options }) => {
  if (!responses || responses.length === 0) {
    return <div className="no-responses">No responses yet</div>;
  }
  
  if (questionType === 'multiple-choice') {
    // Process data for multiple choice responses
    const counts = {};
    options.forEach(option => {
      counts[option.value] = 0;
    });
    
    responses.forEach(response => {
      if (Array.isArray(response)) {
        // Handle multiple selections
        response.forEach(r => {
          counts[r] = (counts[r] || 0) + 1;
        });
      } else {
        counts[response] = (counts[response] || 0) + 1;
      }
    });
    
    const chartData = {
      labels: options.map(option => option.text),
      datasets: [
        {
          label: 'Responses',
          data: options.map(option => counts[option.value] || 0),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ]
        },
      ],
    };
    
    return options.length <= 4 ? <Pie data={chartData} /> : <Bar data={chartData} />;
  }

  // Other question types would be handled here
  return <div>Unsupported question type</div>;
};

export default ResultsChart;