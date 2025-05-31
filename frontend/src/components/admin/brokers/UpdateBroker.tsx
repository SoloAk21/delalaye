import React, { ChangeEvent, useEffect, useState } from "react";
// import { addBranchAccount, updateBranch } from '../../../store/features/branchSlice';
import { Broker } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import Compressor from 'compressorjs'
import { updateBroker, updateBrokerProfilePic } from "../../../store/features/brokerSlice";
import convertToBase64 from "../../../utils/convertToBase64";
import { toast } from "sonner";
import validatePhoneNumber from "../../../utils/validatePhone";
import { getServices } from "../../../store/features/serviceSlice";

interface Props {
  broker: Broker;
  openUpdatePopup:boolean;
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}
const maxSize = 70   * 1024; // 500kb

const UpdateBroker: React.FC<Props> = (props: Props) => {
  const { broker, setOpenUpdatePopup,openUpdatePopup } = props;
  const { services } = useAppSelector((state) => state.service);
  const [values, setValues] = useState<Broker>({
    id:0,
    fullName:'',
    email: '',
    phone:'',
    photo:'',
    password:''
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
const [errorMessage, setErrorMessage] = useState<string>('');
const [validPhone, setValidPhone] = useState<boolean>(true);

  const { status } = useAppSelector((state) => state.broker);
  const dispatch = useAppDispatch();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name === 'phone'){
      setValidPhone(validatePhoneNumber(value));
    }
    setValues({
      ...values,
      [name]: value,
    });
  };
useEffect(()=>{
  dispatch(getServices());
},[])
  useEffect(() => {
    if (broker) {
      const {id, fullName,email,phone,photo } = broker;

      setValues({
       id:id||0, fullName:fullName||'',email:email||'',phone:phone||'',photo:photo||''
      });
    if(broker.services)  setSelectedServices(broker.services.map(service=>service.name))
    }
  }, [broker,openUpdatePopup]);
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file=e.target.files[0];
      if (file) {
        if (file && file.size > maxSize) {
          setErrorMessage('File size exceeds the limit. Please choose a smaller file. Max (70kb)');setValues({...values,photo:''})
        } else {
          setErrorMessage('');

          let base64: string ;
            new Compressor(file, {
              quality: 0.6,          
              // The compression process is asynchronous,
              // which means you have to access the `result` in the `success` hook function.
             async success(result) {
              base64  = (await convertToBase64(result as File)).slice('data:image/jpeg;base64,'.length);
             
        setValues({ ...values, photo: base64 });
         dispatch(updateBrokerProfilePic({photo:base64,setValues,id:Number(broker.id!)}))
              },
              error(err) {
                console.log(err.message);
                toast(err.message)
              },
            });
        }
       
      }
      
    } else {
      setValues({ ...values, photo: "" });
    }
  };
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("will update");
    
    console.log(values)
 
   validPhone && dispatch(updateBroker({
      id :Number(broker.id),updatedBroker:values,setOpenUpdatePopup,selectedServices:services.filter(service=> selectedServices.includes(service.name)).map(service=>service.id)
    }))    
    
    
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>)=>{
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log(selectedValues)
    if(selectedServices.includes(selectedValues[0])){
    return  setSelectedServices(selectedServices.filter(item => item !== selectedValues[0]))
    }
    setSelectedServices([...selectedServices, selectedValues[0]]);
    
  }
console.log('rendering')
  return (
    <div className="p-6">
      <form action="" onSubmit={handleUpdate} className="py-4  rounded ">
        {!broker.photo && !values.photo ? <div className="relative z-0 w-full mb-6 group">
      <label htmlFor="serviceChargereceiptPhoto" className={`flex flex-col items-center justify-center w-36 h-36 rounded-[50%] border-2  border-dashed cursor-pointer bg-gray-50`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Profile photo</p>
             
          </div>
          <input id="serviceChargereceiptPhoto" type="file" accept="image/*"className="hidden" onChange={handleProfileUpload}  />
          <p className="text-xs text-red-600 ">
                        {errorMessage}
                    </p>
      </label>
      </div>: <div className="relative z-0 w-full mb-6 group">
        <div className=" flex gap-4 items-center">
          <div className="relative">
<img className="w-36 h-36 rounded-[50%]" src={`data:image/jpeg;base64,${values.photo}`} alt={broker.fullName} loading="lazy"  />
{status === "loading" && <div className="absolute top-1/2 -translate-y-2/4 left-1/2 -translate-x-2/4">
  <Spinner />
</div>} 

          </div>
<label htmlFor="profilePhoto" className="bg-primary px-4 py-2 rounded text-sm text-white font-medium cursor-pointer">Change photo</label>
<input id="profilePhoto" type="file" accept="image/*"className="hidden" onChange={handleProfileUpload}  />
<p className="text-xs text-red-600 ">
                        {errorMessage}
                    </p>
        </div>
      </div> }
     
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
            value={values.fullName}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="fullName"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            value={values.email}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="phone"
            id="phone"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
            value={values.phone}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="phone"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone
          </label>
         {!validPhone &&<p className="text-xs text-red-600 ">Phone number must start with +251 and be 13 digits.</p>} 
        </div>
        <div className="relative z-0 w-full mb-6 group flex flex-col">
        <label
            htmlFor="services"
            className="peer-focus:font-medium  text-sm text-slate-500"
          >
            Services
          </label>
        <select id="services" multiple value={selectedServices} onChange={handleServiceChange}>
          {services.length && services.map(service =><option key={service.id} value={service.name}  className="p-1">{service.name}</option> )}
        
      
      </select>

      <p className="text-sm font-medium">Services: <span className="font-semibold text-secondary">{selectedServices.join(', ')}</span></p>
        
        </div>
<div className="flex gap-4 items-center">
    <button
          onClick={() => {
            setOpenUpdatePopup(false);
            setValues({
                id:0,
              fullName: " ",
              email: "",
              phone: '',
              services: []
            });
            setSelectedServices([])
          }}
          className="font-medium border border-primary text-primary px-4 py-2 rounded hover:underline"
        >
          Cancel
        </button>

        <button
          className="text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm px-4 py-2 "
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" && <Spinner width="20px" />} Update
        </button>
</div>
        
      </form>
    </div>
  );
};

export default UpdateBroker;
