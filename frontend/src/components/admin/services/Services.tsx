import {  useEffect, useState} from 'react'
// import {GrFormView} from 'react-icons/gr'
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import {  useAppDispatch, useAppSelector } from '../../../store/store';
import {  getServices,
   } from '../../../store/features/serviceSlice';
import withMainComponent from '../../layout/withMainComponent';
import {  Service } from '../../../model/models';
import Popup from '../../layout/Popup';
import Spinner from '../../layout/Spinner';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MdAdd } from "react-icons/md";

import Select, {  PropsValue, SingleValue } from 'react-select';
import AddService from './AddService';
import UpdateService from './UpdateService';

const Services = () => {

  return (
    <div className='shadow p-3 rounded'>
        <h6 className="font-bold text-secondary">Services</h6>

<div className=""><SevicesList />
    </div>
    </div>
  )
}

const SevicesList = () => {
    const { services,status} = useAppSelector((state) => state.service);
    const dispatch = useAppDispatch();
    // const [searchQuery] = useState<string>('');
    useEffect(() => {
      dispatch(getServices());
    }, []);
  const [updatedService, setUpdatedService] = useState<Service | null>(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
  const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(25);
  const perPageOptions = [25, 50, 75, 100];   

  const openInPopup = (service: Service) => {
    setUpdatedService(service);
    setOpenUpdatePopup(true);
  };

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastService: number = currentPage * usersPerPage;
  const indexOfFirstService: number = indexOfLastService - usersPerPage;
  const paginatedServices: Service[] = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const totalPages: number = Math.ceil(filteredServices.length / usersPerPage);

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
          placeholder='Search services...'
          className='text-black w-full px-4 py-2 text-sm'
        />
      </div>
      <div className="flex items-center w-full justify-end ">

      <button
        onClick={()=>{setOpenAddPopup(true)}}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-1 px-2 rounded text-sm"
        >
        <MdAdd /> Add new

      </button>
          </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-4'>
        <table id='registeredUsers' className='w-full text-sm text-left text-gray-800 min-h-30'>
          <thead className='text-xs text-slate-400 bg-tomoca'>
            <tr>
              <th scope='col' className='px-6 py-3 text-xs'>
                No
              </th>
              <th scope='col' className='px-6 py-3 text-xs'>
                Service name
              </th>
              <th scope='col' className='px-6 py-3'>
                Service Rate
              </th>
              <th scope='col' className='px-6 py-3'>
                Action
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
                {paginatedServices.length ? (
                  paginatedServices.map((service,index) => (
                    <tr
                      key={service.id}
                      className='bg-white border-b bg-gray-90 border-gray-300'
                    >
                      <th
                        scope='row'
                        className={`px-6 py-4 font-medium text-gray-900 text-xs `}
                      >
                        {index +1}
                        
                      </th>
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-xs'>
                        {service.name}
                      </th>
                      <td className='px-6 py-4 text-xs text-gray-900'>{service.serviceRate}</td>
                      
                     
                      <td>
                        <button
                          onClick={() => {
                            openInPopup(service);
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
                        No services registered.
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
  <Select
    id="usersPerPage"
    value={usersPerPage ? { value: usersPerPage, label: usersPerPage } as PropsValue<{ value: any; }> : null}
    onChange={(newValue: SingleValue<{ value: any; }>) => setUsersPerPage(newValue?.value || 0)}
    options={perPageOptions.map((option) => ({ label: option, value: option }))}
    isSearchable={false}
    className="mx-2 focus:ring-secondary border-secondary hover:border-primary focus:border-secondary text-xs"
    styles={{
      control: (provided: any) => ({
        ...provided,
        border: '1px solid #898989',
        padding:'0px'
        
      }),
      option: (provided: any, state: { isFocused: any; isSelected: any; }) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#FFA05C' : state.isSelected ? '#FFA05C' : 'white',
        color: state.isFocused || state.isSelected ? 'white' : 'black',
        
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: 'black', // Set the text color for the selected value
      }),
      indicatorSeparator: (provided: any, state: { selectProps: { menuIsOpen: any; }; }) => ({
        ...provided,
        backgroundColor: state.selectProps.menuIsOpen ? '#FFA05C' : '#FFA05C', // Set the border color when clicked
      }),
    }}
  />
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
<Popup title='Add service' open={openAddPopup} setOpen={setOpenAddPopup}>
          <AddService  setOpenUpdatePopup={setOpenAddPopup} />
        </Popup>
      {updatedService && (
        <Popup title='Update service' open={openUpdatePopup} setOpen={setOpenUpdatePopup}>
          <UpdateService service={updatedService} setOpenUpdatePopup={setOpenUpdatePopup} />
        </Popup>
      )}
    </>
  );
};


 
export default withMainComponent(Services);