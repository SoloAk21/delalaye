import React, {  useState } from "react";
// import { addBranchAccount, updateBranch } from '../../../store/features/branchSlice';
import { NewStaff } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addStaff } from "../../../store/features/staffSlice";
interface Props {
    setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AddStaff: React.FC<Props> = ({setOpenUpdatePopup}) => {
 


  const [values, setValues] = useState<NewStaff>({
    fullName: "",
    email: "",
    phone: '',
    password:'',
    role:'admin'
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
const handleRoleChange = (
  e: React.ChangeEvent<HTMLSelectElement>
)=>
  {
    setValues({...values,role:e.target.value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("will submit");
    console.log(values)
    dispatch(addStaff({
      staff:values,
      setOpenUpdatePopup:setOpenUpdatePopup
    }))
  };

  return (
    <div className="p-6">
      <form action="" onSubmit={handleSubmit} className="py-4  rounded ">
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
            Staff name *
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
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
        </div>
        <div className="mb-6 text-sm">
              <label className="block mb-4">
               Role:
              <select
               name="role"
               className="mt-1 ml-1 py-1.5 border border-gray-300 rounded-md text-sm"
               required
               value={values.role}
               onChange={handleRoleChange}
                >
               <option value="admin">Admin</option>
               <option value="cs">Customer Service</option>
               </select>
               </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-b-rose-950 peer"
            placeholder=" "
            required
            value={values.password}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-slate-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-b-rose-950 peer-focus:dark:text-amber-950 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password *
          </label>
        </div>
<div className="flex gap-4 items-center">
    <button
          onClick={() => {
            setOpenUpdatePopup(false);
            setValues({
              fullName:'',
              email:'',
              phone:''
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

export default AddStaff;
