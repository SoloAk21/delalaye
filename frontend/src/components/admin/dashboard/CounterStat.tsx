import  {  useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import {  Line } from 'react-chartjs-2';
import {  useAppDispatch, useAppSelector } from '../../../store/store';
import { getCounterStat } from '../../../store/features/dashboardSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




      const currentDate = new Date();
      console.log(currentDate)
      const currentYear = currentDate.getFullYear();
      console.log(currentYear)
      interface Dataset {
      label?:string
      data:string[] | undefined
      backgroundColor:string
      borderWidth?:number
      borderColor?:string
      }
      interface ILineBar {
        labels:string[]
        datasets:Dataset[]
        
      }
export function CounterStat() {
   
    const {counter_status,usersByMonth,brokersByMonth,connectionsAcceptedByMonth} = useAppSelector(state=>state.dashboard)
    const dispatch = useAppDispatch();
const [year,setYear] = useState(currentYear);
const [activeTab,setActiveTab] = useState<'customers'|'brokers'|'connections'>('customers');

const [lineBarData,setData]= useState<ILineBar>({
  labels:[],
  datasets: [
    {
      label: 'Brokers',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
})
     
useEffect(() => {
  if(year){
    dispatch(getCounterStat(year));
  }
}, [year])



useEffect(() => {
let chartToShow= usersByMonth;
if(activeTab==='brokers') chartToShow= brokersByMonth;
if(activeTab==='connections') chartToShow= connectionsAcceptedByMonth;
  const chart = ()=>{
    setData({
    labels:chartToShow.labels ||[],
    datasets: [
      {
        data: chartToShow.data ,
        borderColor: 'rgb(254 154 60)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth:2
      },
    ],
  })
  }
  chart();
  return () => {
    setData({
      labels:[],
      datasets: [
        {
          data: ['0'] ,
          backgroundColor: 'rgba(1, 137, 13, 0.8)',
          borderWidth: 1,
        },
      ],
    })
  }
}, [activeTab,usersByMonth]);




    
  return <> 
 { counter_status==='loading' ?  <div role="counter_status" className=" animate-pulse   ">
    <div className="w-full  bg-slate-100 h-60 "></div>
    </div> : <div className=' p-4'>
  <div className='flex flex-col gap-2' >
    <div className="text-xs flex gap-4 items-center mb-2">
      <div className={`cursor-pointer ${activeTab==='customers'?'font-semibold':'text-secondary'}`} onClick={()=>setActiveTab('customers')}>Customers</div>
      <div className={`cursor-pointer  ${activeTab==='brokers'?'font-semibold':'text-secondary'}`} onClick={()=>setActiveTab('brokers')}>Brokers</div>
      <div className={`cursor-pointer  ${activeTab==='connections'?'font-semibold':'text-secondary'}`} onClick={()=>setActiveTab('connections')}>Connections</div>
        <div className='text-secondary'>|</div>
        <ul className='cursor-pointer flex  items-center list-disc ml-2 gap-6'>
       <li className={`ml-0 ${year===currentYear ? '':'text-secondary'}`}  onClick={()=>setYear(currentYear)}>This year</li>
       {/* <li className={`ml-0 ${year===currentYear-1 ? '':'text-secondary'}`} onClick={()=>setYear(currentYear-1)}>Last year</li> */}
    </ul>
    </div>
  
   <div className="max-h-60">
    {lineBarData.labels.length>0 && <Line options={{responsive: true,
        maintainAspectRatio: true,
        scales:{
          x:{
              grid:{
                  drawOnChartArea:false
              }
          },
          y:{
            ticks:{stepSize:1},
              grid:{
                  drawOnChartArea:false
              }
          }
         },
        plugins: {
          legend: {
            position: 'top' as const,
            display:false
          },
          title: {
            display: false,
            text: '',
          },
        }}} data={lineBarData}  />}
   </div>
   
   </div>
  </div> }
 
  </>
 ;
}
