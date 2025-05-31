import  { ChangeEvent, useEffect, useState } from "react";
import withMainComponent from '../../layout/withMainComponent'
import { getServices } from "../../../store/features/serviceSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { sendSms } from "../../../store/features/settingSlice";

const Sms = () => {
  const {services} = useAppSelector(state=>state.service)
  const {status} = useAppSelector(state=>state.setting)
  const dispatch = useAppDispatch();
 
  const [to, setTo] = useState<'brokers'|'users'>("brokers");

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [smsMessage, setSmsMessage] = useState<string>('');
const resetValues = () =>{
  setSelectedServices([]);
  setSmsMessage('');
}
  useEffect(() => {
    dispatch(getServices());
  }, []);

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>)=>{
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log(selectedValues)
    if(selectedServices.includes(selectedValues[0])){
    return  setSelectedServices(selectedServices.filter(item => item !== selectedValues[0]))
    }
    setSelectedServices([...selectedServices, selectedValues[0]]);
    
  }

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log({
      to,services:selectedServices,message:smsMessage,
    })
 
  dispatch(sendSms({ to,services:selectedServices.map(serviceId=>Number(serviceId)),message:smsMessage,resetValues}))    
    
    
  };


  return (
    <div className="container p-4 h-screen w-1/2 text-left bg-white ">
      <form className="p-6 mx-auto text-left" onSubmit={handleSubmit}>
        {/* Main Header */}
        <h1 className="text-lg font-bold mb-4">Send sms</h1>
        {/* Select Group Header */}
        <h3 className="text-sm mb-2 text-secondary font-semibold">Select recipients</h3>
        <div className="flex gap-2 items-center">

        <div className="flex items-center px-3 border border-gray-200 rounded dark:border-gray-700 w-fit">
    <input checked={to==='brokers'} id="bordered-radio-1" type="radio" value="" name="brokers" className="w-fit h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary " onChange={()=>setTo('brokers')}/>
    <label htmlFor="bordered-radio-1" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 ">All brokers</label>
</div>
<div className="flex items-center px-2 border border-gray-200 rounded dark:border-gray-700">
    <input checked={to==='users'} id="bordered-radio-2" type="radio" value="" name="users"  className="w-fit h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary "  onChange={()=>setTo('users')}/>
    <label htmlFor="bordered-radio-2" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 ">All users</label>
</div>
        </div>

        {to === "brokers" && (
          <div className="my-4">

           
            <label  htmlFor="services" className="block mb-2 text-sm  text-secondary font-semibold">Select by service</label>
  <select id="services" multiple className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " required onChange={handleServiceChange} value={selectedServices}>

    {services.map((service) => (
                <option className="p-1" key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
  </select>
          </div>
        )}


        <h2 className="text-secondary font-semibold mt-4 mb-2 ">Enter SMS</h2>
        <textarea
        
          value={smsMessage}
          placeholder="Type message..."
          required
          onChange={(e) => setSmsMessage(e.target.value)}
          className="flex items-center border border-gray-500 rounded-md p-2 w-full h-48 mt-4 focus:outline-yellow-500"
        />

      
 
        <button
        disabled={status==='loading'}
          type="submit"
          className="flex items-center justify-center mt-4 px-5 py-2  bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
          {status==='loading' ? <Spinner /> : 'Send'} 
        </button>
      </form>
    </div>
  );
};



export default withMainComponent(Sms) 