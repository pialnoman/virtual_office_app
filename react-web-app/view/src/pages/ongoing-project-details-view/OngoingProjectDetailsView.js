import {
  CCardBody,
  CCard,
  CForm,
  CButton,
  CInput,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CContainer,
  CRow,
  CCol,
  CLabel,
  CCardFooter,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import GradeIcon from "@material-ui/icons/Grade";
import IconButton from "@material-ui/core/IconButton";
import "./OngoingProjectDetailsView.css";
import CIcon from "@coreui/icons-react";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { useHistory, useLocation } from "react-router";
import { API, BASE_URL, USER_ID } from "../../Config";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import {
  fetchProjectsThunk,
  projectsSlice,
} from "../../store/slices/ProjectsSlice";
import { useParams } from "react-router-dom";
import { has_permission } from "../../helper";
import { useFormik } from "formik";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import LinearWithValueLabel from "../../components/linear-progress-bar/linear-progress-bar";
import { can_create_wbs } from "../ongoing-project-details/ongoingProjectDetails";
const OngoingDetailsView = () => {
  const { work_package_number } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(0);
  const [project, setProject] = useState();
  const [assignees, setAssignees] = useState([]);
  const [assigneeValue, setAssigneeValue] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);
  let location = useLocation();
  let history = useHistory();
  const [titleStatus, setTitleStatus] = useState(1);
  const [tdo, setTdo] = useState("");
  const radioHandler = (status, titleStatus) => {
    setStatus(status);
    setTitleStatus(titleStatus);
  };
  const [editModal, setEditModal] = useState(false);
  const validateEditForm = (values) => {
    console.log("validating values", values);
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
  const edit_project = (values) => {
    console.log(values);
    API.put("project/update/" + values.work_package_index + "/", values).then(
      (res) => {
        console.log(res.data);
        if (res.status == 200 && res.data.success == "True") {
          setEditModal(false);
          initialize();
          swal("Sub Task Details is updated", "", "success");
        }
      }
    );
  };
  const editForm = useFormik({
    initialValues: {
      sub_task: "",
      work_package_number: project?.project.work_package_number,
      work_package_index: "",
      task_title: "",
      estimated_person: "",
      planned_delivery_date: project?.project.planned_delivery_date,
      assignee: [],
      pm: project?.project.pm.id,
      planned_hours: "",
      planned_value: "",
      remaining_hours: "",
      status: project?.project.status,
      sub_task_updated: "",
    },
    validateOnBlur: true,
    validateOnChange: true,
    validate: validateEditForm,
    onSubmit: edit_project,
  });
  const initialize_default_assignees = (subtask) => {
    let dtem = [];
    let preset_assignees = [];
    //setDefaultValue([])
    subtask.assignees.forEach((assignee, idx) => {
      dtem.push({
        value: String(assignee.assignee.id).toString(),
        label: assignee.assignee.first_name + " " + assignee.assignee.last_name,
      });

      preset_assignees.push(Number(assignee.assignee.id));
    });
    editForm.setFieldValue("assignee", preset_assignees);
    setDefaultValue(dtem);
    return preset_assignees;
  };
  const editInfoForm = (subtask) => {
    setEditModal(!editModal);
    if (editForm) {
      console.log("assignee in edit form", editForm.values);
      editForm.setValues({
        sub_task: project?.project.sub_task,
        work_package_number: project?.project.work_package_number,
        work_package_index: subtask?.work_package_index,
        task_title: subtask?.task_title,
        estimated_person: subtask ? Number(subtask.estimated_person) : 0,
        planned_delivery_date: project?.project.planned_delivery_date,
        assignee: initialize_default_assignees(subtask),
        pm: project.project.pm.id,
        planned_hours: project?.project.planned_hours,
        planned_value: project?.project.planned_value,
        remaining_hours: project?.project.remaining_hours,
        status: subtask.status,
        sub_task_updated: "",
      });
    }
  };

  const colourStyles = {
    // control: (styles, state) => ({ ...styles,height:"35px", fontSize: '14px !important', lineHeight: '1.42857', borderRadius: "8px",borderRadius:".25rem",color:"rgb(133,133,133)",border:state.isFocused ? '2px solid #0065ff' :'inherit'}),
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };

  const initialize = () => {
    API.get("project/details/" + work_package_number + "/")
      .then((res) => {
        if (res.statusText != "OK") {
          history.push("/dashboard/Projects/assigned-projects");
        } else {
          setProject(res.data.data);
          setTdo(res.data.data.project.task_delivery_order.title);
          editForm.setFieldValue("assignee", res.data.ass);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    API.get("auth/assignee/list/").then((res) => {
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        temp.push({
          value: item.id.toString(),
          label: item.first_name + " " + item.last_name,
        });
      });
      setAssignees(temp);
    });
    if (location.state != undefined) {
      console.log("project", location.state.project);
      setProject(location.state.project);
      setTdo(location.state.project.project.task_delivery_order.title);
    } else {
      //history.goBack()
      initialize();
    }
    console.log("project", project);
  }, []);

  const handle_tdo_title_change = (id) => {
    console.log({ title: tdo });
    if (tdo.length > 0) {
      API.put("project/change-tdo-title/" + id + "/", { title: tdo })
        .then((res) => {
          console.log("rs", res.data);
          if (res.data.success == "True") {
            setStatus(0);
            setTitleStatus(0);
            // let temp = project
            // temp.project.task_delivery_order = res.data.data
            // setProject(temp)
            dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)));
            initialize();
            swal(
              "Updated",
              "Task Delivery Order name has been updated",
              "success"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          swal("Failed", "Proccess Failed", "error");
        });
    } else {
      swal("Invalid!", "Task delivery order name can not be empty", "warning");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handle_tdo_title_change(project.project.task_delivery_order.id);
    }
  };
  const handleAssigneeChange = (value, actionMeta) => {
    if (
      actionMeta.action == "select-option" ||
      actionMeta.action == "remove-value"
    ) {
      let temp = [];
      value.forEach((item, idx) => {
        temp.push(Number(item.value));
      });
      setDefaultValue(value);
      editForm.setFieldValue("assignee", temp);
    } else if (actionMeta.action == "clear") {
      setDefaultValue(null);
      editForm.setFieldValue("assignee", []);
    }
  };
  const handleStatusChange = (value, actionMeta) => {
    if (actionMeta.action == "select-option") {
      editForm.setFieldValue("status", String(value.value).toString());
    }
  };
  const delete_assignee = (project_id, assignee_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        API.delete("/project/remove-assignee/" + assignee_id + "/", {
          data: { project: project_id, assignee: assignee_id },
        })
          .then((response) => {
            if (response.data.success == "True") {
              dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)));
              initialize();
              swal("Poof! Your selected assignee has been removed!", {
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
  function calculate_progress_in_percentage(total_hours, remaining_hours) {
    let worked_hours = parseFloat(total_hours) - parseFloat(remaining_hours);
    return (100 * worked_hours) / parseFloat(total_hours);
  }
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
              dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)));
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
  {
    /**export in excel */
  }
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  var fileName;
  const xlData = [];
  const exportToCSV = () => {
    for (let i = 0; i < project.subtasks.length; i++) {
      const item = project.subtasks[i];
      fileName = "Details of" + " " + item.sub_task;

      let assigneNames = [];
      var assigneName;
      Array.from(item.assignees).map((el) => {
        assigneNames.push(el.assignee.first_name + " " + el.assignee.last_name);
      });
      assigneName = assigneNames.join(",");

      xlData.push({
        "Sl. No": i + 1,
        TDO: item.task_delivery_order.title,
        "Project Name": item.sub_task,
        "Work Package Number": item.work_package_number,
        "Work Package Index": item.work_package_index,
        "Project Manager": item.pm.first_name + "" + item.pm.last_name,
        "Task Title": item.task_title,
        "Estimated Persons": Number(parseFloat(item.estimated_person)).toFixed(
          2
        ),
        "Planned Value": Number(
          parseFloat(project.project.planned_value)
        ).toFixed(2),
        "Planned Hours": Number(
          parseFloat(project.project.planned_hours)
        ).toFixed(2),
        "Planned Delivery Date": project.project.planned_delivery_date,
        "Assignee(s)": assigneName,
      });
    }
    const ws = XLSX.utils.json_to_sheet(xlData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  console.log("ongoind details", project);
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

  return (
    <>
      {project != undefined && (
        <CContainer>
          {/**Edit ongoing project details starts */}
          <CModal
            closeOnBackdrop={false}
            alignment="center"
            show={editModal}
            onClose={() => {
              setEditModal(!editModal);
            }}
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
                    {/**Subtask Name*/}
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
                      {editForm.errors.sub_task && (
                        <p className="error">{editForm.errors.sub_task}</p>
                      )}
                    </CCol>
                    {/**PM Name */}
                    <CCol lg="6" className="mb-2">
                      <CLabel htmlFor="pmName" className="custom-label-5">
                        PM Name
                      </CLabel>
                      <CInput
                        value={
                          project.project.pm.first_name +
                          " " +
                          project.project.pm.last_name
                        }
                        id="pmName"
                        name="pmName"
                        type="text"
                        className="custom-forminput-6"
                        readOnly
                      />
                    </CCol>
                    {/**Work Package Number */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="work_package_number"
                        className="custom-label-5"
                      >
                        Work Package Number
                      </CLabel>
                      <CInput
                        readOnly
                        id="work_package_number"
                        name="work_package_number"
                        type="number"
                        className="custom-forminput-6"
                        min="0"
                        value={editForm.values.work_package_number}
                        onChange={editForm.handleChange}
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
                        value={editForm.values.task_title}
                        onChange={editForm.handleChange}
                        type="text"
                        className="custom-forminput-6"
                      />
                      {/**validation */}
                      {editForm.errors.task_title && (
                        <p className="error">{editForm.errors.task_title}</p>
                      )}
                    </CCol>
                    {/**assignees */}
                    <CCol lg="12" className="mb-2">
                      <CLabel htmlFor="assignees" className="custom-label-5">
                        Assignee(s)
                      </CLabel>
                      <Select
                        closeMenuOnSelect={false}
                        aria-labelledby="assignees"
                        id="assignees"
                        placeholder="Select from list or create new"
                        isClearable
                        onChange={handleAssigneeChange}
                        value={defaultValue}
                        isMulti
                        classNamePrefix="custom-forminput-6"
                        options={assignees}
                        // getOptionLabel= {option=>option.task_delivery_order}
                        // getOptionValue = {option=>option.task_delivery_order}
                        styles={colourStyles}
                      />
                    </CCol>
                    {/**Estimated persons */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="estimated_person"
                        className="custom-label-5"
                      >
                        Estimated Person(s)
                      </CLabel>
                      <CInput
                        id="estimated_person"
                        name="estimated_person"
                        value={Number(
                          parseFloat(editForm.values.estimated_person)
                        ).toFixed(2)}
                        onChange={editForm.handleChange}
                        type="number"
                        className="custom-forminput-6"
                        min="0"
                      />
                      {/**validation */}
                      {editForm.errors.estimated_person && (
                        <p className="error">
                          {editForm.errors.estimated_person}
                        </p>
                      )}
                    </CCol>

                    {/**planned Value */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="planned_value"
                        className="custom-label-5"
                      >
                        Planned Value
                      </CLabel>
                      <CInput
                        id="planned_value"
                        name="planned_value"
                        type="number"
                        value={Number(
                          parseFloat(editForm.values.planned_value)
                        ).toFixed(2)}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                        min="0"
                      />
                      {/**validation */}
                      {editForm.errors.planned_value && (
                        <p className="error">{editForm.errors.planned_value}</p>
                      )}
                    </CCol>
                    {/**Planned hours */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="planned_hours"
                        className="custom-label-5"
                      >
                        Planned Hours
                      </CLabel>
                      <CInput
                        id="planned_hours"
                        name="planned_hours"
                        type="number"
                        value={Number(
                          parseFloat(editForm.values.planned_hours)
                        ).toFixed(2)}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                        min="0"
                      />
                      {/**validation */}
                      {editForm.errors.planned_hours && (
                        <p className="error">{editForm.errors.planned_hours}</p>
                      )}
                    </CCol>
                    {/**Remaining hours */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="remaining_hours"
                        className="custom-label-5"
                      >
                        Remaining Hours
                      </CLabel>
                      <CInput
                        id="remaining_hours"
                        name="remaining_hours"
                        type="number"
                        value={Number(
                          parseFloat(editForm.values.remaining_hours)
                        ).toFixed(2)}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                        min="0"
                      />
                    </CCol>
                    {/**Planned delivery date */}
                    <CCol lg="6" className="mb-2">
                      <CLabel
                        htmlFor="planned_hours"
                        className="custom-label-5"
                      >
                        Planned Delivery Date
                      </CLabel>
                      <CInput
                        id="planned_delivery_date"
                        name="planned_delivery_date"
                        type="date"
                        value={editForm.values.planned_delivery_date}
                        onChange={editForm.handleChange}
                        className="custom-forminput-6"
                      />
                    </CCol>
                    {/**status */}
                    <CCol lg="6" className="mb-2">
                      <CLabel htmlFor="Status" className="custom-label-5">
                        Status
                      </CLabel>
                      <Select
                        id="Status"
                        name="Status"
                        onChange={handleStatusChange}
                        className="custom-forminput-6"
                        options={[
                          { value: 0, label: "On Going" },
                          { value: 1, label: "Completed" },
                        ]}
                      />
                    </CCol>
                    {/**Action buttons */}
                    <CCol md="12" className="mt-2">
                      <div className="project-form-button-holders mt-3">
                        <CButton
                          type="button"
                          className="profile-form-btn update-profile"
                          onClick={editForm.handleSubmit}
                        >
                          Update Info
                        </CButton>
                        {/* <CButton className="profile-form-btn cancel-update" onClick={() => setEditModal(!editModal)} type="reset">
                                                Cancel
                                            </CButton> */}
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              </CContainer>
            </CModalBody>
          </CModal>
          {/**Edit ongoing project details ends */}

          <h3 className="dash-header-1">
            Project Details{" "}
            <CButton
              className="export-project-list"
              onClick={() => exportToCSV()}
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
                  ? project.project.task_delivery_order.title
                  : ""}
              </h4>
              {has_permission("projects.change_tdo") && (
                <CButton
                  className="edit-ongoing-project-title"
                  variant="ghost"
                  onClick={(e) => radioHandler(1, 0)}
                >
                  <CIcon name="cil-pencil" className="mr-1 pen-icon" />
                </CButton>
              )}
            </div>
          ) : (
            <></>
          )}
          {/**header portion */}

          {/**Show the form for edit when clicked */}
          {status === 1 ? (
            <div className="card-header-portion-ongoing">
              <CForm>
                <CInput
                  onKeyPress={handleKeyPress}
                  value={tdo}
                  onChange={(event) => setTdo(event.target.value)}
                  className="custom-forminput-6"
                  type="text"
                />
              </CForm>
              <div>
                <CButton
                  disabled={tdo.length > 0 ? false : true}
                  type="button"
                  variant="ghost"
                  className="confirm-name"
                  onClick={(e) =>
                    handle_tdo_title_change(
                      project.project.task_delivery_order.id
                    )
                  }
                >
                  <CIcon
                    name="cil-check-circle"
                    className="mr-1 tick"
                    size="xl"
                  />
                </CButton>
                <CButton
                  type="button"
                  variant="ghost"
                  className="cancel-name"
                  onClick={(e) => radioHandler(0, 1)}
                >
                  <CIcon name="cil-x-circle" className="mr-1 cross" size="xl" />
                </CButton>
              </div>
            </div>
          ) : null}

          <div>
            <h6>{project.project.sub_task}</h6>
            {/* <div className="project-point-details">{project.project.description == '' ? 'Not available' : project.project.description}</div> */}
          </div>

          {/**card show */}
          <hr className="header-underline1" />
          {/**Details card */}
          <div className="row">
            <div className="col-md-11 col-sm-12 col-xs-12 mt-1 mb-2">
              {Array.from(project.subtasks).map((subtask, idx) => (
                <CCard key={idx} className="card-ongoing-project">
                  <CCardBody className="details-project-body">
                    {/*task percentage portion */}
                    <div className="ongoing-initial-info row">
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Work Package Index</h6>
                        <h6 className="project-point-details">
                          {subtask.work_package_index}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Task Title</h6>
                        <h6 className="project-point-details">
                          {subtask.task_title}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">PM Name</h6>
                        <h6 className="project-point-details">
                          {subtask.pm.first_name + " " + subtask.pm.last_name}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Estimated Person(s)</h6>
                        <h6 className="project-point-details">
                          {Number(parseFloat(subtask.estimated_person)).toFixed(
                            2
                          )}
                        </h6>
                      </div>
                      {has_permission("projects.add_projects") && (
                        <div className="tasks-done-2 col-lg-4">
                          <h6 className="tiny-header2">Planned Value</h6>
                          <h6 className="project-point-details">
                            {Number(parseFloat(subtask.planned_value)).toFixed(
                              2
                            )}{" "}
                          </h6>
                        </div>
                      )}
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Planned Hours</h6>
                        <h6 className="project-point-details">
                          {Number(parseFloat(subtask.planned_hours)).toFixed(2)}{" "}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Actual Hours</h6>
                        <h6 className="project-point-details">
                          {(
                            subtask.planned_hours - subtask.remaining_hours
                          ).toFixed(2)}{" "}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Remaining Hours</h6>
                        <h6 className="project-point-details">
                          {Number(parseFloat(subtask.remaining_hours)).toFixed(
                            2
                          )}{" "}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Start date</h6>
                        <h6 className="project-point-details">
                          {subtask.start_date}{" "}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-4">
                        <h6 className="tiny-header2">Planned delivery date</h6>
                        <h6 className="project-point-details">
                          {subtask.planned_delivery_date}{" "}
                        </h6>
                      </div>
                      <div className="tasks-done-2 col-lg-12">
                        <h6 className="tiny-header2">Task deatils</h6>
                        <h6 className="project-point-details-2">
                          {subtask.description == ""
                            ? "Not available"
                            : subtask.description}
                        </h6>
                      </div>
                    </div>
                    <div>
                      <LinearWithValueLabel
                        progress={() =>
                          calculate_progress_in_percentage(
                            subtask.planned_hours,
                            subtask.remaining_hours
                          )
                        }
                      />
                    </div>
                    {/**assignees */}
                    <div className="mt-4 mb-2">
                      <h5 className="projectName mb-3">
                        Asssignee(s)-({Array.from(subtask.assignees).length})
                      </h5>
                      <div className="file-show-ongoing-details row">
                        {project != undefined &&
                          Array.from(subtask.assignees).map((item, idx) => (
                            <div
                              key={idx}
                              className="col-md-4 col-sm-6 col-lg-2"
                            >
                              <div className="file-attached-ongoing rounded-pill">
                                {has_permission(
                                  "projects.delete_projectassignee"
                                ) &&
                                  has_permission(
                                    "projects.change_projectassignee"
                                  ) &&
                                  sessionStorage.getItem(USER_ID) ==
                                    project.pm && (
                                    <CButton
                                      type="button"
                                      onClick={() =>
                                        delete_assignee(
                                          subtask.id,
                                          item.assignee.id
                                        )
                                      }
                                      className="remove-file-ongoing"
                                    >
                                      <img
                                        src={
                                          "assets/icons/icons8-close-64-blue.svg"
                                        }
                                        className="close-icon-size"
                                      />
                                    </CButton>
                                  )}
                                {item.assignee.first_name +
                                  " " +
                                  item.assignee.last_name}
                              </div>
                            </div>
                          ))}
                        {/* *extra static buttons,delete code after dynamic implementation */}
                      </div>
                    </div>
                    {/**ACTION BUTTONS !!!!!!!!!! */}
                    {has_permission("projects.delete_projects") &&
                      sessionStorage.getItem(USER_ID) == project.pm && (
                        <div className="col-md-12 mt-2 mb-2">
                          <div className="project-actions">
                            <CButton
                              className="edit-project-ongoing-task"
                              onClick={() => editInfoForm(subtask)}
                            >
                              <CIcon name="cil-pencil" className="mr-1" /> Edit{" "}
                            </CButton>
                            <CButton
                              type="button"
                              onClick={() =>
                                delete_subtask(
                                  project.project.work_package_index
                                )
                              }
                              className="delete-project-2"
                            >
                              <CIcon name="cil-trash" className="mr-1" /> Delete
                            </CButton>
                          </div>
                        </div>
                      )}
                  </CCardBody>
                  {dateOver(subtask.planned_delivery_date) == true && (
                    <CCardFooter row>
                      {can_create_wbs(subtask.assignees) == true && (
                        <CButton
                          type="button"
                          className="create-wbs-from-modal float-right"
                          size="sm"
                          onClick={() =>
                            history.push({
                              pathname: "/dashboard/WBS/create-wbs",
                              state: { task: subtask },
                            })
                          }
                        >
                          Create WBS
                        </CButton>
                      )}
                    </CCardFooter>
                  )}
                </CCard>
              ))}
            </div>
          </div>
        </CContainer>
      )}
    </>
  );
};
export default OngoingDetailsView;
