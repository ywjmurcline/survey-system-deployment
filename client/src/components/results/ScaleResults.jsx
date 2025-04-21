import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const ScaleResults = ({ minLabel, maxLabel, responses }) => {
  console.log(minLabel, maxLabel);
  if (!responses ) return null;
  // responses = {"A": 7, "B": 3};

  const entries = Object.entries(responses).reverse();

  console.log(entries);

  const weightedSum = entries.reduce((acc, [key, weight]) => acc + Number(key) * weight, 0);
  const totalWeight = entries.reduce((acc, [_, weight]) => acc + weight, 0);
  const average = weightedSum / totalWeight ;

  const data = entries.map(([key, value]) => {
    return {
      name: key,
      value,
      backgroundValue: (1 - (value / totalWeight)) * 500,
      percentage: (value / totalWeight) * 500,
      fill: '#B5DCFF',
    };
  });

  console.log(data);
  // Calculate average rating


  // return (
  //   <div className="results-container">
  //     <div className="results-header">
  //       <div className="average-rating">
  //         <span>Average Rating: <strong>{average}</strong></span>
  //         {minLabel && maxLabel && (
  //           <div className="scale-labels">
  //             <span>{minLabel}</span>
  //             <span>{maxLabel}</span>
  //           </div>
  //         )}
  //       </div>
  //     </div>
      
  //     <div style={{ width: '100%', height: 300 }}>
  //       <ResponsiveContainer>
  //         <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
  //           <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
  //           <YAxis hide />
  //           <Tooltip />
  //           <Bar dataKey="value" radius={[8, 8, 0, 0]}> 
  //             <LabelList dataKey="value" position="top" fill="#3F3F3F" formatter={(value) => value} />
  //             {data.map((entry, index) => (
  //               <Cell key={`cell-${index}`} fill={entry.fill} />
  //             ))}
  //           </Bar>
  //         </BarChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>
  // );
  return (
    <div className="results-container">
    <div className="results-header">
      <div className="average-rating">
        <span>Average Rating: <strong>{average.toPrecision(4)}</strong></span>
      </div>
    </div>
    <br />

    <div>{maxLabel}</div>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <YAxis dataKey="name" type="category" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
          <XAxis type="number" hide domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value}%`} />



          {/* Foreground bar */}
          <Bar dataKey="percentage" stackId="stack" radius={[0, 0, 0, 0]} barSize={20}>
            <LabelList dataKey="precentage" position="right" formatter={(percentage) => `${percentage}%`} fill="#666666" />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
          {/* Background bar */}
          <Bar dataKey="backgroundValue" stackId="stack" radius={[0, 0, 0, 0]} barSize={20}>
            {data.map((_, index) => (
              <Cell key={`bg-${index}`} fill="#e0e0e0" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div>{minLabel}</div>
  </div>
  );
};

export default ScaleResults;