import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const MCResults = ({ responses }) => {
  if (!responses ) return null;
  // responses = {"A": 7, "B": 3};

  const data = Object.entries(responses).map(([key, value]) => {

    return {
      name: key,
      value,
      fill: value === Math.max(...Object.values(responses)) ? '#215BA6' : '#B5DCFF',
      textColor: value === Math.max(...Object.values(responses)) ? '#215BA6' : '#B5DCFF'
    };
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}> 
            <LabelList dataKey="value" position="top" fill="#3F3F3F" formatter={(value) => value} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MCResults;