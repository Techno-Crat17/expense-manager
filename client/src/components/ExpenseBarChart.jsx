import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseBarChart = ({ monthlyTrend = {} }) => {
  const months = Object.keys(monthlyTrend);

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-slate-400 dark:text-slate-500 glass-card rounded-2xl border border-dashed border-white/20">
        <p className="text-xs font-bold uppercase tracking-wider">No monthly transaction trend data available</p>
      </div>
    );
  }

  const incomeData = months.map((m) => monthlyTrend[m]?.income || 0);
  const expenseData = months.map((m) => monthlyTrend[m]?.expense || 0);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Income (₹)',
        data: incomeData,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#10b981';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
          gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.8)');
          gradient.addColorStop(1, 'rgba(110, 231, 183, 1)');
          return gradient;
        },
        hoverBackgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#34d399';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(52, 211, 153, 0.7)');
          gradient.addColorStop(1, 'rgba(167, 243, 208, 1)');
          return gradient;
        },
        borderColor: '#34d399',
        borderWidth: 1.5,
        borderRadius: 12,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.65,
      },
      {
        label: 'Expense (₹)',
        data: expenseData,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#f43f5e';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(225, 29, 72, 0.4)');
          gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.8)');
          gradient.addColorStop(1, 'rgba(251, 113, 133, 1)');
          return gradient;
        },
        hoverBackgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#fb7185';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.7)');
          gradient.addColorStop(1, 'rgba(254, 205, 211, 1)');
          return gradient;
        },
        borderColor: '#fb7185',
        borderWidth: 1.5,
        borderRadius: 12,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.65,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1400,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '700',
          },
          color: '#94a3b8',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        titleFont: { family: 'Inter, sans-serif', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter, sans-serif', size: 12, weight: '600' },
        padding: 14,
        boxPadding: 8,
        usePointStyle: true,
        cornerRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        callbacks: {
          label: function (context) {
            const rawVal = Number(context.parsed.y || 0);
            return ` ${context.dataset.label}: ₹${rawVal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '700',
          },
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '600',
          },
          color: '#94a3b8',
          callback: function (value) {
            if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L';
            if (value >= 1000) return '₹' + (value / 1000).toFixed(0) + 'k';
            return '₹' + value;
          },
        },
      },
    },
  };

  return (
    <div className="h-72 w-full pt-2">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseBarChart;
