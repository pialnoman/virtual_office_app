import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
// routes config
import routes from "../routes/DashboardRoutes";
import { changeState } from "../store/slices/SideBarSlice";
import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";
import "./TheHeader.css";
import MatSearch from "../components/search/MatSearch";
import MenuIcon from "@mui/icons-material/Menu";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  let history = useHistory();
  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch(changeState(val));
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch(changeState(val));
  };
  React.useEffect(() => {
    console.log("sidebar --- ", sidebarShow);
  }, []);
  return (
    <CHeader
      withSubheader
      className="justify-content-between"
      colorScheme="light"
    >
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />

      {/* <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CHeaderBrand> */}

      <CHeaderNav className="d-md-down-none">
        {/* <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/users">Users</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink>Settings</CHeaderNavLink>
        </CHeaderNavItem> */}

        <CHeaderNavItem className="px-3 justify-content-between">
          <MatSearch />
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown />
      </CHeaderNav>
      <CSubheader className="px-3 justify-content-between">
        <CButton
          className="back-button"
          onClick={() => {
            if (history.length>0){
            history.goBack();}
             else {
              history.push({ pathname: "/dashboard"})
             }       
           
          }}
        >
          <CIcon name="cil-arrow-thick-from-right" className="mr-2" />
          Back
        </CButton>
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3 custom-router"
          routes={routes}
        />
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
