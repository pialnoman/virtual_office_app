import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './TheSidebar.css'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
} from '@coreui/react'
import { changeState } from '../store/slices/SideBarSlice';
import CIcon from '@coreui/icons-react'
import { has_permission } from '../helper';
// sidebar nav config
import { useHistory } from 'react-router';
import { API, USER_ID } from '../Config';
import {useLocation} from "react-router-dom";

const TheSidebar = () => {
  const dispatch = useDispatch()
  let history = useHistory()
  const show = useSelector(state => state.sidebar.sidebarShow)

  const location = useLocation()
  React.useEffect(() => {

    const path = location.pathname
    console.log(path);
     if (path.match("/dashboard/Projects/"))
     {
       console.log(path);
     }
     if (path.match("/dashboard/WBS/"))
     {
       console.log(path);
     }
     if (path.match("/dashboard/EVMS/"))
     {
       console.log(path);
     }

  }, [location])


  const logout = () => {
    API.get('auth/logout/').then((res) => {
      sessionStorage.clear()
      history.push('/')
    }).catch(err => {
      sessionStorage.clear()
      history.push('/')
    })

  }
  return (
    <CSidebar colorScheme="light"
      show={show}
      onShowChange={(val) => dispatch(changeState(val))}
    >
      <CSidebarBrand className="d-md-down-none custom-color" to="/">
        <CImg
          className="c-sidebar-brand-full"
          src={'assets/icons/VirtualOffice.svg'}
          height={115}
          width={250}
        />
        {/* <h6 className="c-sidebar-brand-full name-brand1">Virtual Office</h6> */}

        {/* <CImg
          className="c-sidebar-brand-minimized"
          src={'assets/icons/DMA-logo-small.svg'}
          height={35}
        /> */}
        <span className="c-sidebar-brand-minimized name-brand1">VO</span>
      </CSidebarBrand>
      <CSidebarNav className="vo-sidebar">

        {/* <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        /> */}
        <CSidebarNavItem to="/dashboard" icon="cil-list" name="Dashboard" className="vo-navItem "/>
          {/* <CIcon
            className = "dashboard-icon">
           </CIcon>
      

         {/*  <i className='dashboard-icon'>  </i>*/}

         
        {/**Projects */}
        <CSidebarNavDropdown icon="cil-lightbulb" name="Projects" className="vo-navItem" route='/dashboard/Projects/'>  
          {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/Projects/create-new-project" name="Create New Project" className="vo-navItem" ></CSidebarNavItem>}
          {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/Projects/my-projects" name="My Projects" className="vo-navItem"></CSidebarNavItem>}
          <CSidebarNavItem to="/dashboard/Projects/assigned-projects" name="Assigned Projects" className="vo-navItem"  ></CSidebarNavItem>
          {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/Projects/time-extension" name="Time Extension" className="vo-navItem"></CSidebarNavItem>}
          <CSidebarNavItem to="/dashboard/Projects/completed-projects" name="Completed Projects" className="vo-navItem" ></CSidebarNavItem>
        </CSidebarNavDropdown>
        {/**WBS */}
        <CSidebarNavDropdown icon="cil-spreadsheet"  name="WBS" className="vo-navItem">
          {/* <CSidebarNavItem to="/dashboard/WBS/create-wbs" name="Create WBS" className="vo-navItem"></CSidebarNavItem> */}
          {/* {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/WBS/create-wbs" name="Create WBS (PM)" className="vo-navItem"></CSidebarNavItem>} */}
          <CSidebarNavItem to="/dashboard/WBS/create-wbs-employee" name="Create WBS" className="vo-navItem" ></CSidebarNavItem>
          {has_permission('projects.add_projects') &&<CSidebarNavItem to="/dashboard/WBS/not-started" name="Create WBS (PM)" className="vo-navItem" ></CSidebarNavItem>}
          <CSidebarNavItem to="/dashboard/WBS/board" name="Board" className="vo-navItem" ></CSidebarNavItem>

        </CSidebarNavDropdown>
        {/**EVMS */}
        {/* <CSidebarNavItem to="/dashboard/EVMS"name="EVMS" icon="cil-chart-line" className="vo-navItem"></CSidebarNavItem> */}
        {has_permission('evms.view_evms') && <CSidebarNavDropdown icon="cil-chart-line"  name="EVMS" className="vo-navItem">
          <CSidebarNavItem to="/dashboard/EVMS/create" name="Create EVMS" className="vo-navItem"></CSidebarNavItem>
          <CSidebarNavItem to="/dashboard/EVMS/view" name="View EVMS" className="vo-navItem"></CSidebarNavItem>
        </CSidebarNavDropdown>}

        {/*<CSidebarNavItem to="/dashboard/employees" name="Employees" icon="cil-people" className="vo-navItem"></CSidebarNavItem> */}
        
        {/**Timecards */}
        
        {!has_permission('projects.add_projects') && <CSidebarNavDropdown icon="cil-library" name="Timecards" className="vo-navItem">
          <CSidebarNavItem to="/dashboard/timecard/generate-timecard" name="This Week" className="vo-navItem"></CSidebarNavItem>
          <CSidebarNavItem to="/dashboard/timecard/view-previous-hours" name="Previous Weeks" className="vo-navItem"></CSidebarNavItem>
          <CSidebarNavItem to="/dashboard/timecard/submitted-timecards" name="Submitted Timecards" className="vo-navItem"></CSidebarNavItem>
        </CSidebarNavDropdown>}
        {/**timecards if PM */}
        {has_permission('projects.add_projects') && <CSidebarNavDropdown icon="cil-library" name="Timecards" className="vo-navItem">
          <CSidebarNavItem to="/dashboard/timecard/generate-timecard" name="This Week" className="vo-navItem"></CSidebarNavItem>
          <CSidebarNavItem to="/dashboard/timecard/view-previous-hours" name="Previous Weeks" className="vo-navItem"></CSidebarNavItem>
          <CSidebarNavItem to="/dashboard/timecard/submitted-timecards" name="Submitted Timecards" className="vo-navItem"></CSidebarNavItem>
          {/* {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/timecard/weekly-timecards" name="Weekly Timecard" className="vo-navItem"></CSidebarNavItem>} */}
          {/* {has_permission('projects.add_projects') && <CSidebarNavItem to="/dashboard/timecard/weekly-timecards" name="Report" className="vo-navItem"></CSidebarNavItem>} */}
        </CSidebarNavDropdown>}
        
        
        {/**Meetings */}
        <CSidebarNavItem to="/dashboard/meetings" icon="cil-group" name="Meetings" className="vo-navItem"></CSidebarNavItem>
        {/**Shared Docs */}
        <CSidebarNavItem to="/dashboard/shared-documents" name="Shared Documents" icon="cil-folder-open" className="vo-navItem"></CSidebarNavItem>
        
        <CSidebarNavItem to="/dashboard/holidays" icon="cil-calendar" name="Holidays" className="vo-navItem"></CSidebarNavItem>
        <hr />
        {/**Profile */}
        <CSidebarNavItem to={"/dashboard/profile/"+sessionStorage.getItem(USER_ID)} name="Profile" icon="cil-user" className="vo-navItem"></CSidebarNavItem>


        {/**log out */}
        <CSidebarNavItem onClick={logout} name="Logout" icon="cil-account-logout" className="vo-navItem"></CSidebarNavItem>

      </CSidebarNav>
      {/* <span className="copyright-text">&copy; DMA V1.0.0</span> */}
      <CSidebarMinimizer />

    </CSidebar>
  )
}

export default React.memo(TheSidebar)
