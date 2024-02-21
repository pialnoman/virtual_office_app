import React from 'react';
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));

const routes = [
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/dashboard/Projects/ongoing-projects', exact: true, name: 'Ongoing Projects', component: React.lazy(() => import('../pages/ongoing-project-details/ongoingProjectDetails')) },
    { path: '/dashboard/Projects/ongoing-projects/details/:work_package_number', exact: true, name: 'Ongoing Project Details', component: React.lazy(() => import('../pages/ongoing-project-details-view/OngoingProjectDetailsView')) },
    { path: '/dashboard/Meetings', exact: true, name: 'Meetings', component: React.lazy(() => import('../pages/meetings/Meetings')) },
    { path: '/dashboard/Projects/completed-projects', exact: true, name: 'Completed Projects', component: React.lazy(() => import('../pages/completed-project/completedProject')) },

    {path:  '/dashboard/Projects/my-projects/details/:tdo_id', exact: true, name: 'My Project Details', component: React.lazy(()=> import('../pages/my-projects-details/subtasks'))},
    
    { path: '/dashboard/Projects/time-extension', exact: true, name: 'Time Extension', component: React.lazy(() => import('../pages/time-extention/timeExtention')) },
    { path: '/dashboard/Projects/completed-projects/details/:work_package_number', exact: true, name: 'Completed Projects details', component: React.lazy(() => import('../pages/completed-project-details-view/CompletedProjectDetails')) },
    { path: '/dashboard/EVMS/view', exact: true, name: 'EVMS View', component: React.lazy(() => import('../pages/evms-view/evmsView')) },

    { path: '/dashboard/WBS/create-wbs', exact: true, name: 'WBS', component: React.lazy(() => import('../pages/WBS-create/createWBS')) },
    { path: '/dashboard/WBS/not-started', exact: true, name: 'Not Created WBS', component: React.lazy(() => import('../pages/not-started/notStarted')) },
    { path: '/dashboard/WBS/board', exact: true, name: 'Board', component: React.lazy(() => import('../pages/wbs-board/Board')) },

    { path: '/dashboard/timecards', exact: true, name: 'Timecards', component: React.lazy(() => import('../pages/timecards/timeCard')) },

    { path: '/dashboard/profile', exact: true, name: 'Profile', component: React.lazy(() => import('../pages/profile/profileView')) },
    { path: '/dashboard/shared-documents', exact: true, name: 'Shared Documents', component: React.lazy(() => import('../pages/shared-docs/sharedDocs')) }
]

export default routes