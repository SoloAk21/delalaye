import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios,{isAxiosError} from "axios"
// import axios from '../../utils/axios'
import { Broker } from '../../model/models'
import { toast } from 'sonner'
import { apiUrl } from "../../utils/api.util"

export interface BrokerState {
  brokers: Broker[]
  broker:Broker|null
  approvedBrokers: Broker[]
  notapprovedBrokers: Broker[]
  status: "idle" | "loading" | "failed"
  task:string
  total:number
  page:number
  limit:number
  error: string | null;

}

const initialState: BrokerState = {
  brokers: [],
  broker:null,
  approvedBrokers: [],
  notapprovedBrokers: [],
  status: "idle",
  task:'',
  total:0,
  limit:10,
  page:1,
  error:null

}
// interface UpdateStaffProps {
//   staffId: string;
//   updatedStaff: Broker;
// }
export const getRegisteredBrokers = createAsyncThunk("broker/getRegisteredBrokers", async (pagination:IPaginationQuery) => {
  const {_limit,_page} = pagination;
  const response = await axios.get(`${apiUrl}/api/admin/brokers/registered?_page=${_page}&_limit=${_limit}`)
  
  return response.data
});

interface IPaginationQuery {
  _page: number;
  _limit: number;
}

interface SearchQuery extends IPaginationQuery {
  search: string;
  searchBy: string;
}
export const getApprovedBrokers = createAsyncThunk("broker/getApprovedBrokers", async (pagination:IPaginationQuery) => {
  const {_limit,_page} = pagination;
  const response = await axios.get(`${apiUrl}/api/admin/brokers/approved?_page=${_page}&_limit=${_limit}`)
  
  return response.data
});
export const searchApprovedBrokers = createAsyncThunk("broker/searchApprovedBrokers", async (searchQuery:SearchQuery) => {
  const {search,searchBy,_limit,_page} = searchQuery;
  const response = await axios.get(`${apiUrl}/api/admin/brokers/approved/search?search=${search}&searchBy=${searchBy}&_page=${_page}&_limit=${_limit}`)
  
  return response.data
});

export const searchRegisteredBrokers = createAsyncThunk("broker/searchRegisteredBrokers", async (searchQuery:SearchQuery) => {
  const {search,searchBy,_limit,_page} = searchQuery;
  const response = await axios.get(`${apiUrl}/api/admin/brokers/registered/search?search=${search}&searchBy=${searchBy}&_page=${_page}&_limit=${_limit}`)
  
  return response.data
});

export const getRegsteredBrokers = createAsyncThunk("broker/getRegsteredBrokers", async () => {
  const response = await axios.get(`${apiUrl}/api/admin/brokers/registered`)
  
  return response.data
});

export const getAllBrokers = createAsyncThunk("broker/getAllBrokers", async () => {
  const response = await axios.get(`${apiUrl}/api/admin/allbrokers`)
  
  return response.data
});
export const getBroker = createAsyncThunk("broker/getBroker", async (id:string) => {
  const response = await axios.get(`${apiUrl}/api/brokers/${id}`);
  
  return response.data;
});

