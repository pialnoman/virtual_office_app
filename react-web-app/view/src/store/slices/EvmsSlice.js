import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'

const initialState = {
    data: [],
    pm_evms: [],
    status: 'idle',
    error: ''
}

export const fetchEvmsUpdateThunk = createAsyncThunk('evms/createEvmsThunk', async (data) => {
    const response = await JsonClient.post('evms/create/', data)
    console.log('evms create response', response.data)
    return response.data
}

)
export const fetchEvmsThunk = createAsyncThunk('evms/fetchEvmsThunk', async (user_id) => {
    const response = await JsonClient.get('evms/list/' +user_id+ '/')
    console.log("EVMS for PM", response)
    return response.data
})

export const evmsSlice = createSlice({
    name: 'evmsList',
    initialState,
    reducers: {

    },
    extraReducers: {
        [fetchEvmsThunk.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchEvmsThunk.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.data = action.payload
        },
        [fetchEvmsThunk.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
    }
})
// Action creators are generated for each case reducer function
export default evmsSlice.reducer
