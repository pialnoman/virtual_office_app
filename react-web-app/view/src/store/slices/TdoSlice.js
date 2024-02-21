import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'

const initialState = {
  data:[],
  status:'idle',
  error:''
}

export const fetchTdosThunk = createAsyncThunk('projects/fetchTdosThunk', async (user_id) => {
  const response = await JsonClient.get('project/tdo/list/')
  return response.data
})

export const tdosSlice = createSlice({
  name: 'tdos',
  initialState,
  reducers: {
    push_item: (state,val) => {
        console.log('dispatching ----- ',val)
        state.data = [...state.data,val.payload]
    },
  },
  extraReducers: {
    [fetchTdosThunk.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchTdosThunk.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      //state.data = action.payload
      state.data=[]
      Array.from(action.payload).forEach((tdo,idx)=>{
          state.data.push({value:{"title": tdo.title, "details": tdo.description},label:tdo.title})
      })
    },
    [fetchTdosThunk.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

// Action creators are generated for each case reducer function
export const { push_item} = tdosSlice.actions
export default tdosSlice.reducer
