// client/src/components/common/ResultsChart.jsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function ResultsChart({ poll }) {
  const data = {
    labels: poll.options.map(opt => opt.text),
    datasets: [{
      data: poll.options.map(opt => opt.votes),
      backgroundColor: [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
      ],
      borderWidth: 0,
      borderRadius: 8
    }]
  };

  return (
    <div className="chart-container">
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e293b',
              bodyColor: '#f8fafc',
              titleColor: '#94a3b8'
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#94a3b8' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }}
      />
    </div>
  );
}