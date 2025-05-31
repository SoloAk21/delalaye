import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios,{isAxiosError} from "axios"
import { NewPackage, Package, } from '../../model/models'
import { toast } from 'sonner'
import { apiUrl } from "../../utils/api.util"

export interface SettingState {
  dailyFee:number
  packages: Package[]
  package:Package|null
  status: "idle" | "loading" | "failed"
  task:string
  error: string | null;

}

const initialState: SettingState = {
  dailyFee:0,
  packages: [],
  package:null,
  status: "idle",
  task:'',
  error:null

}
// interface UpdateStaffProps {
//   staffId: string;
//   updatedStaff: User;
// }

export const getSettings = createAsyncThunk("setting/getSettings", async () => {
  const response = await axios.get(`${apiUrl}/api/admin/settings`)
  
  return response.data
});

interface AddPackageProp extends NewPackage {
    setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const addPackage = createAsyncThunk(
  'setting/addPackage',
  async (newPackage: AddPackageProp,thunkAPI) => {
    try {
     const response = await axios.post(`${apiUrl}/api/admin/package`, newPackage);
     newPackage.setOpenUpdatePopup(false);
    toast.success('New package added')
    return response.data;   
    } catch (error) {
              let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            toast.error(err?.msg)
            // store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
          })
        }
      } else {
        errors = error && error.toString()
      }
      console.error(errors)
      return thunkAPI.rejectWithValue(errors)
    }
    
  }
);


interface UpdatePackageProp  {
  setEditPackage: React.Dispatch<React.SetStateAction<boolean>>
 updatedPackage: Package;

}
export const updatePackage = createAsyncThunk(
  'setting/updatePackage',
  async (updateProps: UpdatePackageProp, 
    thunkAPI
    ) => {
    try {
      const {  updatedPackage,setEditPackage } = updateProps;
      
      const response = await axios.put(`${apiUrl}/api/admin/package/${updatedPackage.id}`, updatedPackage);
      setEditPackage(false)
      toast.success('Updated package')
      return response.data;
    } catch (error) {
          let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            toast.error(err?.msg)
            // store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
          })
        }
      } else {
        errors = error && error.toString()
      }
      console.error(errors)
      return thunkAPI.rejectWithValue(errors)
    }
  }
);
interface UpdateDailyFeeProp  {
  setEditDailyFee: React.Dispatch<React.SetStateAction<boolean>>
 dailyFee: number;
}
export const updateDailyFee = createAsyncThunk(
  'setting/updateDailyFee',
  async (data: UpdateDailyFeeProp, 
    thunkAPI
    ) => {
    try {
  
      const {dailyFee,setEditDailyFee}= data
      const response = await axios.put(`${apiUrl}/api/admin/settings`, {dailyFee});
      setEditDailyFee(false)
      toast.success('Updated daily fee')
      return response.data;
    } catch (error) {
          let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            toast.error(err?.msg)
            // store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
          })
        }
      } else {
        errors = error && error.toString()
      }
      console.error(errors)
      return thunkAPI.rejectWithValue(errors)
    }
  }
);

export const updatePackageStatus = createAsyncThunk(
  'setting/updatePackageStatus',
  async (id: number, 
    thunkAPI
    ) => {
    try {
      const response = await axios.put(`${apiUrl}/api/admin/package/status/${id}`);    
      toast.success(`Updated package's status successfully.`)
      return response.data;
    } catch (error) {
          let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            toast.error(err?.msg)
            // store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
          })
        }
      } else {
        errors = error && error.toString()
      }
      console.error(errors)
      return thunkAPI.rejectWithValue(errors)
    }
  }
);

export const deletePackage = createAsyncThunk(
  'setting/deletePackage',
  async (id: number, 
    // { rejectWithValue }
    )=> {
    try {
      await axios.delete(`${apiUrl}/api/admin/package/${id}`);

      return id;
    } catch (error) {
      // return rejectWithValue(error.response.data);
    }
  }
);

interface SendSmsProp {
  to:'brokers'|'users'
  services:number[]
  message:string
  resetValues: () => void
}

export const sendSms = createAsyncThunk(
'setting/sendSms',
async (smsDetails: SendSmsProp,thunkAPI) => {
  try {
    const {to,services,message,resetValues}= smsDetails;
  const response = await axios.post(`${apiUrl}/api/admin/sms`, {to,services,message});
  resetValues();
  toast.success('Sms sent successfully.')
  return response.data;   
  } catch (error) {
            let errors: any = []
    if (isAxiosError(error)) {
      errors = error.response?.data.errors;
      if (errors) {
        errors.forEach((err: any) => {
          toast.error(err?.msg);
        })
      }
    } else {
      errors = error && error.toString()
    }
    console.error(errors)
    return thunkAPI.rejectWithValue(errors)
  }
  
}
);



export const SettingSlice = createSlice({
  name: "setting",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
  
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder
    .addCase(addPackage.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addPackage.fulfilled, (state, action) => {
      state.status = "idle";
      state.packages.push(action.payload);
    })
    .addCase(addPackage.rejected, (state) => {
      state.status = "failed";
      // state.error = action.error.message;
    })
      .addCase(getSettings.pending, state => {
        state.status = "loading"
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.dailyFee = action.payload.dailyFee;
        state.packages= action.payload.packages;
        state.status = "idle"
      })
      .addCase(getSettings.rejected, state => {
        state.status = "failed"
      })
      .addCase(deletePackage.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(deletePackage.fulfilled, (state, action) => {
            state.status = 'idle';
            state.packages = state.packages.filter(
                (pack) => pack.id !== action.payload
                );
            })
            .addCase(deletePackage.rejected, (state) => {
              state.status = 'failed';
            })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;

        const updatedPackage = action.payload;
        const packageIndex = state.packages.findIndex((pack) => pack.id === updatedPackage.id);
        if (packageIndex !== -1) {
          state.packages[packageIndex] = updatedPackage;
        }
      })
      .addCase(updatePackage.pending, state => {
        state.status = "loading"
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePackageStatus.fulfilled, (state, action) => {
        state.status = 'idle';
        state.task=''
        state.error = null;

        const updatedPackage = action.payload;
        const packageIndex = state.packages.findIndex((pack) => pack.id === updatedPackage.id);
        if (packageIndex !== -1) {
          state.packages[packageIndex] = updatedPackage;
        }
      })
      .addCase(updatePackageStatus.pending, state => {
        state.status = "loading"
        state.task ='status_update'
      })
      .addCase(updatePackageStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.task=''
        state.error = action.payload as string;
      })
      .addCase(updateDailyFee.fulfilled, (state, action) => {
        state.status = 'idle';
        state.task=''

        state.dailyFee= action.payload.dailyFee
      })
      .addCase(updateDailyFee.pending, state => {
        state.status = "loading"
        state.task='dailyFee'
      })
      .addCase(updateDailyFee.rejected, (state, ) => {
        state.status = 'failed';
        state.task=''
      })
      .addCase(sendSms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendSms.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(sendSms.rejected, (state) => {
        state.status = "failed";
        // state.error = action.error.message;
      });

  },
})

export default SettingSlice.reducer