import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { ICounterStat, IServiceStat } from "../../model/models";
import { apiUrl } from "../../utils/api.util";
// import axios from '../../utils/axios'

// import { toast } from "react-toastify";




interface AuthState {
    status: 'idle' | 'loading' | 'failed';
    counter_status: 'idle' | 'loading' | 'failed';
    service_status: 'idle' | 'loading' | 'failed';
    topup_status: 'idle' | 'loading' | 'failed';

  totalUsers: number;
  totalBrokers: number;
  totalConnections: number;
  brokersByMonth:ICounterStat;
  usersByMonth:ICounterStat;
  connectionsAcceptedByMonth:ICounterStat;
  servicesStat:IServiceStat[]
  topupsCountByMonth:ICounterStat
  
}

const initialState: AuthState = { 
  totalUsers:0,
  totalBrokers:0,
  totalConnections:0,
  status:'idle',
  counter_status:'idle',
  service_status:'idle',
  topup_status:'idle',
  brokersByMonth:{labels:[],data:[]},
  usersByMonth:{labels:[],data:[]},
  connectionsAcceptedByMonth:{labels:[],data:[]},
  servicesStat:[],
  topupsCountByMonth:{labels:[],data:[]},
};

export const getAdminDashboardStat = createAsyncThunk(
  "auth/admindashboard",
  async (_data,thunkAPI) => {
    try {
     
      const response = await axios.get(`${apiUrl}/api/admin/dashboard/count`);
      const data = response.data
      return data;
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

  },
);
export const getCounterStat = createAsyncThunk(
  "auth/getCounterStat",
  async (year:number,thunkAPI) => {
    try {
     
      const response = await axios.get(`${apiUrl}/api/admin/dashboard/counter/${year}`);
      const data = response.data
      return data;
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

  },
);
export const getServicesStat = createAsyncThunk(
  "auth/getServicesStat",
  async (_data,thunkAPI) => {
    try {
     
      const response = await axios.get(`${apiUrl}/api/admin/dashboard/services`);
      const data = response.data
      return data;
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

  },
);

export const getTopupStat = createAsyncThunk(
  "auth/getTopupStat",
  async (year:number,thunkAPI) => {
    try {
     
      const response = await axios.get(`${apiUrl}/api/admin/dashboard/topup/${year}`);
      const data = response.data
      return data;
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

  },
);

export const DashboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAdminDashboardStat.fulfilled, (state, action) => {
        const {totalUsers,totalBrokers,totalConnections} =action.payload;
      state.status = 'idle'
      state.totalBrokers= totalBrokers;
      state.totalUsers= totalUsers;
      state.totalConnections= totalConnections;
    }).addCase(getAdminDashboardStat.pending, (state) => {
      state.status = 'loading'
    }).addCase(getAdminDashboardStat.rejected, (state) => {
      state.status = 'failed';
      
    })
    .addCase(getCounterStat.fulfilled, (state, action) => {
  
      const {brokersByMonth,usersByMonth,connectionsAcceptedByMonth} = action.payload;
      state.usersByMonth=usersByMonth;
      state.brokersByMonth=brokersByMonth;
      state.connectionsAcceptedByMonth=connectionsAcceptedByMonth;
    state.counter_status = 'idle'
   
  }).addCase(getCounterStat.pending, (state) => {
    state.counter_status = 'loading'
  }).addCase(getCounterStat.rejected, (state) => {
    state.counter_status = 'failed';
  })
  .addCase(getServicesStat.fulfilled, (state, action) => {
   state.servicesStat=action.payload;
  state.service_status = 'idle'
 
}).addCase(getServicesStat.pending, (state) => {
  state.service_status = 'loading'
}).addCase(getServicesStat.rejected, (state) => {
  state.service_status = 'failed';
}) .addCase(getTopupStat.fulfilled, (state, action) => {
  
  state.topupsCountByMonth=action.payload.topupsCountByMonth;
 state.topup_status = 'idle'

}).addCase(getTopupStat.pending, (state) => {
 state.topup_status = 'loading'
}).addCase(getTopupStat.rejected, (state) => {
 state.topup_status = 'failed';
})
  },
});

export default DashboardSlice.reducer;
