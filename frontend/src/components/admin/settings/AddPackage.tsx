import React, {  useState } from "react";
// import { addBranchAccount, updateBranch } from '../../../store/features/branchSlice';
import { NewPackage } from "../../../model/models";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Spinner from "../../layout/Spinner";
import { addPackage } from "../../../store/features/settingSlice";
interface Props {
    setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

const AddPackage: React.FC<Props> = ({setOpenUpdatePopup}) => {
 


  const [values, setValues] = useState<NewPackage>({
    name: "",
    totalDays: 0,
    discount: 0,status:"ACTIVE"
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
    dispatch(addPackage({
      ...values,
      setOpenUpdatePopup:setOpenUpdatePopup
    }))
  };

  return (
    <div className="p-6">
      <form action="" onSubmit={handleSubmit} className="py-4  rounded ">
      <h3 className="block text-sm mb-2 font-bold">Package Name</h3>
        <input
          type="text"
          placeholder=''
          name="name"
          value={values.name}
          onChange={handleInputChange}
          className="items-center border border-gray-500 rounded-md w-1/4 py-2 px-4 focus:outline-yellow-500"
          required
        />

        <h3 className="block text-sm mb-2 mt-4 font-bold">Total days for this package</h3>
        <input
          type="number"
          placeholder=''
          value={values.totalDays}
          name="totalDays"
          onChange={handleInputChange}
          className="items-center border border-gray-500 rounded-md w-1/4 py-2 px-4 focus:outline-yellow-500"
          required
        />

        <h3 className="block text-sm mb-2 mt-4 font-bold">Discount</h3>
        <input
          type="number"
          placeholder='Type message...'
          value={values.discount}
          onChange={handleInputChange}
          className="items-center border border-gray-500 rounded-md w-1/4 py-2 px-4 focus:outline-yellow-500"
          required
        />
      <h3 className="block text-sm mb-2 mt-4 font-bold">Active</h3>
      <button
        type='button'
        onClick={()=>setValues({...values,
        status: values.status==='ACTIVE'?'INACTIVE':'ACTIVE'})}
      className={`
        rounded-full overflow-hidden relative border border-gray-300 w-11 h-6 
        ${values.status==='ACTIVE' ? 'bg-primary hover:bg-primary/95' : 'bg-gray-200'}
      `}
    >
      <div
        className={`
          h-4 w-4 rounded-lg transition-transform transition-background mx-1 items-center
          ${values.status==='ACTIVE'  ? 'bg-white transform translate-x-full' : 'bg-gray-400 transform translate-x-0'}
        `}
      />
    </button>
<div className="flex gap-4 items-center mt-4">
    <button
          onClick={() => {
            setOpenUpdatePopup(false);
            setValues({
              name:'',
              totalDays:0,
              discount:0,
              status:'ACTIVE'
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

export default AddPackage;
