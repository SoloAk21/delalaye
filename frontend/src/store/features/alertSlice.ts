import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "../../model/models";
import { store } from "../store";


interface AlertState {
  alerts: Alert[]
}

const initialState: AlertState = {
  alerts: []
}

const getRandomId = () => {
  const timeStamp = Date.now().toString().slice(0, -4);
  const randomNumber = Math.floor(Math.random() * 10000);
  const id = `${timeStamp}${randomNumber}`
  return id;
}



 export const AlertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<{ alertType: string, msg: string }>) => {
      const id = getRandomId();

      state.alerts.push({
        id, alertType: action.payload.alertType, msg: action.payload.msg
      })
      setTimeout(() => {
        store.dispatch(removeAlert({ id }))
      }, 5000);
    },
    removeAlert: (state, action: PayloadAction<{ id: string }>) => {

      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload.id);

    },
  },

});

export default AlertSlice.reducer;
export const { setAlert, removeAlert } = AlertSlice.actions;
