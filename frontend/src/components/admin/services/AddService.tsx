import React, {  useState } from "react";
// import { addBranchAccount, updateBranch } from '../../../store/features/branchSlice';
import { NewService } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addService } from "../../../store/features/serviceSlice";
interface Props {
    setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AddService: React.FC<Props> = ({setOpenUpdatePopup}) => {
 


  const [values, setValues] = useState<NewService>({
    name: "",
    description: "",
    serviceRate:  10,
  });
  const { status } = useAppSelector((state) => state.service);
  const dispatch = useAppDispatch();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("will submit");
    console.log(values)
    dispatch(addService({
      ...values,
      setOpenUpdatePopup:setOpenUpdatePopup,setValues:setValues

    }));
    
  };

  return (
    <div className="p-6">
      <form action="" onSubmit={handleSubmit} className="py-4  rounded ">
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
            value={values.name}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Service name *
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="description"
            id="description"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            value={values.description}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="description"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Description
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="number"
            name="serviceRate"
            id="serviceRate"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
            value={values.serviceRate}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="serviceRate"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Service Rate *
          </label>
        </div>
       
<div className="flex gap-4 items-center">
    <button
          onClick={() => {
            setOpenUpdatePopup(false);
            setValues({
              name:'',
              description:'',
              serviceRate:50
            });
          }}
          className="font-medium border border-primary text-primary px-3 py-1.5 text-sm rounded hover:underline"
        >
          Cancel
        </button>

        <button
          className="text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm px-4 py-2 "
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" && <Spinner width="20px" />} Add
        </button>
</div>
        
      </form>
    </div>
  );
};

export default AddService;
