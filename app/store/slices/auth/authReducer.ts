import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../../store"
import { signinService, signupService, updateUserService, verifyEmailService } from "./authService"
import { AuthI, UserI } from "./types"

const initialState: AuthI = {
  loading: false,
  data: null,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`

    // setTodos: (state, action: PayloadAction<TodosI[]>) => {
    //   state.data = action.payload;
    // },
    logoutUser: (state) => {
      state.loading = false
      state.data = null
      state.error = null
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(signupService.pending, (state) => {
        state.loading = true
      })
      .addCase(signupService.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.result
      })
      .addCase(signupService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add extra reducers for signinService
      .addCase(signinService.pending, (state) => {
        state.loading = true
      })
      .addCase(signinService.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.result
      })
      .addCase(signinService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      //verifyEmailService
      .addCase(verifyEmailService.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyEmailService.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.result
      })
      .addCase(verifyEmailService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      //verifyEmailService
      .addCase(updateUserService.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserService.fulfilled, (state, action) => {
        console.log("updateUserService === ", action.payload)
        state.loading = false
        state.data = action.payload.result
      })
      .addCase(updateUserService.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {} = authSlice.actions

export default authSlice.reducer