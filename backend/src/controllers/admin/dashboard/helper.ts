import { CountStat } from "./dashboard.interface";

export const formattedCountData = (countData:CountStat[],fullYear:boolean=false)=>{
    
// Determine the maximum month from the query result
const maxMonth =fullYear?12: Math.max(...countData.map((item) => item.month));

// Define arrays for labels and data
const labels: string[] = [];
const data: number[] = [];

// Initialize data array with zeros for all months up to the maximum month
for (let month = 1; month <= maxMonth; month++) {
  labels.push(new Date(`1998-${month}-01`).toLocaleString('default', { month: 'short' }));
  const monthData = countData.find((item) => item.month === month);
  data.push(monthData ? Number(monthData.count) : 0);
}

return { labels, data };
}