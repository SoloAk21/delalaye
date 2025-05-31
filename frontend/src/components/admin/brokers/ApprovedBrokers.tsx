
import Popup from "../../layout/Popup";
import UpdateBroker from "./UpdateBroker";
import  { formatDate,accountExpired, calculateDateDifference } from "../../../utils/date";
import Spinner from "../../layout/Spinner";
import { Broker } from "../../../model/models";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getApprovedBrokers, searchApprovedBrokers } from "../../../store/features/brokerSlice";
import { CiMenuKebab } from "react-icons/ci";
import ReactPaginate from "react-paginate";
import debounce from 'lodash.debounce';

 const ApprovedBrokers = () => {
    const { status,approvedBrokers,total } = useAppSelector((state) => state.broker);
   
    const [updatedBroker, setUpdatedBroker] = useState<Broker | null>(null);
    const [openUpdatePopup, setOpenUpdatePopup] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [brokersPerPage, setBrokersPerPage] = useState<number>(10);
    const brokersPerPageOptions = [10,25, 50, 75, 100];
    const [openMenu,setOpenMenu] = useState(false);
    const dispatch = useAppDispatch();
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
     
      dispatch(getApprovedBrokers({_limit:brokersPerPage,_page:currentPage}));
     
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !((menuRef.current as unknown) as HTMLDivElement).contains(event.target as Node)) {
          setOpenMenu(false);
        }
      };
      window.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }, [currentPage,brokersPerPage]); 
    // useEffect(()=>{
    //     dispatch(getApprovedBrokers({_limit:brokersPerPage,_page:currentPage}))
    // },[currentPage]);
    // useEffect(()=>{
    //   setCurrentPage(1);
    //     dispatch(getApprovedBrokers({_limit:brokersPerPage,_page:1}))
    // },[brokersPerPage]);
  
      const totalPages: number = Math.ceil(total / brokersPerPage);
  
  
    const openInPopup = (broker: Broker) => {
      setUpdatedBroker(broker);
      setOpenUpdatePopup(true);
    };

    const handlePageChange = ({ selected }:{selected:number}) => {
      console.log(`selected ${selected}`)
      setCurrentPage(selected+1);
    };
    const debouncedSearchApprovedBrokers = useCallback(
      debounce((searchQuery) => {
          if (searchQuery.trim() === '') {
            setCurrentPage(1);
            dispatch(getApprovedBrokers({_limit:brokersPerPage,_page:1}))
              return;
          }
          dispatch(searchApprovedBrokers({_limit:brokersPerPage,_page:currentPage,search:searchQuery,searchBy:'fullName'}));
      }, 500), // 500 milliseconds debounce delay
      [dispatch]
  );
const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  const newQuery = e.target.value;
  setSearchQuery(newQuery);
        debouncedSearchApprovedBrokers(newQuery);

}
    return (
      <>
       <div className='w-fit my-2 border  border-slate-400 rounded-sm'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleInputChange}
            placeholder='Search brokers...'
            className='text-black w-full px-4 py-2 text-sm'
          />
        </div>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-1'>
          <table id='registeredBrokers' className='w-full text-sm text-left text-gray-800 min-h-30'>
            <thead className='text-xs text-slate-400 bg-tomoca'>
              <tr>
                <th scope='col' className='px-6 py-3 text-xs'>
                  Id
                </th>
                <th scope='col' className='px-6 py-3 text-xs'>
                  Name
                </th>
                <th scope='col' className='px-6 py-3'>
                  Phone
                </th>
                <th scope='col' className='px-6 py-3'>
                  Connections
                </th>
                <th scope='col' className='px-6 py-3'>
                  Accoount Expire Date
                </th>
                <th scope='col' className='px-6 py-3'>
                  Services
                </th>
                <th scope='col' className='px-6 py-3'>
                  Availability
                </th>
                <th scope='col' className='px-6 py-3'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <th colSpan={6}>
                    <Spinner />
                  </th>
                </tr>
              ) : (
                <>
                  {approvedBrokers.length ? (
                    approvedBrokers.map((broker) => (
                      <tr
                        key={broker.id}
                        className='bg-white border-b bg-gray-90 border-gray-300'
                      >
                        <th
                          scope='row'
                          className={`px-6 py-4 font-medium text-gray-900 text-xs`}
                        >
                          {broker.id}
                          
                        </th>
                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-xs'>
                          {broker.fullName}
                        </th>
                        <td className='px-6 py-4 text-xs text-gray-900'>{broker.phone}</td>
                        <td className='px-6 py-4 text-xs text-gray-900'>{broker.Connection?.length ||0}</td>
                        <td className={`px-6 py-4 text-xs text-gray-900  ${accountExpired(broker.serviceExprireDate!) ? 'text-red-600':'text-green-400'}`}>
                        <div className="flex flex-col gap-1">
                        {formatDate(broker.serviceExprireDate!)}
                          <span className="block">{calculateDateDifference(broker.serviceExprireDate!) }</span>
                          </div> 
                          </td>
                        <td className='px-6 py-4 text-xs text-gray-900'>
                          {broker.services?.map(service => service.name).join(', ')}
                        </td>
                        <td className="flex items-center justify-center px-6 py-4" align="center">
                          <div className={`w-4 h-4 border rounded-full ${broker.avilableForWork ? 'bg-green-500':'bg-red-500'} `}></div>
                        </td>
                        
                        <td className='text-center relative '>
                         <button
                            onClick={() => {
                              setOpenMenu(true);
                              setUpdatedBroker(broker);
                            }}
                            className=' px-4 py-2 rounded hover:underline'
                          >
                            <CiMenuKebab />
                          </button>
                          {openMenu && updatedBroker?.id===broker.id && <div ref={menuRef} className={`z-999 text-xs bg-white border border-gray-200 absolute top-8 right-8  flex flex-col  justify-start w-36 `}>
                            <button className='text-left px-4 py-2 hover:bg-gray-100' onClick={()=>{ setOpenMenu(false);openInPopup(broker);}}>Update Broker </button>
                            {/* <button className='text-left px-4 py-2 hover:bg-gray-100'>Topup </button> */}
  
                          </div>}
                          
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <th colSpan={6} className='py-6 text-center'>
                          No brokers registered.
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
    <label htmlFor="brokersPerPage" className="text-gray-600 text-xs">
      List Per Page:
    </label>
    <select className='text-sm p-1.5' onChange={e=>setBrokersPerPage(Number(e.target.value))} id="brokersPerPage" value={brokersPerPage}>
      {brokersPerPageOptions.map(option=><option key={option}>{option}</option>)}
    </select>
  
  </div>
  
  
     <div className="pagination-container">
      
      <ReactPaginate
          previousLabel={`< `}
          nextLabel={` >`}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
          />
          </div>
  </div>
    
        {updatedBroker && (
          <Popup title='Update broker' open={openUpdatePopup} setOpen={setOpenUpdatePopup} >
           
            <UpdateBroker broker={updatedBroker} setOpenUpdatePopup={setOpenUpdatePopup} openUpdatePopup={openUpdatePopup}  />
          </Popup>
        )}
      </>
    );
  };

  export default ApprovedBrokers;