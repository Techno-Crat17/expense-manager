import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColorStops = {
  Food: ['#f59e0b', '#fbbf24'],
  Shopping: ['#a855f7', '#c084fc'],
  Rent: ['#f97316', '#fb923c'],
  Salary: ['#10b981', '#34d399'],
  Education: ['#3b82f6', '#60a5fa'],
  Entertainment: ['#ec4899', '#f472b6'],
  Medical: ['#ef4444', '#f87171'],
  Transport: ['#06b6d4', '#22d3ee'],
  Bills: ['#6366f1', '#818cf8'],
  Investment: ['#14b8a6', '#2dd4bf'],
  Others: ['#64748b', '#94a3b8'],
};

const CategoryPieChart = ({ data = {} }) => {
  const categories = Object.keys(data);
  const amounts = Object.values(data);
  const totalAmount = amounts.reduce((acc, curr) => acc + Number(curr || 0), 0);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-slate-400 dark:text-slate-500 glass-card rounded-2xl border border-dashed border-white/20">
        <p className="text-xs font-bold uppercase tracking-wider">No category spending data recorded</p>
      </div>
    );
  }

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expense (₹)',
        data: amounts,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#8b5cf6';
          const cat = categories[context.dataIndex] || 'Others';
          const stops = categoryColorStops[cat] || ['#8b5cf6', '#a78bfa'];
          
          const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.right,
            chartArea.bottom
          );
          gradient.addColorStop(0, stops[0]);
          gradient.addColorStop(1, stops[1]);
          return gradient;
        },
        hoverBackgroundColor: (context) => {
          const cat = categories[context.dataIndex] || 'Others';
          const stops = categoryColorStops[cat] || ['#a78bfa', '#c4b5fd'];
          return stops[1];
        },
        borderWidth: 2,
        borderColor: 'rgba(15, 23, 42, 0.8)',
        hoverOffset: 10,
        borderRadius: 6,
        spacing: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '600',
          },
          color: '#94a3b8',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        titleFont: { family: 'Inter, sans-serif', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter, sans-serif', size: 12, weight: '600' },
        padding: 14,
        cornerRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const pct = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
            return ` ${label}: ₹${Number(value).toLocaleString('en-IN')} (${pct}%)`;
          },
        },
      },
    },
    cutout: '74%',
  };

  return (
    <div className="relative h-72 w-full flex items-center justify-center pt-2">
      <Doughnut data={chartData} options={options} />
      {/* Center Total Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Spent</span>
        <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5">
          ₹{totalAmount >= 100000 ? (totalAmount / 100000).toFixed(1) + 'L' : totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
};

export default CategoryPieChart;