interface UpdateBrokerProp extends Broker  {
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>
  updatedBroker: Broker;
  selectedServices:number[];
 
}
export const updateBroker = createAsyncThunk(
  "broker/updateBroker",
  async (formData: UpdateBrokerProp, thunkAPI) => {
    console.log('formData')
    console.log(formData)
    const { updatedBroker,setOpenUpdatePopup,selectedServices } = formData;
    const {fullName,phone,email,id}=updatedBroker;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const body = JSON.stringify({
      fullName,phone,email,selectedServices
    })
    try {
      const res = await axios.put(
        `${apiUrl}/api/admin/broker/${id}`,
        body,
        config
      )
      setOpenUpdatePopup(false);
      toast.success(`Broker updated successfully.`);
      return res.data
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
)

interface UpdateBrokerProfileProp  {
  setValues: React.Dispatch<React.SetStateAction<Broker>>
  id:number
  photo: string;
 
}
export const updateBrokerProfilePic = createAsyncThunk(
  "broker/updateBrokerProfilePic", 
  async (formData: UpdateBrokerProfileProp, thunkAPI) => {
    console.log('formData')
    console.log(formData)
    const {id, photo, } = formData
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const body = JSON.stringify({
     photo
    })
    try {
      const res = await axios.put(
        `${apiUrl}/api/admin/broker/photo/${id}`,
        body,
        config
      )
      // setOpenUpdatePopup(false);
      toast.success(`Broker photo updated successfully.`);
      // const updatedBroker = res.data as Broker
      // setValues(updatedBroker)
      return res.data
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
)

interface BrokerApproval  {
    id: number;
    setOpenUpdatePopup?: React.Dispatch<React.SetStateAction<boolean>>
  }

export const approveBroker = createAsyncThunk(
    "broker/approveBroker",
    async (formData: BrokerApproval, thunkAPI) => {
      const { id } = formData;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
     
      try {
        const res = await axios.put(
          `${apiUrl}/api/admin/broker/approve/${id}`,
          config
        )
        // setOpenUpdatePopup(false);
        toast.success(`Broker approved.`);
        return res.data
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
  )
export const deleteBroker = createAsyncThunk(
  'broker/deleteBroker',
  async (brokerID: number, 
    { rejectWithValue }
    )=> {
    try {
      await axios.delete(`${apiUrl}/api/admin/broker/${brokerID}`);
toast.success('Broker deleted');
      return brokerID;
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
      return rejectWithValue(errors)
    }
  }
);

export const BrokerSlice = createSlice({
  name: "broker",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
  
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder
    .addCase(getApprovedBrokers.pending, state => {
        state.status = "loading"
      })
      .addCase(getApprovedBrokers.fulfilled, (state, action) => {
        // state.brokers = action.payload.allBrokers;
        state.approvedBrokers= action.payload.approvedBrokers;
        state.total=action.payload.total;
        state.page=action.payload.page;
        state.limit=action.payload.limit;
        state.status = "idle"
      })     
      .addCase(getApprovedBrokers.rejected, state => {
        state.status = "failed"
      })
      .addCase(searchApprovedBrokers.pending, state => {
        state.status = "loading"
      })
      .addCase(searchApprovedBrokers.fulfilled, (state, action) => {
        // state.brokers = action.payload.allBrokers;
        state.approvedBrokers= action.payload.approvedBrokers;
        state.total=action.payload.total;
        state.page=action.payload.page;
        state.limit=action.payload.limit;
        state.status = "idle"
      })     
      .addCase(searchApprovedBrokers.rejected, state => {
        state.status = "failed"
      })
      .addCase(searchRegisteredBrokers.pending, state => {
        state.status = "loading"
      })
      .addCase(searchRegisteredBrokers.fulfilled, (state, action) => {
        // state.brokers = action.payload.allBrokers;
        state.approvedBrokers= action.payload.approvedBrokers;
        state.total=action.payload.total;
        state.page=action.payload.page;
        state.limit=action.payload.limit;
        state.status = "idle"
      })     
      .addCase(searchRegisteredBrokers.rejected, state => {
        state.status = "failed"
      })
      .addCase(getRegisteredBrokers.pending, state => {
        state.status = "loading"
      })
      .addCase(getRegisteredBrokers.fulfilled, (state, action) => {
        // state.brokers = action.payload.allBrokers;
        state.notapprovedBrokers= action.payload.notapprovedBrokers;
        state.total=action.payload.total;
        state.page=action.payload.page;
        state.limit=action.payload.limit;
        state.status = "idle"
      })
     
      .addCase(getRegisteredBrokers.rejected, state => {
        state.status = "failed"
      })
      .addCase(getAllBrokers.pending, state => {
        state.status = "loading"
      })
      .addCase(getAllBrokers.fulfilled, (state, action) => {
        // state.brokers = action.payload.allBrokers;
        state.approvedBrokers= action.payload.approvedBrokers;
        state.notapprovedBrokers= action.payload.notapprovedBrokers;
        state.status = "idle"
      })
      .addCase(getAllBrokers.rejected, state => {
        state.status = "failed"
      })
      .addCase(getBroker.pending, state => {
        state.status = "loading"
      })
      .addCase(getBroker.fulfilled, (state, action) => {
        state.broker = action.payload;
        state.status = "idle"
      })
      .addCase(getBroker.rejected, state => {
        state.status = "failed"
      })
      
      .addCase(updateBroker.pending, state => {
        state.status = "loading"
      })
      .addCase(updateBroker.fulfilled, (state, action) => {
        const updatedBroker = action.payload
        state.approvedBrokers= state.approvedBrokers.map(broker=>{
          
          if(broker.id===updatedBroker.id) return updatedBroker;
          return broker;
        })
        state.notapprovedBrokers= state.notapprovedBrokers.map(broker=>{
          if(broker.id===updatedBroker.id) return updatedBroker;
          return broker;
        })        
        state.status = "idle"
        state.task=''
      })
      .addCase(updateBroker.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateBrokerProfilePic.pending, state => {
        state.status = "loading"
      })
      .addCase(updateBrokerProfilePic.fulfilled, (state, action) => {
        const broker = action.payload
        state.brokers= state.brokers.map(broker=>{
          
          if(broker.id===broker.id) return broker;
          return broker;
        })
        state.notapprovedBrokers= state.notapprovedBrokers.map(usr=>{
          if(usr.id===broker.id) return broker;
          return usr;
        })        
        state.status = "idle"
        state.task=''
      })
      .addCase(updateBrokerProfilePic.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(approveBroker.pending, state => {
        state.status = "loading"
      })
      .addCase(approveBroker.fulfilled, (state, action) => {
        const approvedBroker = action.payload.broker
        console.log('approvedBroker')
        console.log(approvedBroker)
        state.notapprovedBrokers = state.notapprovedBrokers.filter(broker => broker.id!==approvedBroker.id);
        state.approvedBrokers= [...state.approvedBrokers,approvedBroker]        
        state.status = "idle"
        state.task=''
      })
      .addCase(approveBroker.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteBroker.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBroker.fulfilled, (state, action) => {
        state.status = 'idle';
        state.notapprovedBrokers = state.notapprovedBrokers.filter(
          (usr) => usr.id !== action.payload
        );
      })
      .addCase(deleteBroker.rejected, (state) => {
        state.status = 'failed';
      });

  },
})

export default BrokerSlice.reducer