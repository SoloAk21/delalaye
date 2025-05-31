import React from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom';
import { Toaster } from 'sonner';
import {IoIosArrowForward} from 'react-icons/io'
import {LuLayoutDashboard, LuUsers} from 'react-icons/lu'
// import {AiOutlineProfile,AiOutlineTeam,AiOutlineHistory} from 'react-icons/ai'
import Logo from '../../assets/logo.png'
import { MdHistory,MdOutlinePayment,MdOutlineMiscellaneousServices, MdOutlineMessage  } from "react-icons/md";


import { RiAdminFill } from "react-icons/ri";
import { IoSettingsOutline } from 'react-icons/io5';

interface Props {
  role?: string
}

const Sidebar: React.FC<Props> = ({ role }: Props) => {
  
  const dashboardMatchAdmin = useMatch('/admin/dashboard/');
  const adminBrokersRoute = useMatch('/admin/brokers/');
  const adminStaffRoute = useMatch('/admin/staff/');
  const adminSmsRoute = useMatch('/admin/sms/');
  const adminSettingRoute = useMatch('/admin/settings/');
  const adminServicesRoute = useMatch('/admin/services/');
  // const adminPaymentHistoryRoute = useMatch('/admin/payment-history/');
    
  const dashboardMatchFinance = useMatch('/finance/dashboard/');
  const financePaymentsRoute = useMatch('/finance/payments/');
  const financePaymentHistoryRoute = useMatch('/finance/payment-history/');
  

  const adminNavigation = (<>
    
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2 text-slate-300  ${dashboardMatchAdmin ? 'bg-slate-100 font-medium  text-slate-800':'text-slate-600'}`}>
      <LuLayoutDashboard />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/dashboard/`}>Dashboard <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${adminBrokersRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <LuUsers />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/brokers/`}>Brokers <IoIosArrowForward  /></NavLink>
    </li>
    
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${adminServicesRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <MdOutlineMiscellaneousServices  />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/services/`}>Services <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${adminStaffRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <RiAdminFill />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/staff/`}>Staff <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${adminSmsRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
    <MdOutlineMessage />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/sms/`}>Sms <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${adminSettingRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
    <IoSettingsOutline />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/admin/settings/`}>Settings <IoIosArrowForward  /></NavLink>
    </li>
  </>)


 const financeNavigation = (<>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${dashboardMatchFinance ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <LuLayoutDashboard />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/finance/dashboard/`}>Dashboard <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${financePaymentsRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <MdOutlinePayment  />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/finance/payments/`}>Payments <IoIosArrowForward  /></NavLink>
    </li>
    <li className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center rounded  p-2   ${financePaymentHistoryRoute ? 'bg-slate-100 font-medium text-slate-800':'text-slate-600'}`}>
      <MdHistory />
      <NavLink className={`text-sm md:text-base text-center  flex items-center w-full justify-between`} to={`/finance/payment-history/`}>History <IoIosArrowForward  /></NavLink>
    </li>
    
  </>)

  return (
    <>

      <div id="sidebar" className='bg-white h-full fixed top-0 left-0 w-24 md:w-56 flex flex-col p-2 md:p-4' >

        {/* <div id='logo' className='my-8 hidden md:block'>
          <NavLink to='/' className='font-medium text-white ' ><h1 >Abronet</h1></NavLink>
        </div> */}
        <div  className='my-8  '>
          <NavLink to='/' className='font-medium text-white ' > <img className='m-auto' src={Logo} alt="logo" width={80} loading='lazy' /></NavLink>
        </div>
        <nav>
          <ul className='list-none flex flex-col gap-1 md:gap-3 w-full  text-gray-100 '>
            {
              role === 'admin' && adminNavigation
            }
            {
              role === 'finance' && financeNavigation
            }

          </ul>
        </nav>
      </div>
      <Outlet /> <Toaster />
    </>
  )
}

export default Sidebar
