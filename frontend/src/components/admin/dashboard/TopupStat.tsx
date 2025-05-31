import  {  useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import {  Bar } from 'react-chartjs-2';
import {  useAppDispatch, useAppSelector } from '../../../store/store';
import { getTopupStat } from '../../../store/features/dashboardSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
      barThickness?:number
      }
      interface ILineBar {
        labels:string[]
        datasets:Dataset[]
        
      }
export function TopupStat() {
   
    const {topup_status,topupsCountByMonth} = useAppSelector(state=>state.dashboard)
    const dispatch = useAppDispatch();
const [year,setYear] = useState(currentYear);

const [lineBarData,setData]= useState<ILineBar>({
  labels:[],
  datasets: [
    {
      label: 'Topups',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
})
     
useEffect(() => {
  if(year){
    dispatch(getTopupStat(year));
  }
}, [year])



useEffect(() => {

  const chart = ()=>{
    setData({
    labels:topupsCountByMonth.labels ||[],
    datasets: [
      {
        data: topupsCountByMonth.data ,
        barThickness:20,
      backgroundColor: 'rgba(254, 154, 60, 0.8)',
      borderWidth:0.5,label:'topups'
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
}, [topupsCountByMonth]);




    
  return <> 
 { topup_status==='loading' ?  <div role="topup_status" className=" animate-pulse   ">
    <div className="w-full  bg-slate-100 h-60 "></div>
    </div> : <div className=' p-4'>
  <div className='flex flex-col gap-2' >
    <div className="text-xs flex gap-4 items-center mb-2">
     
      <div className={`cursor-pointer  font-semibold`} >Total no of topups</div>
        <div className='text-secondary'>|</div>
        <ul className='cursor-pointer flex  items-center list-disc ml-2 gap-6'>
       <li className={`ml-0 ${year===currentYear ? '':'text-secondary'}`}  onClick={()=>setYear(currentYear)}>This year</li>
       {/* <li className={`ml-0 ${year===currentYear-1 ? '':'text-secondary'}`} onClick={()=>setYear(currentYear-1)}>Last year</li> */}
    </ul>
    </div>
  
   <div className="max-h-60">
    {lineBarData.labels.length>0 && <Bar options={{ responsive: true,
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

        layout:{padding:20},
        plugins: {
          legend: {
            position: 'bottom' as const,
            display:false
          },
          title: {
            display: false,
            text: '',
          },
        },elements:{bar:{borderRadius: 6,borderWidth:1}}
       }} data={lineBarData}  />}
   </div>
   
   </div>
  </div> }
 
  </>
 ;
}
