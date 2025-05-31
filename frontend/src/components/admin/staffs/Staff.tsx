import {  useEffect, useState} from 'react'
// import {GrFormView} from 'react-icons/gr'
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import {  useAppDispatch, useAppSelector } from '../../../store/store';
import {  getStaffs,
   } from '../../../store/features/staffSlice';
import withMainComponent from '../../layout/withMainComponent';
import {  Staff } from '../../../model/models';
import Popup from '../../layout/Popup';
import Spinner from '../../layout/Spinner';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MdAdd } from "react-icons/md";

import AddStaff from './AddStaff';
import UpdateStaff from './UpdateStaff';

const Staffs = () => {

  return (
    <div className='shadow p-3 rounded'>
        <h6 className="font-bold text-secondary">Staffs</h6>

<div className=""><StaffsList />

    </div>
    </div>
    
  )
}

const StaffsList = () => {
    const { staffs,status} = useAppSelector((state) => state.staff);
    const dispatch = useAppDispatch();
    // const [searchQuery] = useState<string>('');
    useEffect(() => {
      dispatch(getStaffs());
    }, []);
  const [updatedStaff, setUpdatedStaff] = useState<Staff | null>(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(25);
  const perPageOptions = [25, 50, 75, 100];   

  const openInPopup = (staff: Staff) => {
    setUpdatedStaff(staff);
    setOpenUpdatePopup(true);
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastStaff: number = currentPage * usersPerPage;
  const indexOfFirstStaff: number = indexOfLastStaff - usersPerPage;
  const paginatedStaffs: Staff[] = filteredStaffs.slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );

  const totalPages: number = Math.ceil(filteredStaffs.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className='w-fit my-2 border  border-slate-400 rounded-sm'>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search staffs...'
          className='text-black w-full px-4 py-2 text-sm'
        />
      </div>
      <div className="flex items-center w-full justify-end ">

      <button
        onClick={()=>{setOpenAddPopup(true)}}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-1 px-2 rounded text-sm"
        >
        <MdAdd /> Add staff
      </button>
          </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-4'>
        <table id='registeredUsers' className='w-full text-sm text-left text-gray-800 min-h-30'>
          <thead className='text-xs text-slate-400 bg-tomoca'>
            <tr>
              <th scope='col' className='px-6 py-3 text-xs'>
                Name
              </th>
              <th scope='col' className='px-6 py-3 text-xs'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Phone
              </th>
              <th scope='col' className='px-6 py-3'>
                Role
              </th>
              <th scope='col' className='px-6 py-3'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' ? (
              <tr>
                <th colSpan={3}>
                  <Spinner />
                </th>
              </tr>
            ) : (
              <>
                {paginatedStaffs.length ? (
                  paginatedStaffs.map((staff) => (
                    <tr
                      key={staff.id}
                      className='bg-white border-b bg-gray-90 border-gray-300'
                    >
                      <th
                        scope='row'
                        className={`px-6 py-4 font-medium text-gray-900 text-xs `}
                      >
                        {staff.fullName}
                        
                      </th>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-xs'>
                        {staff.email}
                      </th>
                      <td className='px-6 py-4 text-xs text-gray-900'>{staff.phone}</td>
                      <td className='px-6 py-4 text-xs text-gray-900'>{staff.role}</td>
                      
                     
                      <td>
                        <button
                          onClick={() => {
                            openInPopup(staff);
                          }}
                          className='font-medium bg-primary text-white px-3 py-1.5 text-xs rounded hover:underline'
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <th colSpan={3} className='py-6 text-center'>
                        No staffs registered.
                      </th>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
<div className="flex items-center mx-4">
  <label htmlFor="usersPerPage" className="text-gray-600 text-xs">
    Lists Per Page:
  </label>
  <select className='text-sm p-1.5' onChange={e=>setUsersPerPage(Number(e.target.value))} id="brokersPerPage" value={usersPerPage}>
    {perPageOptions.map(option=><option key={option}>{option}</option>)}
  </select>
 
</div>


  <div className="flex items-center mx-4">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-2 py-2 mx-4 rounded-full ${
        currentPage === 1 ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-primary text-white'
      }`}
    >
      <FaArrowLeft size={12} />
    </button>
    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
      <button
        key={i}
        onClick={() => handlePageChange(currentPage + i)}
        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border  border-gray-300 hover:bg-gray-100  ${
          currentPage === currentPage + i ? 'text-primary bg-primary/25' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {currentPage + i}
      </button>
    ))}
    <button
      onClick={() => handlePageChange(currentPage + 5)}
      disabled={currentPage + 5 > totalPages}
      className={`px-2 py-2 rounded-full mx-4 ${
        currentPage + 5 > totalPages ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-primary text-white'
      }`}
    >
      <FaArrowRight size={12} />
    </button>
  </div>
</div>
<Popup title='Add staff' open={openAddPopup} setOpen={setOpenAddPopup}>
          <AddStaff  setOpenUpdatePopup={setOpenAddPopup} />
        </Popup>
      {updatedStaff && (
        <Popup title='Update staff' open={openUpdatePopup} setOpen={setOpenUpdatePopup}>
          <UpdateStaff staff={updatedStaff} setOpenUpdatePopup={setOpenUpdatePopup} />
        </Popup>
      )}
    </>
  );
};


 
export default withMainComponent(Staffs);