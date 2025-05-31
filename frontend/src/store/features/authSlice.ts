import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios,{isAxiosError} from "axios";
// import axios from '../../utils/axios'
import { store } from "../store";
import { setAlert } from "./alertSlice";
import setAuthToken from "../../utils/setAuthToken";

import { Staff, User } from "../../model/models";
import { toast } from "sonner";
import { apiUrl } from "../../utils/api.util";
// import { toast } from "react-toastify";
interface Dashboard {
  userStat :{
    labels: string[]
    registeredUsers: string[]
    newUsers: string[]
  }
  equbRoundStat:{
    round:number
    userCount:number
  }[]
}



interface AuthState {
  token: string | null;
  user: Staff | null;
  status: 'idle' | 'loading' | 'failed';
  task:string
  isAuthenticated: boolean
  dashboard:Dashboard|null
  
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  status: 'idle',
  task:'',
  user: null,
  dashboard:null
};

export const fetchUser = createAsyncThunk(
  "auth/fetch",
  async (usr, thunkAPI) => {
    try {
     console.log(usr)

      setAuthToken(localStorage.token);

      const response = await axios.get(`${apiUrl}/api/auth/staff`);
      const data = response.data
      return data;
    } catch (error) {
      let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors

      } else {
        errors = error && error.toString()
      }
      console.error(error)
      return thunkAPI.rejectWithValue(errors)
    }

  },
);



type LoginValues = {
  email: string
  password: string
}
export const login = createAsyncThunk(
  "auth/login",
  async (formData: LoginValues, thunkAPI) => {
    const { email, password } = formData
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const body = JSON.stringify({
      email, password
    })
    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/staff/login`,
        body,
        config
      )

      return res.data
    } catch (error) {
         let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
          })
        }
      } else {
        errors = error && error.toString()
      }
      console.error(error)
      return thunkAPI.rejectWithValue(errors)
    }
  }
)



interface UpdateAccount extends User {
  setUpdateAccount:React.Dispatch<React.SetStateAction<boolean>>
}
export const updateUserAccount = createAsyncThunk(
  "auth/updateUserAccount",
  async (formData: UpdateAccount, thunkAPI) => {
    const { fullName,email,phone,password,setUpdateAccount } = formData
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const body = JSON.stringify({
      fullName,email,phone,password
    })
    try {
      const res = await axios.put(
        `${apiUrl}/api/users/account`,
        body,
        config
      )
      setUpdateAccount(false)
toast.success('Account updated successfully.')
      return res.data
    } catch (error) {
         let errors: any = []
      if (isAxiosError(error)) {
        errors = error.response?.data.errors
        if (errors) {
          errors.forEach((err: any) => {
            store.dispatch(setAlert({ alertType: 'error', msg: err?.msg }))
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





export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user;

      state.isAuthenticated = true;
      state.status = 'idle'
    }).addCase(fetchUser.pending, (state) => {
      state.status = 'loading'
    }).addCase(fetchUser.rejected, (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.status = 'failed';
      state.isAuthenticated = false;
      state.user = null
    })
    .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.token = action.payload.token
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.status = 'idle'
      }).addCase(login.pending, (state) => {
        state.status = 'loading'
      }).addCase(login.rejected, (state) => {

        state.status = 'failed';
        state.isAuthenticated = false;
      })
      .addCase(updateUserAccount.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'idle'
      }).addCase(updateUserAccount.pending, (state) => {
        state.status = 'loading'
      }).addCase(updateUserAccount.rejected, (state) => {

        state.status = 'failed';
        // state.isAuthenticated = false;
      })
      
      
  },
});

export default AuthSlice.reducer;
export const { logout } = AuthSlice.actions;
