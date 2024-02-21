import React from 'react';
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));

const routes = [
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/dashboard/Projects/assigned-projects', exact: true, name: 'Assigned Projects', component: React.lazy(() => import('../pages/ongoing-project-details/ongoingProjectDetails')) },
    { path: '/dashboard/Projects/assigned-projects/details/:work_package_number', exact: true, name: 'Assigned Project Details', component: React.lazy(() => import('../pages/ongoing-project-details-view/OngoingProjectDetailsView')) },
    { path: '/dashboard/Projects/my-projects', exact: true, name: 'My Projects', component: React.lazy(() => import('../pages/my-projects/myProjects')) },
    { path: '/dashboard/Projects/my-projects/details/:work_package_number', exact: true, name: 'My Project Details', component: React.lazy(() => import('../pages/my-projects-details/myProjectsDetails')) },
     
    {path: '/dashboard/Projects/my-projects/subtask-details/:tdo_id', exact: true, name: 'Subtasks Details', component: React.lazy(()=> import('../pages/my-projects-details/subtasks'))},
    
    { path: '/dashboard/task/details/:work_package_index', exact: true, name: 'My Task Details', component: React.lazy(() => import('../pages/task-details/TaskDetails')) }, //task details
    { path: '/dashboard/Meetings', exact: true, name: 'Meetings', component: React.lazy(() => import('../pages/meetings/Meetings')) },
    { path: '/dashboard/Projects/completed-projects', exact: true, name: 'Completed Projects', component: React.lazy(() => import('../pages/completed-project/completedProject')) },

    { path: '/dashboard/Projects/time-extension', exact: true, name: 'Time Extension', component: React.lazy(() => import('../pages/time-extention/timeExtention')) },
    { path: '/dashboard/Projects/completed-projects/details/:work_package_number', exact: true, name: 'Completed Projects details', component: React.lazy(() => import('../pages/completed-project-details-view/CompletedProjectDetails')) },
    { path: '/dashboard/Projects/create-new-project', exact: true, name: 'Create New Project', component: React.lazy(() => import('../pages/createProject/createProject')) },
  // { path: '/dashboard/employees', exact: true, name: 'Employees', component: React.lazy(() => import('../pages/employees/Employees')) },
    { path: '/dashboard/EVMS/create', exact: true, name: 'EVMS Create', component: React.lazy(() => import('../pages/create-evms/createEVMS')) },
    { path: '/dashboard/EVMS/view', exact: true, name: 'EVMS View', component: React.lazy(() => import('../pages/evms-view/evmsView')) },
    { path: '/dashboard/EVMS/details', exact: true, name: 'EVMS Details', component: React.lazy(() => import('../pages/evms-details/evmsDetails')) },

    { path: '/dashboard/WBS/create-wbs', exact: true, name: 'WBS', component: React.lazy(() => import('../pages/WBS-create/createWBS')) },
    { path: '/dashboard/WBS/not-started', exact: true, name: 'Not Created WBS', component: React.lazy(() => import('../pages/not-started/notStarted')) },
    { path: '/dashboard/WBS/create-wbs-employee', exact: true, name: 'Create WBS', component: React.lazy(() => import('../pages/WBS-create-employee/createEmpWBS')) },
    { path: '/dashboard/WBS/board', exact: true, name: 'Board', component: React.lazy(() => import('../pages/wbs-board/Board')) },
    { path: '/dashboard/holidays', exact: true, name: 'Holidays', component: React.lazy(() => import('../pages/holidays/holidaylist')) },
    { path: '/dashboard/timecard/generate-timecard', exact: true, name: 'Generate Timecard', component: React.lazy(() => import('../pages/timecards/timeCard')) },
    { path: '/dashboard/timecard/view-previous-hours', exact: true, name: 'Previous Weeks', component: React.lazy(() => import('../pages/timecards/PreviousWeeks')) },
    { path: '/dashboard/timecard/submitted-timecards', exact: true, name: 'Submitted Timecards', component: React.lazy(() => import('../pages/timecards/SubmittedTimecards')) },
    { path: '/dashboard/timecard/weekly-timecards', exact: true, name: 'Weekly Timecard', component: React.lazy(() => import('../pages/weekly-timecards/WeeklyTimecards')) },
    { path: '/dashboard/profile/:id?', exact: true, name: 'Profile', component: React.lazy(() => import('../pages/profile/profileView')) },
    { path: '/dashboard/shared-documents', exact: true, name: 'Shared Documents', component: React.lazy(() => import('../pages/shared-docs/sharedDocs')) },
    { path: '/dashboard/release-notes', exact: true, name: 'Release Notes', component: React.lazy(() => import('../pages/release-notes/releaseNotes')) }

]

export default routes