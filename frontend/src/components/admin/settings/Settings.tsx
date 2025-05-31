import  { useState, useEffect } from "react";
import withMainComponent from '../../layout/withMainComponent'
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { getSettings, updateDailyFee, updatePackage, updatePackageStatus } from "../../../store/features/settingSlice";
import { Package } from "../../../model/models";
import Popup from "../../layout/Popup";
import AddPackage from "./AddPackage";
import Spinner from "../../layout/Spinner";

const Setting = () => {
  const {dailyFee,packages,status,task} = useAppSelector((state) => state.setting);
  const [dailyFeeAmount, setDailyFee] = useState<number>(0);
  const dispatch = useAppDispatch();
const [values,setValues] = useState<Package>({
    id:0,
    discount:0,
    name:'',
    status:"ACTIVE",
    totalDays:0,
})
const [editPackage,setEditPackage] = useState<boolean>(false)
const [editDailyFee,setEditDailyFee] = useState<boolean>(false)
const [openAddPopup, setOpenAddPopup] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleEditPackage = (pkg:Package) => {
    setEditPackage(true)
    setValues(pkg)
  };

  const handleToggleActive = (id:number) => {
    setValues({...values,id})
    dispatch(
      updatePackageStatus(id)
    );
  };

  const handleUpdatePackage = () => {
    
    dispatch(
      updatePackage({
       updatedPackage:values,setEditPackage
      })
    );
    
    
  };

  return (<><div className="container p-4 h-screen w-full text-left">
     
        <h1 className="text-lg font-bold mb-4 text-secondary">Setting</h1>
        <h3 className="block text-sm mb-2 font-semibold text-secondary">Daily Fee Charge Amount</h3>

        {editDailyFee ?  <form className="my-2 mx-auto text-left" 
      onSubmit={(e)=>{e.preventDefault(); dispatch(updateDailyFee({dailyFee:dailyFeeAmount,setEditDailyFee}))}}
      >
        <div className="flex flex-col gap-2 mb-4 text-left">
          <input
            type="number"
            value={dailyFeeAmount}
            onChange={(e) => setDailyFee(Number(e.target.value))}
            className=" items-center border border-gray-500 rounded-md w-24 py-2 px-4 focus:outline-primary"
          />
          <div className=" flex gap-2 items-center">
          <button
            type="button"
            onClick={()=>setEditDailyFee(false)}
            className="items-center px-4 py-2 border-secondary border text-secondary rounded-md  font-bold text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status==='loading'&& task==='dailyFee'}
            className="items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-sm"
          >
           {status==='loading'&& task==='dailyFee'?'Updating...': 'Update'} 
          </button>
          </div>
        </div>
      </form>:<div className="my-2 mx-auto text-left" 
      >
        <div className="flex space-x-4 mb-4 text-left text-secondary">
          <input
            type="number"
            value={dailyFee}
            readOnly
            className=" items-center border border-secondary rounded-md w-24 py-2 px-4 focus:outline-primary"
          />
          <button
          onClick={()=>{setEditDailyFee(true);setDailyFee(dailyFee);}}
            className="items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-sm"
          >
            Update
          </button>
        </div>
      </div>}
     
      <hr className="my-8" />

      <div className="flex justify-between w-full item-center">
        <h3 className="text-sm mb-4 text-secondary font-semibold">Packages</h3>
        <button
          onClick={()=>setOpenAddPopup(true)}
          className="mb-4 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md flex gap-1 items-center text-sm"
        >
          <IoIosAdd />
          Create Package
        </button>
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-4'>
          <table  className='w-full text-sm text-left text-gray-800 min-h-30'>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Package Title</th>
            <th className="py-2 px-4 border-b text-left">Amount </th>
            <th className="py-2 px-4 border-b text-left">Discount </th>
            <th className="py-2 px-4 border-b text-left">Active</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {packages &&
            packages.map((pkg) => (
              <tr key={pkg.id} className="bg-white m-2 rounded">
                {editPackage && values.id===pkg.id ? (
                  <>
                    <td className="py-2 px-4 border-b text-left ">
                      <input
                        type="text"
                        value={values.name}
                        onChange={(e) => setValues({...values,name:e.target.value})}
                        className="border px-1.5 py-1 rounded-sm"
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      <input
                        type="number"
                        value={values.totalDays}
                        onChange={(e) => setValues({...values,totalDays:Number(e.target.value)})}
                        className="border px-1.5 py-1 rounded-sm"
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      <input
                        type="number"
                        value={values.discount}
                        onChange={(e) => setValues({...values,discount:Number(e.target.value)})}
                        className="border px-1.5 py-1 rounded-sm"
                      />
                    </td>
                    <td  className="py-2 px-4 border-b text-left">

                    </td>
                    <td className="py-2 px-4 border-b text-left flex flex-col gap-2">
                      <button onClick={handleUpdatePackage} className="bg-primary text-white text-sm px-2 py-1 rounded-sm">Save</button>
                      <button onClick={() => setEditPackage(false)} className="text-sm">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border-b text-left">{pkg.name}</td>
                    <td className="py-2 px-4 border-b text-left">
                      {pkg.totalDays}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {pkg.discount}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                    {(status==='loading'&& task==='status_update'&&values.id===pkg.id )? <Spinner /> : <button
        type='button'
     onClick={() => handleToggleActive(pkg.id)}
      className={`
        rounded-full overflow-hidden relative border border-gray-300 w-11 h-6 
        ${pkg.status==='ACTIVE' ? 'bg-primary hover:bg-primary/90' : 'bg-gray-200'}
      `}
    >
      <div
        className={`
          h-4 w-4 rounded-lg transition-transform transition-background mx-1 items-center
          ${pkg.status==='ACTIVE' ? 'bg-white transform translate-x-full' : 'bg-gray-400 transform translate-x-0'}
        `}
      />
    </button>}
                      
                       
                    </td>
                    <td className="py-2 px-4 border-b text-left">

                    <CiEdit className="cursor-pointer" onClick={()=>handleEditPackage(pkg)}/>
                    </td>
                    
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    
     
    </div>
    <Popup title='Add package' open={openAddPopup} setOpen={setOpenAddPopup}>
          <AddPackage  setOpenUpdatePopup={setOpenAddPopup} />
        </Popup>
  </>
    
  );
};

export default withMainComponent(Setting);
