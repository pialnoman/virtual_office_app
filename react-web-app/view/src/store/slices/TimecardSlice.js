import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { JsonClient } from '../../Config'

const initialState ={
    data:[],
    pm_timecards:[],
    user_hours_used_left:{},
    user_weekly_submitted_timecards:[],
    status:'idle',
    error:''
}
export const fetchTimecardThunk =createAsyncThunk('timecard/fetchTimeCardThunk',async(user_id) =>{
    const response = await JsonClient.get('wbs/user/time-card/list/'+user_id+'/')
    console.log('time card for user',response.data)
    return response.data
})
export const fetchAllTimecardsPmThunk= createAsyncThunk('timecard/fetchAllTimecardsPm',async(user_id) =>{
    const response = await JsonClient.get('wbs/user-wise/weekly-time-card/'+user_id+'/')
    console.log('pm',response.data[0])
    return response.data[0]
})

export const fetchUserHoursUsedAndLeft= createAsyncThunk('timecard/fetchUserHoursUsedAndLeft',async(user_id) =>{
    const response = await JsonClient.get('organizations/user/hours/used-left/'+user_id+'/')
    console.log('hours used and left',response.data)
    return response.data
})

export const fetchUserSubmittedTimecards= createAsyncThunk('timecard/fetchUserSubmittedTimecards',async(user_id) =>{
    const response = await JsonClient.get('wbs/user/weekly-submitted-timecards/')
    console.log('submitted timecards',response.data)
    return response.data
})

export const timecardSlice = createSlice({
    name:'timecardList',
    initialState,
    reducers:{},
    extraReducers:{
        [fetchTimecardThunk.pending]:(state,action) =>{
            state.status = 'loading'
        },
        [fetchTimecardThunk.fulfilled]:(state,action) =>{
            state.status = 'succeeded'
            state.data = action.payload
        },
        [fetchTimecardThunk.rejected]:(state,action) =>{
            state.status = 'failed'
            state.error = action.error.message
        },
        [fetchAllTimecardsPmThunk.pending] :(state,action) =>{
            state.status='loading'
        },
        [fetchAllTimecardsPmThunk.fulfilled]:(state,action) =>{
            state.status ='succeded'
            state.pm_timecards= action.payload
       
        },
        [fetchAllTimecardsPmThunk.rejected]:(state,action)=>{
            state.status='failed'
            state.error = action.error.message
        },
        [fetchUserHoursUsedAndLeft.pending]:(state,action) =>{
            state.status = 'loading'
        },
        [fetchUserHoursUsedAndLeft.fulfilled]:(state,action) =>{
            state.status = 'succeeded'
            state.user_hours_used_left = action.payload
        },
        [fetchUserHoursUsedAndLeft.rejected]:(state,action) =>{
            state.status = 'failed'
            state.error = action.error.message
        },
        [fetchUserSubmittedTimecards.pending]:(state,action) =>{
            state.status = 'loading'
        },
        [fetchUserSubmittedTimecards.fulfilled]:(state,action) =>{
            state.status = 'succeeded'
            state.user_weekly_submitted_timecards = action.payload
        },
        [fetchUserSubmittedTimecards.rejected]:(state,action) =>{
            state.status = 'failed'
            state.error = action.error.message
        },
    }
})
export default timecardSlice.reducer