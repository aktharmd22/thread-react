import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const chartData = [
  { name: 'Category 1', value: 40, color: '#ff6384' },
  { name: 'Category 2', value: 60, color: '#36a2eb' }
];



const Dashboard = () => {
  return (
    <div>
      <div style={{
        position: 'relative',
        height: '250px',
        width: '350px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#5bf1a6'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}>
          <PieChart width={350} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8" // This is the fill color for sectors, not the border color
              paddingAngle={5}
              label
              cornerRadius={4}
              stroke="none" // Set stroke to none to remove the pie border
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <h2 style={{
          "margin-top": '-11px',
          padding: 0,
          color: 'white',
          fontSize: '20px', // Adjust the font size as needed
          fontWeight: 'bold' // Adjust the font weight as needed
        }}>
          {chartData.reduce((acc, data) => acc + data.value, 0)} Attacks
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
