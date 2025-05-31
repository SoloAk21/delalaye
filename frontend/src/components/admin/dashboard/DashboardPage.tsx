import React, { useEffect } from 'react'
import withMainComponent from '../../layout/withMainComponent'

import { useAppDispatch, useAppSelector } from '../../../store/store'
import { CounterStat } from './CounterStat'
import { getAdminDashboardStat } from '../../../store/features/dashboardSlice'
import ServicesStat from './ServicesStat'
import { TopupStat } from './TopupStat'



const DashboardPage: React.FC = () => {
  const {user} = useAppSelector((state)=> state.auth);
  const dispatch = useAppDispatch();
  const {status,totalBrokers,totalConnections,totalUsers} = useAppSelector((state)=> state.dashboard);

  useEffect(() => {
    dispatch(getAdminDashboardStat())
  },[]);
  return (
    <div className='p-6'>

          <h4 className="text-xl font-medium text-secondary">Welcome, {user?.fullName}</h4>
          {status==='loading'?<>
          <div role="status" className="flex flex-col md:flex-row gap-4 md:gap-8 mt-5 animate-pulse md:space-y-0 ">
    <div className="shadow-md w-full md:w-1/3 bg-slate-100 py-2 rounded h-40 "></div>
    <div className="shadow-md w-full md:w-1/3 bg-slate-100 py-2 rounded h-40 "></div>
    <div className="shadow-md w-full md:w-1/3 bg-slate-100 py-2 rounded h-40 "></div>
    </div>

          </>:<>  <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-5 ">
          <div className='shadow-md w-full md:w-1/3 bg-[#E3F5FF] py-2 rounded-2xl '>
            <div className='  p-5 '>
              <div className="flex items-center justify-between">

                <div className="flex flex-col gap-4">
                  <h4 className='tracking-wide   text-sm font-normal'>Customers</h4>
                  <h4 className='font-semibold text-2xl'>{totalUsers}</h4>
                </div>
                
              </div>
            </div>
          </div>
          
          
          <div className='shadow-md w-full md:w-1/3 bg-slate-100 py-2 rounded-2xl '>
            <div className='  p-5 '>
              <div className="flex items-center justify-between">

                <div className="flex flex-col gap-4">
                  <h4 className='tracking-wide   text-sm font-normal'>Brokers</h4>
                  <h4 className='font-semibold text-2xl'>{totalBrokers}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className='shadow-md w-full md:w-1/3 bg-[#E3F5FF] py-2 rounded-2xl '>
            <div className='  p-5 '>
              <div className="flex items-center justify-between">

                <div className="flex flex-col gap-4">
                  <h4 className='tracking-wide   text-sm font-normal'>Connections </h4>
                  <h4 className='font-semibold text-2xl'>{totalConnections}</h4>
                </div>
                
              </div>
            </div>
          </div>
        </div>
          </>}
        
 <div className="my-8 flex gap-8">
  <div className='  w-3/4 bg-slate-100/50 rounded-2xl shadow-md' >
    <CounterStat/>
  </div>
  <div className='w-1/4 bg-slate-100/50 rounded-2xl shadow-md'>
<ServicesStat />

  </div>
 </div>
 <div className="my-4 w-full bg-slate-100/50 rounded-2xl shadow-md">
  <TopupStat />
 </div>
    </div>
  )
}




export default withMainComponent(DashboardPage) 