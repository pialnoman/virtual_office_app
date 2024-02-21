import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CLabel,
  CButton,
  CDataTable,
  CBadge,
} from "@coreui/react";
import orderBy from "lodash/orderBy";
import React, { useState, useEffect } from "react";
import "./timeCards.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { FILE_API, USER_ID } from "../../Config";
import { API } from "../../Config";
import { has_permission } from "../../helper";
import { useFormik } from "formik";
import jsPDF from "jspdf";
import "jspdf-autotable";

import CIcon from "@coreui/icons-react";
import moment from "moment";
import swal from "sweetalert";
import AddTimecardItms from "./addTimecardItem";
import EditTimeCard from "./Edit";

import { useLocation } from "react-router-dom";

const TimeCards = () => {
  const profile_details = useSelector((state) => state.profile.data);
  const [selectedAssignee, setSelectedAssignee] = useState();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [pdfTitle, setPdfTitle] = useState();
  let location = useLocation();
  const [assigneeList, setAssigneeList] = useState([]);
  const [non_submitted_total_tc, setNonSubmittedTotalTC] = useState(0);
  // const [selectedEmployee, setSelectedEmployee] = useState(initialState)
  {
    /**fetch all assignees for PM */
  }
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalHrs, setTotalHrs] = useState(0);
  const [modalData, setModalData] = useState("");
  const [row, setRow] = useState();

  const getTimeCards = (values) => {
    console.log("working");
    setStartDate(values.startDate);
    setEndDate(values.todate);
    var temp_hrs = 0;
    // const section = document.querySelector("#tableRef");
    // section.scrollIntoView({ behavior: "smooth", block: "start" });
    if (
      has_permission("projects.add_projects") &&
      has_permission("wbs.change_timecard") &&
      has_permission("wbs.add_timecard")
    ) {
      // console.log('values from timecards', values)
      API.get("wbs/user/time-card/list/" + values.assigneeSelectPM + "/").then(
        (res) => {
          console.log(res.data.data);
          let temp = [];
          Array.from(res.data.data).forEach((item, idx) => {
            temp.push({ data: item });
          });

          let filteredData = [];
          filteredData = temp.filter(
            (p) =>
              p.data.date_updated >= values.startDate &&
              p.data.date_updated <= values.todate
          );
          // console.log('timecard for id', filteredData)
          setPdfData(filteredData);
          var tableData = [];
          for (let index = 0; index < filteredData.length; index++) {
            const element = filteredData[index];
            temp_hrs += parseFloat(element.data.hours_today);
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
          setTotalHrs(temp_hrs);
          setUsersData(tableData);
        }
      );
    } else {
      // console.log('values from timecards', values)
      API.get("wbs/user/time-card/list/" + values.assigneeSelect + "/").then(
        (res) => {
          let temp = [];
          setPdfTitle(
            profile_details.first_name + " " + profile_details.last_name
          );
          Array.from(res.data.data).forEach((item, idx) => {
            // temp.push({data:item.date_updated >=values.startDate && item.date_updated <= values.todate})
            temp.push({ data: item });
          });

          let filteredData = [];
          filteredData = temp.filter(
            (p) =>
              p.data.date_updated >= values.startDate &&
              p.data.date_updated <= values.todate
          );
          console.log("timecard for id", filteredData);

          setPdfData(filteredData);
          setModalData(filteredData);

          var tableData = [];
          for (let index = 0; index < filteredData.length; index++) {
            const element = filteredData[index];
            temp_hrs += parseFloat(element.data.hours_today);
            tableData.push({
              WP: element.data.project
                ? element.data.project.work_package_number
                : "-",
              "Project Name":
                element.data.project != null
                  ? element.data.project?.sub_task
                  : "-",
              "Task Title":
                element.data.project != null
                  ? element.data.project.task_title
                  : "-",
              Description: element.data.actual_work_done
                ? element.data.actual_work_done
                : "",
              "Hour(s)": element.data.hours_today,
              Type: element.data.time_type,
              "Work Date": element.data.date_updated,
              data: element.data,
            });
            //console.log("table", tableData);
          }
          console.log("table", tableData);
          setUsersData(tableData);
          setTotalHrs(temp_hrs);
        }
      );
    }
  };
  const get_assignee_tc = (assignee) => {
    console.log("get_tc", assignee);

    const { start, end } = dateRange();
    setPdfTitle(assignee.first_name + " " + assignee.last_name);
    API.get("wbs/user/time-card/list/" + assignee.id + "/").then((res) => {
      console.log("assignee tc", res.data);
      // setPdfTitle(
      //   profile_details.first_name + " " + profile_details.last_name
      // );
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        console.log("res", res.data.data)
        temp.push({ data: item });
      });
      let filteredData = temp;
      filteredData = temp.filter(
        (p) => p.data.date_updated >= start && p.data.date_updated <= end
      );
      console.log("filtered", filteredData);
      setPdfData(filteredData);
      var tableData = [];
      let hours_total = 0;
      let total_not_submitted = 0;
      for (let index = 0; index < filteredData.length; index++) {
        if (filteredData[index].data.submitted == false) {
          total_not_submitted++;
        }
        const element = filteredData[index];
        
        hours_total += parseFloat(element.data.hours_today);
        console.log("ele", element.data)
        tableData.push({
          WP: element.data.project
            ? element.data.project.work_package_number
            : "-",
          "Project Name":
            element.data.project != null ? element.data.project?.sub_task : "-",
          "Task Title":
            element.data.project != null
              ? element.data.project?.task_title
              : "-",
          Description: element.data?.actual_work_done
            ? element.data?.actual_work_done
            : "-",
          "Hour(s)": element.data.hours_today,
          Type: element.data.time_type,
          "Work Date": element.data.date_updated,
          data: element.data,
          id: element.data.id,
        });
      }
      setTotalHrs(hours_total);
      setUsersData(orderBy(tableData, "id", "desc"));
      setNonSubmittedTotalTC(total_not_submitted);
      console.log("selected", selectedAssignee);
    });
  };
  function capitalize(string) {
    if (string != undefined) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return "";
  }

  const [modaladdItem, setmodalAddItem] = useState(false);
  const [show_edit_modal, setShowEditModal] = useState(false);
  const handleAssigneeChange = (option) => {
    setSelectedAssignee(option);
    setPdfTitle(option.label);
    get_assignee_tc(option.data);
  };

  React.useEffect(() => {
    console.log("executing effect");
    window.scrollTo(0, 0);
    const { start, end } = dateRange();

    // setSelectedAssignee({label:profile_details.first_name+' '+profile_details.last_name,value:profile_details.id,data:profile_details})
    setTotalHrs(0);
    if (
      has_permission("projects.change_projectassignee") ||
      has_permission("projects.add_projectassignee")
    ) {
      API.get(
        "project/assignees/all/" + sessionStorage.getItem(USER_ID) + "/"
      ).then((res) => {
        let temp = [];
        Array.from(res.data.data).forEach((item, idx) => {
          temp.push({
            data: item,
            value: item.id,
            label:
              capitalize(item.first_name) + " " + capitalize(item.last_name),
          });
        });
        if (!temp.find((item) => item.value == res.data.user.id)) {
          temp.unshift({
            data: res.data.user,
            value: res.data.user.id,
            label:
              capitalize(res.data.user.first_name) +
              " " +
              capitalize(res.data.user.last_name),
          });
        }
        setAssigneeList(orderBy(temp, "label"));
        if (selectedAssignee == null || selectedAssignee == undefined) {
          if (location.state?.assignee && temp.length > 0) {
            let assignee_id = location.state.assignee;
            setSelectedAssignee(temp.find((item) => item.value == assignee_id));
            get_assignee_tc(
              temp.find((item) => item.value == assignee_id).data
            );
          } else {
            setSelectedAssignee({
              data: res.data.user,
              value: res.data.user.id,
              label:
                capitalize(res.data.user.first_name) +
                " " +
                capitalize(res.data.user.last_name),
            });
            get_assignee_tc(res.data.user);
          }
          setPdfTitle(
            capitalize(res.data.user.first_name) +
              " " +
              capitalize(res.data.user.last_name)
          );
        }
      });
    } else {
      if (selectedAssignee == null || selectedAssignee == undefined) {
        setSelectedAssignee({
          data: profile_details,
          value: profile_details.id,
          label:
            capitalize(profile_details.first_name) +
            " " +
            capitalize(profile_details.last_name),
        });
        setPdfTitle(
          capitalize(profile_details.first_name) +
            " " +
            capitalize(profile_details.last_name)
        );
        get_assignee_tc(profile_details);
      }
    }
  }, [update]);
  useEffect(() => {
    if (location.state?.assignee && assigneeList.length > 0) {
      let assignee_id = location.state.assignee;
      console.log("predefined id", assignee_id);
      console.log(
        "found user",
        assigneeList.find((item) => item.value == assignee_id)
      );
      // setSelectedAssignee(assigneeList.find(item=>item.value==assignee_id))
      setSelectedAssignee(
        assigneeList.find((item) => item.value == assignee_id)
      );
      setPdfTitle(assigneeList.find((item) => item.value == assignee_id).label);
      get_assignee_tc(
        assigneeList.find((item) => item.value == assignee_id).data
      );
      console.log(
        assigneeList.find((item) => item.value == assignee_id).data,
        "from useeffect"
      );
    }
  }, [assigneeList]);
  const validateEditForm = (values) => {
    const errors = {};

    if (!values.startDate)
      errors.startDate = "Start Date selection is required";
    if (!values.todate) errors.todate = "To date selection is required";
    return errors;
  };

  const editForm = useFormik({
    initialValues: {
      assigneeSelect: sessionStorage.getItem(USER_ID),
      assigneeSelectPM: sessionStorage.getItem(USER_ID),
      startDate: "",
      todate: "",
    },
    validateOnBlur: true,
    validateOnChange: true,
    validate: validateEditForm,
    onSubmit: getTimeCards,
  });

  const colourStyles = {
    // control: (styles, state) => ({ ...styles,height:"35px", fontSize: '14px !important', lineHeight: '1.42857', borderRadius: "8px",borderRadius:".25rem",color:"rgb(133,133,133)",border:state.isFocused ? '2px solid #0065ff' :'inherit'}),
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };
  {
    /**export fetched tabledata to excel */
  }
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title =
      "Timecard of" +
      " " +
      selectedAssignee.data.first_name +
      " " +
      selectedAssignee.data.last_name;
    const headers = [
      [
        "WP",
        "Project Name",
        "Task Title",
        "Description",
        "Hour(s)",
        "Type",
        "Work Date",
      ],
    ];
    const uData = pdfData.map((elt, idx) => [
      elt.data.project.work_package_number,
      elt.data.project.sub_task,
      elt.data.project.task_title,
      elt.data.actual_work_done,
      elt.data.hours_today,
      elt.data.time_type,
      elt.data.date_updated,
    ]);
    let content = {
      startY: 145,
      head: headers,
      body: uData,
    };

    let day = new Date();
    let time = day.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    day = moment(day).format("DD/MM/YY");
    const edate = moment(endDate).format("DD/MM/YYYY");
    doc.setFontSize(17);
    doc.text(170, 50, "Datasoft Manufacturing & Assembly");
    doc.setFontSize(13);
    doc.text(245, 75, "Gulshan Branch");
    doc.setFontSize(11);
    doc.text(42, 105, "Employee Time Card");
    doc.text(410, 105, "Week-Ending: " + edate); //+ edate)
    doc.text(
      42,
      125,
      "Name: " +
        selectedAssignee.data.first_name +
        " " +
        selectedAssignee.data.last_name
    ); //+ name)

    let date = new Date();
    doc.autoTable(content);
    doc.text(
      42,
      doc.lastAutoTable.finalY + 25,
      "From " + startDate + " to " + endDate
    );
    doc.text(
      250,
      doc.lastAutoTable.finalY + 25,
      " Total Hours " + Number(totalHrs).toFixed(2)
    );
    doc.text(
      396,
      doc.lastAutoTable.finalY + 25,
      "Submitted on : " + time + "  " + day
    );
    return doc;
  };

  const showModal = (tableItem) => {
    setRow(tableItem.data);
    setShowEditModal(true);
  };

  const onAddItem = () => {
    setmodalAddItem(false);
    get_assignee_tc(selectedAssignee.data);
  };

  const onSubmit = () => {
    swal({
      title: "Are you sure?",
      text: "Once submitted, you will not be able to revert!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let temp = "";
        for (let i = 0; i < usersData.length; i++) {
          //console.log("data", usersData[i]);
          // temp.push(usersData[i].data.id)
          if (i == usersData.length - 1) {
            temp += usersData[i].data.id;
          } else {
            temp += usersData[i].data.id + ",";
          }
        }

        let doc = exportPDF();
        let formData = new FormData();
        formData.append("employee", selectedAssignee.value);
        formData.append("time_cards", temp);
        formData.append("week_start", startDate);
        formData.append("week_end", endDate);
        formData.append("pdf_file", doc.output("datauristring"));

        FILE_API.post("wbs/time-card/submit/", formData).then((res) => {
          console.log(res.data);
          let day = new Date();
          const weekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          let days = weekday[day.getDay()];
          let todayDate = moment(day).format("DD-MM-YYYY");

          // dispatch(fetchAllTimecardsPmThunk(selectedAssignee.value))
          get_assignee_tc(selectedAssignee.data);
          doc.save(
            selectedAssignee.data.first_name +
              "_" +
              selectedAssignee.data.last_name +
              "_" +
              days +
              "_" +
              todayDate +
              ".pdf"
          );
          window.open(doc.output("bloburl"), "_blank");
          swal(
            "Submitted",
            "Your selected time cards are submitted!",
            "success"
          );
        });
      }
    });
  };

  const dateRange = () => {
    var sdate = new Date();
    var edate = new Date();

    for (let i = 0; i < 7; i++) {
      if (sdate.getDay() === 0) {
        console.log("start", sdate);
        break;
      } else {
        sdate = moment(sdate).subtract(1, "day").toDate();
      }
    }
    console.log("end date", edate);

    setStartDate(moment(sdate).format("YYYY-MM-DD"));
    setEndDate(nextSatDay());
    // editForm.setValues({
    //   assigneeSelect: sessionStorage.getItem(USER_ID),
    //   assigneeSelectPM: sessionStorage.getItem(USER_ID),
    //   startDate: moment(sdate).format('YYYY-MM-DD'),
    //   todate:  moment(edate).format('YYYY-MM-DD'),
    // })
    return {
      start: moment(sdate).format("YYYY-MM-DD"),
      // end: moment(edate).format("YYYY-MM-DD"),
      end: nextSatDay(),
    };
  };
  const nextSatDay = () => {
    var satday = new Date();
    for (let i = 0; i < 7; i++) {
      if (satday.getDay() === 6) {
        console.log("sat", satday);
        break;
      } else {
        satday = moment(satday).add(1, "day").toDate();
      }
    }
    satday = moment(satday).format("YYYY-MM-DD");
    console.log("satday", satday)
    return satday;
  };

  const show_add_item_btn = () => {
    if (editForm.values.assigneeSelectPM == sessionStorage.getItem(USER_ID)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {row != null && row != undefined && (
        <EditTimeCard
          data={row}
          show={show_edit_modal}
          onClose={() => {
            setShowEditModal(false);
            get_assignee_tc(selectedAssignee.data);
          }}
        />
      )}
      {selectedAssignee && (
        <AddTimecardItms
          // toggle={toggleModal}
          employee={selectedAssignee.value}
          show={modaladdItem}
          onClose={onAddItem}
          onAdd={editForm.handleSubmit}
        ></AddTimecardItms>
      )}
      <CContainer>
        <CRow className="justify-content-between">
          <CCol>
            <h3 className="timecards-page-header mb-3">
              Actual Hours of this week
            </h3>
          </CCol>
        </CRow>
        <CForm>
          <CRow>
            {/**assignees */}
            <CCol xl="3" lg="3" md="6">
              {has_permission("projects.add_projects") && (
                <div>
                  <CLabel className="custom-label-5" htmlFor="assigneeSelectPM">
                    Select Employee
                  </CLabel>
                  <Select
                    closeMenuOnSelect={true}
                    aria-labelledby="assigneeSelectPM"
                    id="assigneeSelectPM"
                    minHeight="35px"
                    placeholder={
                      capitalize(profile_details.first_name) +
                      " " +
                      capitalize(profile_details.last_name)
                    }
                    isClearable={false}
                    isMulti={false}
                    onChange={handleAssigneeChange}
                    classNamePrefix="custom-forminput-6"
                    options={assigneeList}
                    styles={colourStyles}
                    value={selectedAssignee}
                  />
                </div>
              )}
            </CCol>
            <CRow className="mt-4">
              <CCol>
                {/* <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Company :{" "}
                  {
                    selectedAssignee?.data?.slc_details?.slc?.department
                      ?.company?.name
                  }
                </CLabel> */}
              </CCol>
            </CRow>
            <CRow>
              <CCol md="4">
                <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Employee Name :{" "}
                  {capitalize(selectedAssignee?.data?.first_name) +
                    " " +
                    capitalize(selectedAssignee?.data?.last_name)}
                </CLabel>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                  Weekending :{" "}
                  {moment(nextSatDay()).format("dddd, DD MMMM YYYY")}
                </CLabel>
              </CCol>
            </CRow>
            {show_add_item_btn() == true && (
              <div className="format-buttons mt-3 mb-3">
                <CButton
                  className="file-format-download"
                  type="button"
                  onClick={() => {
                    setmodalAddItem(true);
                  }}
                >
                  {" "}
                  + Add Item
                </CButton>
              </div>
            )}

            {/**table for displaying all the entries */}
            <CCol md="12">
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
                    "Action",
                  ]}
                  primary
                  hover
                  striped
                  bordered
                  sorter
                  //columnFilter
                  size="sm"
                  itemsPerPage={20}
                  pagination
                  scopedSlots={{
                    Action: (item) => (
                      <td>
                        {item.data.submitted == false ? (
                          <CBadge>
                            <CButton
                              onClick={() => {
                                showModal(item);
                              }}
                              size="sm"
                              type="button"
                              color="primary"
                            >
                              Edit
                            </CButton>
                          </CBadge>
                        ) : (
                          <CBadge>
                            <CButton
                              size="sm"
                              type="button"
                              color="secondary"
                              disabled
                            >
                              Edit
                            </CButton>
                          </CBadge>
                        )}
                      </td>
                    ),
                  }}
                />
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
                            </b>{" "}
                            to <b>{moment(endDate).format("DD-MMM-YY")}</b>
                          </small>
                        }
                      </CCol>
                      <CCol md="4">
                        {
                          <small>
                            {"   "}
                            Total{" "}
                            <b>
                              {Number(totalHrs).toFixed(2)}{" "}
                              {Number(totalHrs).toFixed(2) > 1
                                ? "hours"
                                : "hour"}
                              &nbsp;
                            </b>
                          </small>
                        }
                      </CCol>
                    </CRow>
                  </div>
                )}
                <CRow className="justify-content-end mb-5">
                  <CCol md="1" className="justify-content-end">
                    <CButton
                      className="file-format-download"
                      type="button"
                      onClick={onSubmit}
                      style={{ backgroundColor: "#e55353" }}
                      disabled={non_submitted_total_tc == 0}
                    >
                      Submit
                    </CButton>
                    {/* <CButton className="file-format-download">Print</CButton> */}
                  </CCol>
                </CRow>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </>
  );
};
export default TimeCards;
