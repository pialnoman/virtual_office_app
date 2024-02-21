import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'
const initialState = {
  data: [],
  status: 'idle',
  error: ''
}

export const fetchWorkTypes = createAsyncThunk('organizations/fetchWorkTypes', async () => {
  const response = await JsonClient.get('organizations/work-types/')
  console.log("all work types", response)
  return response.data
})



export const worktypeSlice = createSlice({
  name: 'worktypes',
  initialState,
  reducers: {

  },
  extraReducers: {
    [fetchWorkTypes.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchWorkTypes.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.data = action.payload
    },
    // [fetchUserWiseWbsThunk.fulfilled]: (state, action) => {
    //   state.status = 'succeeded'
    //   // Add any fetched posts to the array
    //   state.data = action.payload
    // },
    [fetchWorkTypes.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
})

// Action creators are generated for each case reducer function

export default worktypeSlice.reducer
