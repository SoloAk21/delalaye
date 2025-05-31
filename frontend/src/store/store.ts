import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AuthSlice } from "./features/authSlice";
import  { StaffSlice } from "./features/staffSlice";
// import { BranchSlice } from './features/branchSlice'
import { AlertSlice } from "./features/alertSlice";
import { ServiceSlice } from "./features/serviceSlice";
import { BrokerSlice } from "./features/brokerSlice";
import { DashboardSlice } from "./features/dashboardSlice";
import {SettingSlice} from "./features/settingSlice";
// import { PopAlertSlice } from "./features/popAlert";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    staff: StaffSlice.reducer,
    broker: BrokerSlice.reducer,
    service: ServiceSlice.reducer,
    alert: AlertSlice.reducer,
    dashboard: DashboardSlice.reducer,
    setting: SettingSlice.reducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


