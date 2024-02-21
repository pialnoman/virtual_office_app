import React, { useEffect, useState } from "react";

import {
  CCardBody,
  CBadge,
  CCol,
  CTextarea,
  CCardFooter,
  CLabel,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabPane,
  CTabContent,
  CRow,
  CTabs,
  CCard,
  CButton,
  CImg,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CInput,
  CAlert,
} from "@coreui/react";
import "../ongoing-project-details-view/OngoingProjectDetailsView.css";
import CIcon from "@coreui/icons-react";
import Select, { defaultTheme } from "react-select";

import { useHistory, useLocation } from "react-router";
import { API, API_URL, BASE_URL, TOKEN, USER_ID } from "../../Config";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import { useFormik } from "formik";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { fetchProjectsForPMThunk } from "../../store/slices/ProjectsSlice";
import { arrayRemoveItem, capitalizeFirstLetter } from "../../helper";
import sortBy from "lodash/sortBy";
import { has_permission } from "../../helper";
import LinearWithValueLabel from "../../components/linear-progress-bar/linear-progress-bar";
import "./myProjectDetails.css";
import AssignedProjectsPopover from "./inc/AssignedProjectsPopover";
import axios from "axios";
import CreatableSelect from "react-select/creatable";

const subtasks = () => {
  const { work_package_number } = useParams();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(0);
  const [project, setProject] = useState();
  const [assignees, setAssignees] = useState([]);

  const [inputList, setInputList] = useState([]);

  let location = useLocation();
  let history = useHistory();
  const [titleStatus, setTitleStatus] = useState(1);
  const [tdo, setTdo] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedAssigneesEP, setSelectedAssigneesEP] = useState([]);
  const profile_details = useSelector((state) => state.profile.data);
  const [remaining_EP, setRemaining_EP] = useState(1);
  const [selectedAssigneeTotalEP, setSelectedAssigneeTotalEP] = useState(0);
  const [total_ep, setTotalEp] = useState(0);
  const [total_planned_hours, setTotalPlannedHours] = useState(0);
  const [total_ph, setTotalPH] = useState(0);
  const [length, setlength] = useState();
  const [selectedTaskTitle, setSelectedTaskTitle] = useState();
  const [tabs, settabs] = useState(0);

  let task_title_array = [
    {
      value: "Deployment",
      label: "Deployment",
    },
    {
      value: "Hardware Design & Development",
      label: "Hardware Design & Development",
    },
    {
      value: "Information Management",
      label: "Information Management",
    },
    {
      value: "Integration",
      label: "Integration",
    },
    {
      value: "Logistics",
      label: "Logistics",
    },
    {
      value: "Program Management",
      label: "Program Management",
    },
    {
      value: "Software Design & Development",
      label: "Software Design & Development",
    },
    {
      value: "Test & Verification",
      label: "Test & Verification",
    },
  ];

  const [task_title_list, setTaskTitleList] = useState(task_title_array);
  const radioHandler = (status, titleStatus) => {
    setStatus(status);
    setTitleStatus(titleStatus);
  };
  function calculate_progress_in_percentage(total_hours, remaining_hours) {
    let worked_hours = parseFloat(total_hours) - parseFloat(remaining_hours);
    return (100 * worked_hours) / parseFloat(total_hours);
  }

  const delete_assignee = (project_id, assignee) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        API.delete("/project/remove-assignee/" + assignee.id + "/", {
          data: { project: project_id, assignee: assignee.id },
        })
          .then((response) => {
            if (response.data.success == "True") {
              dispatch(
                fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID))
              );
              initialize();
              swal("Poof! Your selected assignee has been removed!", {
                icon: "success",
              });
              setAssignees(
                sortBy(
                  [
                    ...assignees,
                    {
                      value: assignee.id.toString(),
                      label: assignee.first_name + " " + assignee.last_name,
                      data: assignee,
                    },
                  ],
                  "label"
                )
              );
            } else if (response.data.success == "False") {
              swal("Poof!" + response.data.message, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            //swal("Failed!",error,"error");
          });
      }
    });
  };
  const dateOver = (endDate) => {
    let today = new Date();
    const moment = require("moment");
    let daysleft = moment(endDate).diff(moment(today), "days");
    console.log("end date", endDate);
    console.log("days left ", daysleft + 1);
    if (daysleft + 1 <= 0) {
      return false;
    }
    return true;
  };
  const delete_subtask = (work_package_index) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        API.delete("/project/subtask/delete/" + work_package_index + "/")
          .then((response) => {
            if (response.data.success == "True") {
              dispatch(
                fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID))
              );
              initialize();
              swal("Poof! Your selected sub task has been deleted!", {
                icon: "success",
              });
            } else if (response.data.success == "False") {
              swal("Poof!" + response.data.message, {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            //swal("Failed!",error,"error");
          });
      }
    });
  };
  const [editModal, setEditModal] = useState(false);
  const validateEditForm = (values) => {
    setlength(values.description.length);
    console.log("values ****", values);
    const errors = {};
    if (!values.sub_task || String(values.sub_task).length < 1)
      errors.task_delivery_order = "Task Delivery Order is required";
    if (!values.sub_task) errors.sub_task = "Sub task is required";
    if (!values.task_title) errors.task_title = "Task title is required";
    if (!values.estimated_person)
      errors.estimated_person = "Estimated person is required";
    if (!values.planned_value)
      errors.planned_value = "Planned value is required";
    if (!values.planned_hours)
      errors.planned_hours = "Planned hours is required";
    return errors;
  };
  const edit_project = (values, { setSubmitting }) => {
    const formValues = {
      task_delivery_order: values.task_delivery_order,
      tdo_details: values.tdo_details,
      sub_task: values.sub_task,
      description: values.description,
      work_package_number: values.work_package_number,
      task_title: values.task_title,
      estimated_person: values.estimated_person,
      start_date: values.start_date,
      planned_delivery_date: values.planned_delivery_date,
      assignee: values.assignee,
      pm: values.pm,
      planned_hours: Number(values.planned_hours).toFixed(2),
      planned_value: Number(values.planned_value).toFixed(2),
      remaining_hours: Number(values.remaining_hours).toFixed(2),
    };
    console.log(JSON.stringify(formValues));
    API.put(
      "project/update/" + values.work_package_index + "/",
      formValues
    ).then((res) => {
      console.log(res.data);
      if (res.status == 200 && res.data.success == "True") {
        setEditModal(false);
        setSubmitting(false);
        initialize();
        swal("Sub Task Details is updated!", " ", "success");
      }
    });
  };
  function removeAssignee(item) {
    console.log("assignee item", item);
    setAssignees(
      sortBy(
        [
          ...assignees,
          {
            value: item.assignee.id.toString(),
            label: item.assignee.first_name + " " + item.assignee.last_name,
            data: item.assignee,
          },
        ],
        "label"
      )
    );
    setInputList(arrayRemoveItem(inputList, item));
    populate_planned_value_and_hours(arrayRemoveItem(inputList, item));
    setRemaining_EP(
      (parseFloat(remaining_EP) + parseFloat(item.estimated_person)).toFixed(2)
    );
  }
  function is_form_submitting() {
    if (editForm.isSubmitting && !editForm.isValidating) {
      return true;
    }
    return false;
  }
  const editForm = useFormik({
    // initialValues: {
    //   sub_task: project?.project.sub_task,
    //   description: project?.project.description,
    //   work_package_number: project?.project.work_package_number,
    //   work_package_index: project?.project.work_package_index,
    //   task_title: "",
    //   estimated_person: "",
    //   start_date: project?.project.start_date,
    //   planned_delivery_date: project?.project.planned_delivery_date,
    //   assignee: [],
    //   pm: project?.project.pm.id,
    //   planned_hours: "",
    //   planned_value: "",
    //   remaining_hours: project?.project.remaining_hours,
    //   status: project?.project.status,
    //   sub_task_updated: "",
    // },
    initialValues: {
      sub_task: "",
      description: "",
      work_package_number: "",
      work_package_index: "",
      task_title: "",
      estimated_person: "",
      start_date: "",
      planned_delivery_date: "",
      assignee: [],
      pm: "",
      planned_hours: "",
      planned_value: "",
      remaining_hours: "",
      status: "",
      sub_task_updated: "",
    },
    validateOnBlur: true,
    validateOnChange: true,
    validate: validateEditForm,
    onSubmit: edit_project,
  });
  const initialize_default_assignees = (subtask) => {
    const requestOne = API.get(
      "project/date-to-date/" +
        subtask.start_date +
        "/" +
        subtask.planned_delivery_date +
        "/"
    );
    const requestTwo = API.get("auth/assignee/list/");
    axios
      .all([requestOne, requestTwo], {
        baseURL: API_URL,
        timeout: 100000,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(TOKEN)}`,
          "Content-Type": "application/json",
        },
      })
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let total_hours = responseOne.data.total_hours;
          setTotalPH(total_hours);
          let temp = [];
          let dtem = [];
          let temp_inputList = [];
          let total_temp_ep = 0;
          let preset_assignees = [];
          let eps = [];
          Array.from(responseTwo.data.data).forEach((item, idx) => {
            temp.push({
              value: item.id.toString(),
              label: item.first_name + " " + item.last_name,
              data: item,
            });
          });

          subtask?.assignees.forEach((assignee, idx) => {
            console.log("asstray", total_ph);
            total_temp_ep += parseFloat(assignee.estimated_person);
            eps.push(assignee.estimated_person);
            temp_inputList.push({
              sorter: assignee.assignee.first_name,
              assignee: assignee.assignee,
              estimated_person: assignee.estimated_person,
              planned_value: Number(
                parseFloat(assignee.assignee.slc_details.hourly_rate) *
                  parseFloat(total_hours) *
                  parseFloat(assignee.estimated_person)
              ).toFixed(2),
              planned_hours: parseFloat(
                (
                  parseFloat(total_hours) *
                  parseFloat(assignee.estimated_person)
                ).toFixed(2)
              ),
            });
            dtem.push(assignee.assignee.id.toString());
            preset_assignees.push({
              value: String(assignee.assignee.id).toString(),
              label:
                assignee.assignee.first_name +
                " " +
                assignee.assignee.last_name,
              data: assignee.assignee,
            });
            temp = temp.filter(function (ele) {
              return ele.value != String(assignee.assignee.id).toString();
            });
          });
          console.log({ temp_inputList });
          setInputList(sortBy(temp_inputList, "sorter"));
          setAssignees(sortBy(temp, "label"));
          setTotalEp(total_temp_ep);
          // setSelectedAssignees(sortBy(preset_assignees,'label'))
          editForm.setFieldValue("estimated_person", eps);
          editForm.setFieldValue("assignee", dtem);
          return dtem;
        })
      );
  };
  const editInfoForm = (subtask) => {
    console.log("selected sub task", subtask);
    setEditModal(!editModal);
    if (editForm) {
      API.get(
        "project/date-to-date/" +
          subtask.start_date +
          "/" +
          subtask.planned_delivery_date +
          "/"
      ).then((res) => {
        setTotalPlannedHours(parseFloat(res.data.total_hours));
        editForm.setValues({
          sub_task: subtask.sub_task,
          description: subtask.description,
          work_package_number: subtask.work_package_number,
          work_package_index: subtask.work_package_index,
          task_title: subtask.task_title,
          estimated_person: editForm.values.estimated_person,
          start_date: subtask.start_date,
          planned_delivery_date: subtask.planned_delivery_date,
          assignee: initialize_default_assignees(subtask),
          pm: subtask.pm.id,
          planned_hours: subtask.planned_hours,
          planned_value: subtask.planned_value,
          remaining_hours: subtask.remaining_hours,
          status: subtask.status,
          sub_task_updated: "",
        });
      });

      // populate_planned_value_and_hours(inputList)
      // dateRange(project?.project.start_date,project?.project.planned_delivery_date)
    }
  };
  const initialize = () => {
    // /dashboard/Projects/my-projects/subtask-details/7
    API.get("project/details/" + id + "/")
      .then((res) => {
        console.log(res);
        if (res.statusText != "OK") {
          history.push("/dashboard/Projects/my-projects");
        } else {
          console.log("project", res.data);
          if (res.data.data.subtasks.length > 0) {
            console.log("res", res.data.data);
            let temp = [];
            temp = sortBy(res.data.data.subtasks, "planned_delivery_date");
            res.data.data.subtasks = temp;
            console.log("sorted", res.data.data);
            setProject(res.data.data);
            setTdo(res.data.data.project.task_delivery_order.title);
            // editForm.setFieldValue('assignee', res.data.assignee)
            // initialize_total_working_days(res.data.data.project.start_date, res.data.data.project.planned_delivery_date)
            // dateRange(res.data.data.project.start_date,res.data.data.project.planned_delivery_date)
          } else {
            history.push("/dashboard/Projects/my-projects"); //redirecting to my project list page
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const colourStyles = {
    // control: (styles, state) => ({ ...styles,height:"35px", fontSize: '14px !important', lineHeight: '1.42857', borderRadius: "8px",borderRadius:".25rem",color:"rgb(133,133,133)",border:state.isFocused ? '2px solid #0065ff' :'inherit'}),
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };

  const handleAddPerson = () => {
    console.log(
      "selected assignee",
      selectedAssignees,
      "ep",
      selectedAssigneesEP
    );
    populate_planned_value_and_hours([
      ...inputList,
      {
        assignee: selectedAssignees.data,
        estimated_person: selectedAssigneesEP,
        planned_value: Number(
          parseFloat(selectedAssignees.data.slc_details.hourly_rate) *
            total_planned_hours
        ).toFixed(2),
        planned_hours: Number(
          parseFloat((total_planned_hours * selectedAssigneesEP).toFixed(2))
        ).toFixed(2),
      },
    ]);
    setInputList([
      ...inputList,
      {
        assignee: selectedAssignees.data,
        estimated_person: selectedAssigneesEP,
        planned_value: Number(
          parseFloat(selectedAssignees.data.slc_details.hourly_rate) *
            total_planned_hours *
            selectedAssigneesEP
        ).toFixed(2),
        planned_hours: Number(
          parseFloat((total_planned_hours * selectedAssigneesEP).toFixed(2))
        ).toFixed(2),
      },
    ]);
    setSelectedAssignees(null);
    setSelectedAssigneesEP(0);
    setRemaining_EP((remaining_EP - selectedAssigneesEP).toFixed(2));
    console.log("inputList", inputList);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state != undefined) {
      console.log("project", location.state.project[0]);
      settabs(location.state.project.length);
      setProject(location.state.project);
      // setTdo(location.state.project.project.task_delivery_order.title);
    } else {
      //history.goBack()
      initialize();
    }
  }, []);

  return (
    <>
      {project != undefined && (
        <CContainer>
          <CModal
            closeOnBackdrop={false}
            alignment="center"
            show={editModal}
            onClose={() => {
              setEditModal(!editModal);
            }}
            size="lg"
          >
            <CModalHeader onClose={() => setEditModal(!editModal)} closeButton>
              <CModalTitle className="modal-title-projects">
                <span className="edit-profile-form-header">
                  Edit Project Info
                </span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CForm>
                  <CRow>
                    <CCol lg="12" className="mb-2">
                      <CLabel htmlFor="sub_task" className="custom-label-5">
                        Sub Task
                      </CLabel>
                      <CInput
                        id="sub_task"
                        name="sub_task"
                        type="text"
                        value={editForm.values.sub_task}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                      />
                      {/**validation */}
                      {editForm.errors.sub_task &&
                        editForm.touched.sub_task && (
                          <p className="error">{editForm.errors.sub_task}</p>
                        )}
                    </CCol>
                    {/**PM Name */}
                    <CCol lg="12" className="mb-2">
                      <CLabel htmlFor="pmName" className="custom-label-5">
                        PM Name
                      </CLabel>
                      <CInput
                        value={
                          project[0].project.pm.first_name +
                          " " +
                          project[0].project.pm.last_name
                        }
                        id="pmName"
                        name="pmName"
                        type="text"
                        className="custom-forminput-6"
                        readOnly
                      />
                    </CCol>
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="work_package_number"
                        className="custom-label-5"
                      >
                        Work Package Number
                      </CLabel>
                      <CInput
                        id="work_package_number"
                        name="work_package_number"
                        type="number"
                        className="custom-forminput-6"
                        min="0"
                        value={editForm.values.work_package_number}
                        onChange={editForm.handleChange}
                        readOnly
                      />
                    </CCol>
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="work_package_index"
                        className="custom-label-5"
                      >
                        Work Package Index
                      </CLabel>
                      <CInput
                        id="work_package_index"
                        name="work_package_index"
                        type="number"
                        className="custom-forminput-6"
                        min="0"
                        value={editForm.values.work_package_index}
                        onChange={editForm.handleChange}
                        readOnly
                      />
                    </CCol>
                    {/**Task Title */}
                    <CCol lg="12" className="mb-2">
                      <CLabel htmlFor="task_title" className="custom-label-5">
                        Task Title
                      </CLabel>
                      <CInput
                        id="task_title"
                        name="task_title"
                        //options={task_title_list}
                        value={editForm.values.task_title}
                        onChange={editForm.handleChange}
                        type="text"
                        className="custom-forminput-6"
                        readOnly
                      />
                      {/* <CreatableSelect
                        id="task_title"
                        name="task_title"
                        closeMenuOnSelect={true}
                        isClearable={false}
                        value={selectedTaskTitle}
                        options={task_title_list}
                        onChange={(event)=> handleTaskTitleChange(event)}
                        type="text"
                        className="custom-forminput-6"
                        isMulti = {false}
                      /> */}
                      {/**validation */}
                      {editForm.errors.task_title &&
                        editForm.touched.task_title && (
                          <p className="error">{editForm.errors.task_title}</p>
                        )}
                    </CCol>

                    {/**Task Details*/}
                    <CCol lg="12" className="mb-2">
                      <CLabel htmlFor="sub_task" className="custom-label-5">
                        Task Details
                      </CLabel>
                      <CTextarea
                        // maxlength="500"
                        id="description"
                        name="description"
                        type="text"
                        value={editForm.values.description}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                      ></CTextarea>

                      {/* { <div className="float-right">{length}/500</div>} */}
                    </CCol>

                    {/**start date */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5">Start Date</CLabel>
                      <CInput
                        id="start_date"
                        name="start_date"
                        value={editForm.values.start_date}
                        onChange={(event) => {
                          handleStartDateChange(event);
                        }}
                        className="custom-forminput-6"
                        type="date"
                      />
                      {editForm.touched.start_date &&
                        editForm.errors.start_date && (
                          <small style={{ color: "red" }}>
                            {editForm.errors.start_date}
                          </small>
                        )}
                    </div>
                    {/**Planned delivery date */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5">
                        Planned Delivery Date
                      </CLabel>
                      <CInput
                        id="planned_delivery_date"
                        name="planned_delivery_date"
                        value={editForm.values.planned_delivery_date}
                        onChange={(event) => handleDeliveryDateExtend(event)}
                        className="custom-forminput-6"
                        type="date"
                      />
                      {editForm.touched.planned_delivery_date &&
                        editForm.errors.planned_delivery_date && (
                          <small style={{ color: "red" }}>
                            {editForm.errors.planned_delivery_date}
                          </small>
                        )}
                    </div>
                    <div className="col-lg-12 mb-3">
                      <div className="evms-div pr-3 pl-3">
                        <div className="row">
                          <ul className="m-3">
                            {inputList.map((item, idx) => (
                              <li key={idx}>
                                <AssignedProjectsPopover
                                  remove={removeAssignee}
                                  data={item}
                                  text1={
                                    capitalizeFirstLetter(
                                      item.assignee.first_name
                                    ) +
                                    " " +
                                    capitalizeFirstLetter(
                                      item.assignee.last_name
                                    )
                                  }
                                  text2={
                                    "  → " +
                                    Number(total_ep).toFixed(2) +
                                    " EP → " +
                                    parseFloat(
                                      editForm.values.planned_value
                                    ).toFixed(2) +
                                    " PV → " +
                                    parseFloat(
                                      editForm.values.planned_hours
                                    ).toFixed(2) +
                                    " Hr(s)"
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                          <div className="col-lg-6 mb-3">
                            <CLabel
                              className="custom-label-5"
                              htmlFor="workerBees"
                              aria-labelledby="workerBees"
                            >
                              Assignee
                            </CLabel>
                            <Select
                              closeMenuOnSelect={true}
                              aria-labelledby="workerBees"
                              id="workerBees"
                              minHeight="35px"
                              placeholder="Select from list"
                              isClearable={false}
                              isMulti={false}
                              onChange={(v, i) => {
                                setSelectedAssignees(v);
                                setSelectedAssigneesEP(1);
                                setSelectedAssigneeTotalEP(v.data.total_ep);
                                setAssignees(arrayRemoveItem(assignees, v));
                              }}
                              classNamePrefix="custom-forminput-6"
                              value={selectedAssignees}
                              options={assignees ? assignees : []}
                              styles={colourStyles}
                            />
                            {editForm.touched.assignee &&
                              editForm.errors.assignee && (
                                <small style={{ color: "red" }}>
                                  {editForm.errors.assignee}
                                </small>
                              )}
                          </div>
                          <div className="col-lg-2 mb-3">
                            <CLabel className="custom-label-5">
                              Assigned EP
                            </CLabel>
                            <CInput
                              type="number"
                              value={selectedAssigneeTotalEP}
                              readOnly
                              className="custom-forminput-6"
                            ></CInput>
                            <small>(Total EP of assigned projects)</small>
                          </div>
                          <div className="col-lg-2 mb-3">
                            <CLabel className="custom-label-5">EP</CLabel>
                            <CInput
                              id="estimated_person"
                              type="number"
                              name="estimated_person"
                              min="0"
                              step="0.1"
                              value={selectedAssigneesEP}
                              onChange={(e) => {
                                if (
                                  e.target.value.match(
                                    "^(0(.[0-9]+)?|1(.0+)?)$"
                                  ) != null
                                ) {
                                  setSelectedAssigneesEP(e.target.value);
                                }
                              }}
                              className="custom-forminput-6"
                            ></CInput>
                          </div>
                          <div className="col-lg-2 mb-3">
                            <CButton
                              color="primary"
                              type="button"
                              className="ar-btn"
                              onClick={handleAddPerson}
                              disabled={selectedAssigneesEP == 0}
                            >
                              + Add
                            </CButton>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 mb-3">
                      <CLabel className="custom-label-5">Planned Value</CLabel>
                      <CInput
                        id="planned_value"
                        name="planned_value"
                        readOnly
                        value={Number(
                          parseFloat(editForm.values.planned_value)
                        ).toFixed(2)}
                        className="custom-forminput-6"
                      ></CInput>
                      {/* {editForm.touched.planned_value && editForm.errors.planned_value && <small style={{ color: 'red' }}>{editForm.errors.planned_value}</small>} */}
                    </div>
                    <div className="col-lg-3 mb-3">
                      <CLabel className="custom-label-5">
                        Estimated Person(s)
                      </CLabel>
                      {/* onChange={(e) => { handleInputChange(e, i, 'ep') }} */}
                      <CInput
                        readOnly
                        id="estimated_person"
                        type="number"
                        name="estimated_person"
                        min="0"
                        max="1"
                        step="0.1"
                        value={Number(total_ep).toFixed(2)}
                        //onChange={(e) => {}}
                        className="custom-forminput-6"
                      ></CInput>
                    </div>
                    {/**planned hours */}

                    <div className="col-lg-3 mb-3">
                      <CLabel className="custom-label-5">Planned hr(s)</CLabel>
                      <CInput
                        id="planned_hours"
                        name="planned_hours"
                        readOnly
                        value={Number(
                          parseFloat(editForm.values.planned_hours)
                        ).toFixed(2)}
                        onChange={(event) => {
                          editForm.setFieldValue(
                            "planned_hours",
                            event.target.value
                          );
                          editForm.setFieldValue(
                            "remaining_hours",
                            event.target.value
                          );
                        }}
                        className="custom-forminput-6"
                      ></CInput>
                      {/* {editForm.touched.planned_hours && editForm.errors.planned_hours && <small style={{ color: 'red' }}>{editForm.errors.planned_hours}</small>} */}
                    </div>
                    <div className="col-lg-3 mb-3">
                      <CLabel className="custom-label-5">
                        Remaining hr(s)
                      </CLabel>
                      <CInput
                        id="remaining_hours"
                        name="remaining_hours"
                        value={Number(
                          parseFloat(editForm.values.planned_hours)
                        ).toFixed(2)}
                        className="custom-forminput-6"
                        readOnly
                      />
                    </div>
                   {/**pMs */}
                   <div className="col-lg-12 mb-3">
                      <CLabel className="custom-label-5">
                        Project Manager(s)
                      </CLabel>
                      <CInput
                        className="custom-forminput-6"
                        value={
                          profile_details.first_name +
                          " " +
                          profile_details.last_name
                        }
                        readOnly
                      />
                    </div>
                    {/**submit buttons */}
                    <div className="col-md-12">
                      {is_form_submitting() == true ? (
                        <LinearProgress />
                      ) : (
                        <div className="project-form-button-holders mt-3">
                          <CButton
                            type="button"
                            onClick={editForm.handleSubmit}
                            className="create-btn-prjct create-prjct"
                          >
                            Update Project
                          </CButton>
                          {/* <CButton type="button" onClick={reset_form} className="create-btn-prjct cancel-prjct">Cancel</CButton> */}
                        </div>
                      )}
                    </div>
                  </CRow>
                </CForm>
              </CContainer>
            </CModalBody>
          </CModal>

          <h3 className="dash-header-1">
            Subtask Details{" "}
            <CButton
              className="export-project-list"
              //onClick={() => exportToCSV()}
            >
              <CIcon name="cil-spreadsheet" className="mr-2" />
              Export to excel
            </CButton>
          </h3>
          {status === 0 ? (
            <div className="card-header-portion-ongoing">
              <h4 className="ongoing-card-header-1">
                {/* <IconButton aria-label="favourite" disabled size="medium" color="primary">
                                    <GradeIcon fontSize="inherit" className="fav-button" />
                                </IconButton> */}
                {project != undefined
                  ? project[0].project.task_delivery_order.title
                  : ""}
              </h4>
              <CButton
                className="edit-ongoing-project-title"
                variant="ghost"
                onClick={(e) => radioHandler(1, 0)}
              >
                <CIcon name="cil-pencil" className="mr-1 pen-icon" />
              </CButton>
            </div>
          ) : (
            <></>
          )}

          
            
            <CTabs
              //key={idx}
              activeTab={project[0].project.task_delivery_order.title}
            >
              <CNav variant="tabs">
                {Array.from(project).map((pro,idx)=>(
                  <CNavItem>
                    <CNavLink data-tab={pro.project.sub_task}>
                      {pro.project.sub_task}
                    </CNavLink>
                </CNavItem>
                ))}
                
              </CNav>

              <CTabContent>
                <CTabPane data-tab={pro.project.sub_task}>
                  
                    <CCard key={idx1} className="card-ongoing-project">
                      <CCardBody className="details-project-body">
                        <div className="ongoing-initial-info row">
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Work Package Index</h6>
                            <h6 className="project-point-details">
                              {i.work_package_index}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Task Title</h6>
                            <h6 className="project-point-details">
                              {i.task_title}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">PM Name</h6>
                            <h6 className="project-point-details">
                              {i.pm.first_name + " " + i.pm.last_name}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">
                              Estimated Person(s)
                            </h6>
                            <h6 className="project-point-details">
                              {i.estimated_person}
                            </h6>
                          </div>
                          {has_permission("projects.add_projects") && (
                            <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">Planned Value</h6>
                              <h6 className="project-point-details">
                                {Number(parseFloat(i.planned_value)).toFixed(2)}{" "}
                              </h6>
                            </div>
                          )}
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Planned Hours</h6>
                            <h6 className="project-point-details">
                              {Number(parseFloat(i.planned_hours)).toFixed(2)}{" "}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Actual Hours</h6>
                            <h6 className="project-point-details">
                              {(i.planned_hours - i.remaining_hours).toFixed(2)}{" "}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Remaining Hours</h6>
                            <h6 className="project-point-details">
                              {Number(parseFloat(i.remaining_hours)).toFixed(2)}{" "}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">Start Date</h6>
                            <h6 className="project-point-details">
                              {i.start_date}{" "}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-4">
                            <h6 className="tiny-header2">
                              Planned Delivery Date
                            </h6>
                            <h6 className="project-point-details">
                              {i.planned_delivery_date}{" "}
                            </h6>
                          </div>
                          <div className="tasks-done-2 col-lg-12">
                            <h6 className="tiny-header2">Task Details</h6>
                            <h6 className="project-point-details-2">
                              {i.description == ""
                                ? "Not available"
                                : i.description}
                            </h6>
                          </div>
                        </div>
                        <div>
                          <LinearWithValueLabel
                            progress={() =>
                              calculate_progress_in_percentage(
                                i.planned_hours,
                                i.remaining_hours
                              )
                            }
                          />
                        </div>
                        <div className="mt-4 mb-2">
                          <h5 className="projectName mb-3">
                            Asssignee(s)-({Array.from(i.assignees).length})
                          </h5>
                          <div className="file-show-ongoing-details row">
                            {project != undefined &&
                              Array.from(i.assignees).map((item, idx2) => (
                                <div
                                  key={idx}
                                  className="col-md-4 col-sm-6 col-lg-2"
                                >
                                  <div className="file-attached-ongoing rounded-pill">
                                    <CButton
                                      type="button"
                                      onClick={() => {
                                        console.log("item here", item);
                                        delete_assignee(i.id, item.assignee);
                                      }}
                                      className="remove-file-ongoing"
                                    >
                                      <img
                                        src={
                                          "assets/icons/icons8-close-64-blue.svg"
                                        }
                                        className="close-icon-size"
                                      />
                                    </CButton>
                                    {item.assignee.first_name +
                                      " " +
                                      item.assignee.last_name}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                        {/**ACTION BUTTONS !!!!!!!!!! */}
                        <div className="mt-2 mb-2">
                          <div className="project-actions">
                            <CButton
                              className="edit-project-ongoing-task"
                              onClick={() => editInfoForm(i)}
                            >
                              <CIcon name="cil-pencil" className="mr-1" /> Edit{" "}
                            </CButton>
                            <CButton
                              type="button"
                              onClick={() =>
                                delete_subtask(i.work_package_index)
                              }
                              className="delete-project-2"
                            >
                              <CIcon name="cil-trash" className="mr-1" /> Delete
                            </CButton>
                          </div>
                        </div>
                      </CCardBody>
                      {dateOver(i.planned_delivery_date) == true && (
                        <CCardFooter row>
                          <CButton
                            type="button"
                            className="create-wbs-from-modal float-right"
                            size="sm"
                            onClick={() =>
                              //console.log("subtask ", subtask)
                              history.push({
                                pathname: "/dashboard/WBS/create-wbs",
                                state: { task: i },
                              })
                            }
                          >
                            Create WBS
                          </CButton>
                        </CCardFooter>
                      )}
                    </CCard>
                  
                </CTabPane>
              </CTabContent>
            </CTabs>
        </CContainer>
      )}
    </>
  );
};

export default subtasks;
