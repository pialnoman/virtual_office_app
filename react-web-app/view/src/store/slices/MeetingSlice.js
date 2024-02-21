import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'
const initialState = {
  data:[],
  status:'idle',
  error:''
}


export const fetchMeetingList = createAsyncThunk('profile/fetchMeetingList', async (user_id) => {
  const response = await JsonClient.get('meetings/list/'+user_id+'/')
  console.log("meetings list", response.data)
  return response.data
})

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {

  },
  extraReducers: {
    [fetchMeetingList.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchMeetingList.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.data = action.payload
    },
    [fetchMeetingList.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  }
})

// Action creators are generated for each case reducer function

export default meetingSlice.reducer
