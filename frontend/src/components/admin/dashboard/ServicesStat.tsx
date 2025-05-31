import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getServicesStat } from '../../../store/features/dashboardSlice';

const ServicesStat = () => {
    const {service_status,servicesStat} = useAppSelector(state=>state.dashboard)
    const dispatch = useAppDispatch();
    useEffect(() => {
          dispatch(getServicesStat());
        
      }, [])
      
  return (
    <>
    {service_status==='loading'?<div role="service_status" className=" animate-pulse   ">
    <div className="w-full  bg-slate-100 h-75  overflow-y-auto"></div>
    </div>: <div className='p-4 h-full overflow-y-auto max-h-70 '>
        <h1 className="text-xs font-semibold">No of Brokers by catagory</h1>
        <div className=" text-xs my-4 flex flex-col gap-4 text-secondary" >
            {servicesStat.length > 0 && servicesStat.map(service =><div key={service.serviceName} className='flex items-center justify-between w-full'>
                <p className="font">{service.serviceName}</p>
                <p className="">{service.brokersCount}</p>
                 </div>)}
        </div>
    </div>}
    
    </>
  )
}

export default ServicesStat