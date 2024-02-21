import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { JsonClient } from '../../Config'
import sortBy from 'lodash/sortBy';

const initialState = {
  data:[],
  pm_projects:[],
  all_projects:[],
  filtered_pm_projects:[],
  grouped_by_tdo:[],
  filtered_group_by_tdo:[],
  tdo_list:[],
  assignee:[],
  wbs: [],
  status:'idle',
  error:''
}

export const fetchProjectsThunk = createAsyncThunk('projects/fetchProjectsThunk', async (user_id) => {
  const response = await JsonClient.get('project/assigned/all/'+user_id+'/')
  return response.data
})
export const fetchProjectsForPMThunk = createAsyncThunk('projects/fetchProjectsForPMThunk', async (user_id) => {
  const response = await JsonClient.get('project/all/'+user_id+'/')
  console.log("pm projects", response.data)
  return response.data
})

// export const fetchProjectsbyTDOThunk1 = createAsyncThunk('projects/fetchProjectsbyTDOThunk', async (user_id) => {
//   const response = await JsonClient.get('project/rall/'+user_id+'/')
//   console.log("grouped by TDO projects", response.data)
//   return response.data
// })

export const fetchProjectsbyTDOThunk = createAsyncThunk('projects/fetchProjectsbyTDOThunk', async (user_id) => {
  const response = await JsonClient.get('project/fixronall/'+user_id+'/')
  console.log("grouped by TDO projects", response.data)
  return response.data
})


export const fetchAllProjectsThunk = createAsyncThunk('projects/fetchAllProjectsThunk', async () => {
  const response = await JsonClient.get('project/all/')
  console.log("every projects", response.data)
  return response.data
})

export const fetchProjectsAssigneeThunk = createAsyncThunk('projects/fetchProjectsAssigneeThunk', async (work_package_number) => {
    const response = await JsonClient.get('project/assignee/list/'+work_package_number+'/')
    // console.log('thunk result',response.data)
    let projectAssignee = []
    response.data.map((item)=> {
        if(!projectAssignee.find(assignee => assignee.id == item.assignee.id)){
            projectAssignee.push(item.assignee)
        }
    })
    return projectAssignee
  })

export const fetchWbsThunk = createAsyncThunk('wbs/createWbsThunk', async (data) => {
  const response = await JsonClient.post('wbs/create/', data)
  // console.log("wbs/create/", response.data)
  return response.data
})

const selectEntities = state => state.entities

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    push_item: (state,val) => {
      console.log('dispatching ----- ',val)
      state.tdo_list = [...state.tdo_list,val.payload]
    },
    
    filter_pm_projects: (state,tdos) => {
      let temp=[]
      let projects=[...state.pm_projects]
      for(let index1=0;index1<tdos.payload.length;index1++){
        
        for(let index2=0;index2<projects.length;index2++){
          console.log('temp',projects[index2])
        } 
      }
    },
    reset_filter_pm_projects: (state) => {
      state.filtered_pm_projects=[]
    },
    
  },
  extraReducers: {
    [fetchProjectsThunk.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchProjectsThunk.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.data = sortBy(action.payload, 'sub_task')
    },
    [fetchProjectsThunk.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [fetchProjectsAssigneeThunk.fulfilled]: (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.assignee = action.payload
    },
    [fetchWbsThunk.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.wbs = action.payload
    },
    [fetchProjectsForPMThunk.fulfilled]: (state, action) => {
      state.pm_projects = action.payload
      state.filtered_pm_projects = action.payload
    },
    [fetchAllProjectsThunk.fulfilled]: (state, action) => {
      state.all_projects = action.payload
    },
    [fetchProjectsbyTDOThunk.fulfilled]: (state, action) => {
      state.grouped_by_tdo = action.payload
      
    },
  }
})
//const get_projects_by_tdos = (state,tdos) => state.pm_projects.filter(item=>item.project.task_delivery_order.id==4)
// Action creators are generated for each case reducer function
export const { push_item,filter_pm_projects,reset_filter_pm_projects,reset_group_by_tdo} = projectsSlice.actions
export default projectsSlice.reducer
