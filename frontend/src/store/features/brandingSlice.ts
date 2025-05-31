import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { Branding } from "../../model/models";
import { apiUrl } from "../../utils/api.util";

export interface BrandingState {
  branding: Branding | null;
  status: "idle" | "loading" | "failed";
  task: string;
  error: string | null;
}

const initialState: BrandingState = {
  branding: null,
  status: "idle",
  task: "",
  error: null,
};

export const fetchBranding = createAsyncThunk(
  "branding/fetchBranding",
  async () => {
    const response = await axios.get(`${apiUrl}/api/branding`);
    return response.data;
  }
);

interface UpdateBrandingProp {
  brandingData: FormData;
  setOpenUpdatePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const updateBranding = createAsyncThunk(
  "branding/updateBranding",
  async (prop: UpdateBrandingProp, thunkAPI) => {
    try {
      const { brandingData, setOpenUpdatePopup } = prop;
      const response = await axios.post(
        `${apiUrl}/api/branding`,
        brandingData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setOpenUpdatePopup(false);
      toast.success("Branding updated successfully.");
      return response.data;
    } catch (error) {
      let errors: any = [];
      if (isAxiosError(error)) {
        errors = error.response?.data.errors;
        if (errors) {
          errors.forEach((err: any) => {
            toast.error(err?.msg);
          });
        }
      } else {
        errors = error && error.toString();
      }
      console.error(errors);
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export const BrandingSlice = createSlice({
  name: "branding",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranding.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBranding.fulfilled, (state, action) => {
        state.status = "idle";
        state.branding = action.payload;
      })
      .addCase(fetchBranding.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch branding";
      })
      .addCase(updateBranding.pending, (state) => {
        state.status = "loading";
        state.task = "updating";
      })
      .addCase(updateBranding.fulfilled, (state, action) => {
        state.status = "idle";
        state.task = "";
        state.branding = action.payload;
      })
      .addCase(updateBranding.rejected, (state, action) => {
        state.status = "failed";
        state.task = "";
        state.error = action.payload as string;
      });
  },
});

export default BrandingSlice.reducer;
