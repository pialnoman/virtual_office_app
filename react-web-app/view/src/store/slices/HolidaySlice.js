import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'
const initialState = {
  data:[],
  status:'idle',
  error:''
}


export const fetchHolidays = createAsyncThunk('holiday/fetchAll', async () => {
  const response = await JsonClient.get('organizations/holiday/all/')
  // console.log("wbs/create/", response.data)
  return response.data
})

export const holidaySlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [fetchHolidays.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchHolidays.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.data = action.payload
    },
    [fetchHolidays.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
})

// Action creators are generated for each case reducer function

export default holidaySlice.reducer
