import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CLabel,
  CInput,
  CButton,
  CDataTable,
} from "@coreui/react";

import React, { useState, useEffect } from "react";
import "./timeCards.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, USER_ID } from "../../Config";
import { API } from "../../Config";
import { has_permission } from "../../helper";
import { useFormik } from "formik";
import jsPDF from "jspdf";
import "jspdf-autotable";

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import sortBy from "lodash/sortBy";
import CIcon from "@coreui/icons-react";
import moment from "moment";
import ReactDOM from "react-dom"; // you used 'react-dom' as 'ReactDOM'
import swal from "sweetalert";
import { useHistory, useLocation } from "react-router-dom";

import { exportxl } from "../../helper";
import { exportPdf } from "../../helper";

const PreviousWeeks = () => {
  const profile_details = useSelector((state) => state.profile.data);
  const history = useHistory();
  const location = useLocation();
  const [usersData, setUsersData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  
  const [selectedAssignee, setSelectedAssignee] = useState();
  const [pdfTitle, setPdfTitle] = useState();
  const [assigneeList, setAssigneeList] = useState([]);
  const [startDate, setStartDate] = useState(""); // timecard list show start date
  const [endDate, setEndDate] = useState(""); // timecard list show end date
  const [totalHrs, setTotalHrs] = useState(0);
  const [lastweekStart, setlastWeekStart]= useState()
  const [lastweekEnd, setlastWeekEnd] = useState()

  const validateEditForm = (values) => {
    const errors = {};
    if (!values.startDate) errors.startDate = "Start Date selection is required";
    if (!values.todate) errors.todate = "To date selection is required";
    return errors;
  };
  const editForm = useFormik({
    initialValues: {
      assigneeSelect: sessionStorage.getItem(USER_ID),
      startDate: "",
      todate: "",
    },
    validateOnBlur: true,
    validateOnChange: true,
    validate: validateEditForm,
    onSubmit: ()=>{},
  });

  const get_assignee_wise_timecards=(values)=>{
    API.get("wbs/user/time-card/list/" + values.assigneeSelect + "/").then(res=>{
      console.log("user tc list", res.data.data);
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        temp.push({ data: item });
      });
       console.log("temp", temp)
      let filteredData = [];
      filteredData = temp.filter((p) => p.data.date_updated >= values.startDate && p.data.date_updated <= values.todate);
     
      setPdfData(filteredData);
      setPdfTitle(temp[0].data.time_card_assignee.first_name)
      console.log("filtered ", temp[0].data.time_card_assignee.first_name)
      let temp_hrs=0
      var tableData = [];
      for (let index = 0; index < filteredData.length; index++) {
        const element = filteredData[index];
        temp_hrs += parseFloat(element.data.hours_today);
        //console.log("hours", temp_hrs);
        tableData.push({
          WP: element.data.project?.work_package_number
            ? element.data.project.work_package_number
            : "-",
          "Project Name": element.data.project?.sub_task
            ? element.data.project.sub_task
            : "-",
          "Task Title": element.data.project.task_title
            ? element.data.project.task_title
            : "-",
          Description: element.data.actual_work_done
            ? element.data.actual_work_done
            : "-",
          "Hour(s)": element.data.hours_today,
          Type: element.data.time_type,
          "Work Date": element.data.date_updated,
          data: element.data,
        });
      }
      console.log("hours", temp_hrs);
      setTotalHrs(temp_hrs);
      setUsersData(tableData);
    }).catch( err=>{

    })
  }
  const get_and_set_all_assignees=async()=>{
    let temp = [];
    API.get("project/assignees/all/" + sessionStorage.getItem(USER_ID) + "/").then((res) => {
      if (res.data.data.length > 0) {
        Array.from(res.data.data).forEach((item, idx) => {
          temp.push({
            data: item,
            value: item.id,
            label: capitalize(item.first_name) + " " + capitalize(item.last_name),
          });
        });
      }
      temp=sortBy(temp, 'label')
      setSelectedAssignee(temp[0]);
      setAssigneeList(temp);
      return temp
    }).catch(err=>{
      console.log('assignee list api error',err)
    });
  }
  const previous_Week = () => {
    var sdate = new Date();
    var edate = new Date();
    for (let i = 0; i < 7; i++) {
      if (edate.getDay() === 6) {
        console.log("end date ", moment(edate).format("YYYY-MM-DD"));
        break;
      } else {
        edate = moment(edate).subtract(1, "day").toDate();
      }
    }
    sdate = moment(edate).subtract(6, "day").toDate();
    console.log("start date", moment(sdate).format("YYYY-MM-DD"));
    setStartDate(moment(sdate).format("YYYY-MM-DD"))
    setEndDate(moment(edate).format("YYYY-MM-DD"))
    
    setlastWeekStart(moment(sdate).format("YYYY-MM-DD"))
    setlastWeekEnd(moment(edate).format("YYYY-MM-DD"))
    
    return {
      start: moment(sdate).format("YYYY-MM-DD"),
      end:  moment(edate).format("YYYY-MM-DD")
    }

  };
  React.useEffect(async()=>{
    const { start, end } = previous_Week(); //setting start , end , lastweekstart & lastweekend dates
    get_and_set_all_assignees()
  },[])
  React.useEffect(()=>{   
    if(assigneeList.length>0){
      get_assignee_wise_timecards({assigneeSelect:assigneeList[0].value,startDate:startDate,todate:endDate})
    }
    else{
      get_assignee_wise_timecards({assigneeSelect:sessionStorage.getItem(USER_ID),startDate:startDate,todate:endDate})
    }
  }, [assigneeList])
  React.useEffect(()=>{   
    get_assignee_wise_timecards(editForm.values)
  }, [editForm.values])

  function capitalize(string) {
    if (string != undefined) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return "";
  }
 const handleAssigneeChange = (option) => {
    setSelectedAssignee(option);
   
    editForm.setValues({
      assigneeSelect: option.value,
      startDate: editForm.values.startDate,
      todate: editForm.values.todate,
    });
    
    setPdfTitle(option.label);
  };

  const colourStyles = {
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };

  React.useEffect(()=>{
   
   console.log("edit", editForm.values)
  }, [editForm.values])
  
  React.useEffect(()=>{
    if(lastweekStart!=undefined && lastweekStart){
      editForm.setFieldValue('startDate',lastweekStart)
    }
  },[lastweekStart])

  React.useEffect(()=>{
    if(lastweekEnd!=undefined && lastweekEnd){
      console.log('todate',lastweekEnd)
      editForm.setFieldValue('todate',lastweekEnd)
    }
  },[lastweekEnd])

  const onToDateChange = (event) => {
    editForm.handleChange(event);
    setEndDate(event.target.value)
  };
  const handleFromDateChange = (event) => {
    editForm.handleChange(event)
    setStartDate(event.target.value)
  }
  return (
    <>
      <CContainer>
        <CRow className="justify-content-between">
          <CCol>
            <h3 className="timecards-page-header mb-3">Actual Hours</h3>
          </CCol>
          <CCol md="8" id="tableRef" className="d-flex justify-content-end">
            <h5 className="tiny-header--5 mt-3 mr-2">Export </h5>
            <div className="format-buttons mt-3 mb-3 ">
              <CButton
                className="file-format-download"
                onClick={() =>
                  exportPdf(pdfData, pdfTitle, endDate, totalHrs, startDate)
                }
              >
                <CIcon name="cil-description" className="mr-2" /> PDF
              </CButton>
              <CButton
                className="file-format-download"
                onClick={
                  () =>
                    exportxl(pdfData, pdfTitle, endDate, totalHrs, startDate)
                }
              >
                <CIcon name="cil-spreadsheet" className="mr-2" />
                Excel
              </CButton>
             
            </div> 
          </CCol>
        </CRow>
        <CForm>
          <CRow>
              <CCol xl="3" lg="3" md="6">
              {has_permission("projects.add_projects") && (
                <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Select Employee
                </CLabel>
              )}
               {!has_permission("projects.add_projects") && (
                <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Select Employee
                </CLabel>
              )}
                {has_permission("projects.add_projects") && (
                <Select 
                  closeMenuOnSelect={true}
                  aria-labelledby="assigneeSelect"
                  id="assigneeSelect"
                  minHeight="35px"
                  placeholder={
                    capitalize(profile_details.first_name) +
                    " " +
                    capitalize(profile_details.last_name)
                  }
                  isClearable={false}
                  isMulti={false}
                  value={selectedAssignee}
                  onChange={handleAssigneeChange}
                  classNamePrefix="custom-forminput-6"
                  options={assigneeList}
                  styles={colourStyles}
                />
               )} 
                {!has_permission("projects.add_projects") && (
                <Select 
                  closeMenuOnSelect={true}
                  aria-labelledby="assigneeSelect"
                  id="assigneeSelect"
                  minHeight="35px"
                  placeholder={
                    capitalize(profile_details.first_name) +
                    " " +
                    capitalize(profile_details.last_name)
                  }
                  isClearable={false}
                  isMulti={false}
                  value={selectedAssignee}
                  onChange={handleAssigneeChange}
                  classNamePrefix="custom-forminput-6"
                  options={assigneeList}
                  styles={colourStyles}
                  isDisabled={true}
                />)}
                {/* {editForm.errors.assigneeSelectPM && <p className="error mt-1">{editForm.errors.assigneeSelectPM}</p>} */}
              </CCol>
            {/* )} */}

            {/***********for archive***********/}
            {/**start date */}
            <CCol xl="3" lg="3" md="6">
              <CLabel className="custom-label-5" htmlFor="startDate">
                From Date
              </CLabel>
              <CInput
                className="custom-forminput-6  w-100"
                type="date"
                name="startDate"
                id="startDate"
                //value ={lastweekStart} 
                value={editForm.values.startDate}
                //onChange={editForm.handleChange}
                onChange={handleFromDateChange}

              />

              {editForm.errors.startDate && editForm.touched.startDate && (<p className="error mt-0 mb-0"><small>{editForm.errors.startDate}</small></p>)}
            </CCol>
            {/**END DATE */}
            <CCol xl="3" lg="3" md="6">
              <CLabel className="custom-label-5" htmlFor="todate">
                To Date
              </CLabel>
              <CInput
                className="custom-forminput-6  w-100"
                type="date"
                name="todate"
                id="todate"
                //value ={lastweekEnd}
                value={editForm.values.todate}
                onChange={onToDateChange}
              />
              {/**Error show */}
              {editForm.errors.todate && editForm.touched.startDate && (
                <p className="error mt-0 mb-0">
                  <small>{editForm.errors.todate}</small>
                </p>
              )}
            </CCol>

            {/* <CCol xl="3" lg="3" md="6">
              <div className="button-holder--3">
                <CButton
                  className="generate-card-button"
                  onClick={editForm.handleSubmit}
                >
                  Show
                </CButton>
              </div>
            </CCol> */}
            {/**buttons for format of timecard */}
            <CRow className="mt-4">
              <CCol>
                {/* <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Company :{" "}
                  {profile_details.slc_details?.slc?.department?.company?.name}
                </CLabel> */}
              </CCol>
            </CRow>
            {/* <CRow>
              <CCol md="4">
                <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Employee Name :{" "}
                  {capitalize(selectedAssignee?.data?.first_name) +
                    " " +
                    capitalize(selectedAssignee?.data?.last_name)}
                </CLabel>
              </CCol>
            </CRow> */}

            {/* {usersData.length > 0 && (
                <div className="alert alert-info" role="alert">
                  Showing actual hours from {moment(startDate).format("DD-MM-YYYY")} to{" "}
                  {moment(endDate).format("DD-MM-YYYY")}
                </div>
              )} */}

            {/**table for displaying all the entries */}
            <CRow className="mt-4 mb-4">
              <div className="">
                <CDataTable
                  items={usersData}
                  fields={[
                    {
                      key: "WP",
                      _style: { width: "5%" },
                      _classes: "font-weight-bold",
                    },
                    "Project Name",
                    "Task Title",
                    "Description",
                    "Hour(s)",
                    "Type",
                    "Work Date",
                  ]}
                  primary
                  hover
                  // tableFilter
                  striped
                  bordered
                  sorter
                  //columnFilter
                  size="sm"
                  itemsPerPage={10}
                  pagination
                  scopedSlots={
                    {
                      // Action: (item) => (
                      //   <td>
                      //     {item.data.submitted == false ? (
                      //       <CBadge>
                      //         <CButton
                      //           onClick={() => {
                      //             showModal(item);
                      //           }}
                      //           size="sm"
                      //           type="button"
                      //           color="primary"
                      //         >
                      //           Edit
                      //         </CButton>
                      //       </CBadge>
                      //     ) : (
                      //       "N/A"
                      //     )}
                      //   </td>
                      // ),
                    }
                  }
                />
              </div>

              {totalHrs != 0 && (
                <div class="alert alert-info" role="alert">
                  <CRow>
                    <CCol md="5"></CCol>
                    <CCol md="3">
                      {
                        <small>
                          {"     "}
                          From <b>
                            {moment(startDate).format("DD-MMM-YY")}
                          </b> to <b>{moment(endDate).format("DD-MMM-YY")}</b>
                        </small>
                      }
                    </CCol>
                    <CCol md="4">
                      {
                        <small>
                          {"   "}
                          Total <b>{totalHrs.toFixed(2)} hrs&nbsp;</b>
                        </small>
                      }
                    </CCol>
                  </CRow>
                </div>
              )}
            </CRow>
          </CRow>
        </CForm>
      </CContainer>
    </>
  );
};
export default PreviousWeeks;
