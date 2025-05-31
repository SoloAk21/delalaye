import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { logout } from '../../store/features/authSlice';
import { MdLogout } from 'react-icons/md';
import {FaRegUserCircle} from 'react-icons/fa'
const Header= () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [open,setOpen]= useState<boolean>(false)
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef,setOpen);
  return (
    <div className='bg-white h-16 mb-3 w-full relative ' >
      <div className='flex justify-end gap-2 items-center h-full mr-6'>
        <p  className='text-sm text-slate-500'>{user?.fullName}
          {/* {(user?.role === 'main' || user?.role === 'store') && user?.fullname} */}
          {/* {user?.role === 'branch' && user?.branch?.branch_name} */}

        </p>
        <div ref={wrapperRef}>
<button onClick={()=>{setOpen(!open)}} >
  <FaRegUserCircle />
       </button> 
      <div id="dropdown" className={`z-10${open ?" ":' hidden'} absolute right-4 top-[72px] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 `}>
    <ul className="py-2 text-sm text-slate-800 " aria-labelledby="dropdownDefaultButton">
      {/* <li>
        <Link to={`/${user?.role}/profile`} className="px-4 py-2 hover:bg-gray-100 flex gap-2 items-center"><MdOutlineManageAccounts /> Account</Link>
      </li> */}
      <li>
        <button onClick={() => {
          dispatch(logout())
        }} className=" px-4 py-2 hover:bg-gray-100 flex gap-2 items-center w-full"><MdLogout /> Logout</button>
      </li>
   
    </ul>
</div>
        </div>
      
      </div>
    </div>
  )
}

export default Header;


/**
 * Hook that alerts clicks outside of the passed ref
//  */
function useOutsideAlerter(ref:any,setOpen:React.Dispatch<React.SetStateAction<boolean>>) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event:any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref,setOpen]);
}