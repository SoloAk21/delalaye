import {  useEffect,  useState} from 'react'

import withMainComponent from '../../layout/withMainComponent';
import ApprovedBrokers from './ApprovedBrokers';
import { Link, useLocation } from 'react-router-dom';
import NotApprovedBrokers from './NotApprovedBrokers';

const Brokers = () => {

  
  const [activeLink, setActiveLink] = useState<'approved' | 'notapproved'>('notapproved');
  const [isLinkSet,setIsLinkSet]= useState<boolean>(false);
  const location = useLocation();
 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');
setActiveLink(tab==='approved'?'approved':'notapproved');
setIsLinkSet(true)
  }, []);

console.log(`activeLink : ${activeLink}`)
  return (
    <div className='shadow p-3 rounded'>
        <h6 className="font-medium text-secondary">Manage Brokers</h6>
<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">
        <li className="mr-2 cursor-pointer" onClick={()=>{setActiveLink('approved')}}>
            <Link to="/admin/brokers/?tab=approved" className={`inline-block p-4 border-b-2  rounded-t-lg  ${activeLink==='approved' ?'text-blue-600  border-blue-600 ':'border-transparent hover:text-gray-600 hover:border-gray-300'} `}>Approved</Link>
        </li>
        <li className="mr-2 cursor-pointer" onClick={()=>{setActiveLink('notapproved')}}>
            <Link to="/admin/brokers/?tab=registered" className={`inline-block p-4 border-b-2 rounded-t-lg ${activeLink==='notapproved' ?'text-blue-600  border-blue-600 ':'border-transparent hover:text-gray-600 hover:border-gray-300'} ` }aria-current="page">Not Approved</Link>
        </li>
       
    </ul>
</div>
<div className="">
{isLinkSet && activeLink === 'approved' && <ApprovedBrokers />}
      {isLinkSet && activeLink === 'notapproved' && <NotApprovedBrokers   />}
    </div>
    </div>
    
  )
}




 
export default withMainComponent(Brokers);