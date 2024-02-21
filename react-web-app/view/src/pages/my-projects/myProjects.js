import React, { useState, useEffect } from "react";
import {
  fetchProjectsForPMThunk,
  fetchProjectsThunk,
  fetchProjectsbyTDOThunk,
} from "../../store/slices/ProjectsSlice";
import "../ongoing-project-details/ongoingProjectDetails.css";
import {
  CTooltip,
  CCol,
  CAlert,
  CCard,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CContainer,
  CForm,
  CRow,
  CLabel,
  CInput,
  CModalTitle,
} from "@coreui/react";
import uniqBy from "lodash/uniqBy";
import GradeIcon from "@material-ui/icons/Grade";
import IconButton from "@material-ui/core/IconButton";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, USER_ID } from "../../Config";
import { API } from "../../Config";
import swal from "sweetalert";
import Select from "react-select";
import { arrayRemoveItem, has_permission } from "../../helper";
import uniq from "lodash/uniq";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import LinearWithValueLabel from "../../components/linear-progress-bar/linear-progress-bar";
import "./myProjects.css";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import capitalize from "@material-ui/utils/capitalize";
import CustomSearch from "../../components/CustomSearch/CustomSearch";
import SearchResult from "./inc/SearchResult";
import { createSelector } from "reselect";

const MyProjects = () => {
  const pmprojects = useSelector((state) => {
    let e = [];
    Array.from(state.projects.grouped_by_tdo).forEach((item, idx) => {
      e.push(item);
    });
    console.log("all pm Projects", e);
    return e;
  });

  let history = useHistory();
  const dispatch = useDispatch();
  const [status, setStatus] = useState({});
  const [managers, setManagers] = useState([]);
  const [currentPM, setPM] = useState();
  const [selectedTdo, setSelectedTdo] = useState();
  const [fetchproject, setfetchproject] = useState([]);
  const [alltdos, setalltdos] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [filteredprojects, setfilteredProjects] = useState([pmprojects]);
  const [TDOassignees, setTdoassignee] = useState([]);

  let details = [];
  const optionlist = (projects) => {
    let optionarray = [];
    for (let i = 0; i < projects.length; i++) {
      optionarray.push({
        data: projects[i].projects,
        label: projects[i].title,
        value: projects[i].id,
      });
    }
    optionarray.unshift({
      label: "Select All",
      value: "all",
      data: {},
    });
    console.log("options", optionarray);
    setalltdos(optionarray);
    details = [...optionarray];
    setProjectDetails(details.shift());
  };

  const handlePMChange = (option, actionMeta) => {
    setPM(option);
  };

  const changePM = (wp) => {
    API.put("project/change-project-manager/", {
      wp: wp,
      pm: currentPM.value,
    }).then((res) => {
      if (res.status == 200 && res.data.success == "True") {
        setStatus({ project: null });
        setPM(null);
        dispatch(fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID)));
        swal("Project manager changed successfully!", "", "success");
      }
    });
  };
  // const [filteredProjects, setfilteredProjects] = useState()
  const projects = useSelector((state) => {
    let temp = [];
    Array.from(state.projects.grouped_by_tdo).forEach((item, idx) => {
      temp.push(item);
    });
    return temp;
  });
  // const filtered_pm_projects = useSelector((state) =>
  //   filter_pm_projects(state, selectedTdo)
  // );
  // const tdolist = useSelector((state) => {
  //   let temp = [];
  //   state.projects.pm_projects.forEach((item, idx) => {
  //     if (item.project.status == 0) {
  //       temp.push({
  //         label: item.project.task_delivery_order.title,
  //         value: item.project.task_delivery_order.id,
  //       });
  //     }
  //   });
  //   temp.unshift({ label: "Select All", value: "all" });
  //   return temp;
  // });

  const setSelectedTdofunc = (options) => {
    let temp = [];
    console.log("filter", options);
    if (options.find((item) => item.value == "all")) {
      temp.push(projectDetails);
      console.log("temp all", temp);
    } else {
      for (let index = 0; index < options.length; index++) {
        console.log("options len", options[index]);
        for (let index1 = 0; index1 < projects.length; index1++) {
          console.log("projects len", projects[index1]);
          if (options[index].value == projects[index1].id) {
            temp.push(projects[index1]);
          }
        }
      }
      console.log("filtered array", temp);
    }
    setfilteredProjects(temp);
    setProjectDetails(temp);
  };

  const handleTDOChange = (value, actionMeta) => {
    if (actionMeta.action == "select-option") {
      if (value.find((item) => item.value == "all")) {
        setSelectedTdofunc(alltdos.filter((item) => item.value != "all"));
        setSelectedTdo(alltdos.filter((item) => item.value != "all"));
      } else {
        setSelectedTdo(value);
        setSelectedTdofunc(value);
      }
    } else if (actionMeta.action == "clear") {
      setSelectedTdo([]);
      setSelectedTdofunc(alltdos.filter((item) => item.value != "all"));
    } else if (actionMeta.action == "remove-value") {
      setSelectedTdo(value);
      if (value.length == 0) {
        setSelectedTdofunc(alltdos.filter((item) => item.value != "all"));
      } else {
        setSelectedTdofunc(value);
      }
    }
  };

  const [show_sub_task_details, setShowSubTaskDetails] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState();
  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID)));
    dispatch(fetchProjectsbyTDOThunk(sessionStorage.getItem(USER_ID)));

    API.get("project/managers/").then((res) => {
      console.log("res", res.data.data);
      let temp = [];
      Array.from(res.data.data).forEach((manager, idx) => {
        temp.push({
          value: manager.id,
          label: manager.first_name + " " + manager.last_name,
          data: manager,
        });
        if (manager.id == sessionStorage.getItem(USER_ID)) {
          setPM({
            value: manager.id,
            label: manager.first_name + " " + manager.last_name,
            data: manager,
          });
        }
      });
      setManagers(temp);
    });
  }, []);

  React.useEffect(() => {
    API.get("project/fixronall/" + sessionStorage.getItem(USER_ID) + "/").then(
      (res) => {
        console.log("response", res.data.data);
      }
    );
  }, []);

  React.useEffect(() => {
    if (projects.length > 0 && fetchproject.length == 0) {
      setfetchproject(projects);
      optionlist(projects);
      setProjectDetails(projects);
    }
  }, [projects]);
  const mark_project_completed = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can change project status later!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willUpdate) => {
      if (willUpdate) {
        API.put("/project/change-status/" + id + "/", { status: 1 })
          .then((response) => {
            if (response.data.success == "True") {
              dispatch(
                fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID))
              );
              dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)));
              swal("Poof! Project is marked as completed", {
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
  const changePMChangeInputFieldStatus = (idx, action) => {
    switch (action) {
      case "open":
        setPM({
          value: projects[idx].project.pm.id,
          label:
            projects[idx].project.pm.first_name +
            " " +
            projects[idx].project.pm.last_name,
        });
        setStatus({ project: idx });
        break;
      case "close":
        setStatus({ project: null });
        break;
    }
  };
  const remaining_hours = (projects) => {
    let remaining_hours = 0;
    //console.log("hrs", projects)
    for (let i = 0; i < projects.length; i++) {
      remaining_hours += parseFloat(projects[i].remaining_hours);
    }
    return remaining_hours;
  };
  const can_create_wbs = (assignees) => {
    let result = false;
    assignees.forEach((item, idx) => {
      if (item.assignee.id == sessionStorage.getItem(USER_ID)) {
        result = true;
      }
    });
    return result;
  };
  const totalProjectHrs = (projects) => {
    let total_hours = 0;
    for (let i = 0; i < projects.length; i++) {
      total_hours += parseFloat(projects[i].total_hours);
    }

    return total_hours;
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
              dispatch(
                fetchProjectsForPMThunk(sessionStorage.getItem(USER_ID))
              );
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

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const fileName = "PM's project List";
  const xlData = [];
   const exportToCSV = () => {
     for (let i = 0; i < projects.length; i++) {
      
      let a=projects[i]
      for(let j=0;j<a.length;j++)
      {
        console.log("xl", a[j])
      }
  //     const item = projects[i];
  //     let subTaskNames = [];
  //     var subTaskName;
  //     Array.from(item.subtasks).map((el) => {
  //       subTaskNames.push(el.task_title);
  //     });
  //     subTaskName = subTaskNames.join(",");
  //     let assigneNames = [];
  //     var assigneName;
  //     Array.from(item.assignees).map((el) => {
  //       assigneNames.push(el.first_name + " " + el.last_name);
  //     });
  //     assigneName = assigneNames.join(",");
  //     xlData.push({
  //       "Sl. No": i + 1,
  //       TDO: item.project.task_delivery_order.title,
  //       "Work Package Number": item.project.work_package_number,
  //       "Work Package Index": item.project.work_package_index,
  //       "Project Name": item.project.sub_task,
  //       Subtasks: subTaskName,
  //       "Assignee(s)": assigneName,
  //       "Planned Value": item.project.planned_value,
  //       "Planned Hours": item.project.planned_hours,
  //       "Planned Delivery Date": item.project.planned_delivery_date,
  //     });
     }
  //   const ws = XLSX.utils.json_to_sheet(xlData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, fileName + fileExtension);
   };
  const [searchText, setSearchText] = useState("");
  const [searchResultShow, setSearchResultShow] = useState(false);
  const [result, setResult] = useState([]);

  const resize_project = (project, employee_id) => {
    let temp = {
      sub_task: project.sub_task,
      planned_delivery_date: project.planned_delivery_date,
    };
    // temp.wbs_list=[]
    Object.defineProperty(temp, "wbs_list", {
      value: [],
      writable: true,
    });
    for (let index = 0; index < project.wbs_list.length; index++) {
      if (employee_id == project.wbs_list[index].assignee_id) {
        temp.wbs_list.push(project.wbs_list[index]);
      }
    }
    return temp;
  };
  const search = (text) => {
    if (String(text).length > 0) {
      setSearchText(text);
      let result = [];
      for (let index = 0; index < projects.length; index++) {
        for (
          let index2 = 0;
          index2 < projects[index].assignees.length;
          index2++
        ) {
          if (
            String(projects[index].assignees[index2].first_name)
              .toLowerCase()
              .includes(text) ||
            String(projects[index].assignees[index2].last_name)
              .toLowerCase()
              .includes(text)
          ) {
            // result.push({'sorter':projects[index].assignees[index2].first_name,'employee':projects[index].assignees[index2],'projects':[projects[index].project]})
            let found_index = -1;
            for (let temp_index = 0; temp_index < result.length; temp_index++) {
              if (
                result[temp_index].employee.id ==
                projects[index].assignees[index2].id
              ) {
                found_index = temp_index;
              }
            }
            let temp_project = resize_project(
              projects[index].project,
              projects[index].assignees[index2].id
            );
            if (found_index != -1) {
              result[found_index].projects.push(temp_project);
            } else {
              result.push({
                sorter: projects[index].assignees[index2].first_name,
                employee: projects[index].assignees[index2],
                projects: [temp_project],
              });
            }
          }
        }
      }
      console.log(result);
      setResult(result);
      setSearchResultShow(true);
    }
  };
  const calculate_progress = (projects) => {
    //console.log("1111", projects)
    let progress = 0;
    let plannedHrs = 0;
    let remainingHrs = 0;
    for (let i = 0; i < projects.length; i++) {
      let a = projects[i].subtasks;

      for (let j = 0; j < a.length; j++) {
        //console.log('11', a[j].planned_hours)
        plannedHrs += parseFloat(a[j].planned_hours);
        remainingHrs += parseFloat(a[j].remaining_hours);
      }
    }
    progress = (remainingHrs / plannedHrs).toFixed(2);
    //console.log('111', progress)

    return progress;
  };

  function calculate_progress_in_percentage(projects) {
    let percentage = 0;
    let plannedHrs = 0;
    let remainingHrs = 0;
    for (let i = 0; i < projects.length; i++) {
      let a = projects[i].subtasks;

      for (let j = 0; j < a.length; j++) {
        //console.log('11', a[j].planned_hours)
        plannedHrs += parseFloat(a[j].planned_hours);
        remainingHrs += parseFloat(a[j].remaining_hours);
      }
    }
    percentage = parseFloat(plannedHrs) - parseFloat(remainingHrs);
    percentage = (100 * percentage) / plannedHrs;

    return percentage;
  }
  const assignees_under_tdo = (projects) => {
    let assignees = [];
    let temp = [];
    for (let i = 0; i < projects.length; i++) {
      let a = projects[i].assignees;
      for (let j = 0; j < a.length; j++) {
        console.log("a[j]", a[j]);
        temp.push(a[j]);
      }
    }
    temp = uniqBy(temp, "id");
    console.log("assignees", temp);
    //setTdoassignee(temp)
    return temp;
  };

  return (
    <>
      <SearchResult
        open={searchResultShow}
        handleClose={() => setSearchResultShow(false)}
        searchText={searchText}
        result={result}
      />
      {/* <DraggableSearchResultTab open={open} handleClose={()=>setOpen(false)} searchText={searchText} result={result}/> */}
      {/* <MatFullScreenSearchResult open={open} handleClose={()=>setOpen(false)}/> */}
      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
      {/* <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <DirectionsIcon />
            </IconButton> */}

      {selectedSubTask && (
        <CModal
          closeOnBackdrop={false}
          size="lg"
          alignment="center"
          show={show_sub_task_details}
          onClose={() => {
            setShowSubTaskDetails(!show_sub_task_details);
          }}
        >
          <CModalHeader
            onClose={() => setShowSubTaskDetails(!show_sub_task_details)}
            closeButton
          >
            <CModalTitle className="modal-title-projects">
              <span className="edit-profile-form-header">Subtask Details</span>
            </CModalTitle>
          </CModalHeader>
            <CModalBody>
              <CContainer>
                <CForm>
                  <CRow>
                    <div className="card-header-portion-ongoing">
                      <h4 className="ongoing-card-header-1">
                        {selectedSubTask != undefined
                          ? selectedSubTask.sub_task
                          : ""}
                      </h4>
                    </div>
                    <div className="justify-content-center">
                      <div className="mt-1 mb-2">
                        <CCard className="card-ongoing-project">
                          <CCardBody className="details-project-body">
                            <div className="ongoing-initial-info row">
                              <div className="tasks-done-2 col-lg-4">
                                <h6 className="tiny-header2">
                                  Work Package Index
                                </h6>
                                <h6 className="project-point-details">
                                  {selectedSubTask.work_package_index}
                                </h6>
                              </div>
                              <div className="tasks-done-2 col-lg-4">
                                <h6 className="tiny-header2">Task Title</h6>
                                <h6 className="project-point-details">
                                  {selectedSubTask.task_title}
                                </h6>
                              </div>
                              <div className="tasks-done-2 col-lg-4">
                                <h6 className="tiny-header2">PM Name</h6>
                                <h6 className="project-point-details">
                                  {selectedSubTask.pm.first_name +
                                    " " +
                                    selectedSubTask.pm.last_name}
                                </h6>
                              </div>
                              <div className="tasks-done-2 col-lg-4">
                                <h6 className="tiny-header2">
                                  Estimated Person(s)
                                </h6>
                                <h6 className="project-point-details">
                                  {selectedSubTask.estimated_person}
                                </h6>
                              </div>
                              {has_permission("projects.add_projects") && (
                              <div className="tasks-done-2 col-lg-4">
                                <h6 className="tiny-header2">Planned Value</h6>
                                <h6 className="project-point-details">
                                  {Number(
                                    parseFloat(selectedSubTask.planned_value)
                                  ).toFixed(2)}{" "}
                                </h6>
                              </div>
                            )}
                               <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">Planned Hours</h6>
                              <h6 className="project-point-details">
                                {Number(
                                  parseFloat(selectedSubTask.planned_hours)
                                ).toFixed(2)}{" "}
                              </h6>
                            </div>
                            <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">Actual Hours</h6>
                              <h6 className="project-point-details">
                                {(
                                  selectedSubTask.planned_hours -
                                  selectedSubTask.remaining_hours
                                ).toFixed(2)}{" "}
                              </h6>
                            </div>
                            <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">Remaining Hours</h6>
                              <h6 className="project-point-details">
                                {Number(
                                  parseFloat(selectedSubTask.remaining_hours)
                                ).toFixed(2)}{" "}
                              </h6>
                            </div>
                            <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">Start Date</h6>
                              <h6 className="project-point-details">
                                {selectedSubTask.start_date}{" "}
                              </h6>
                            </div>
                            <div className="tasks-done-2 col-lg-4">
                              <h6 className="tiny-header2">
                                Planned delivery date
                              </h6>
                              <h6 className="project-point-details">
                                {selectedSubTask.planned_delivery_date}{" "}
                              </h6>
                            </div>
                            <div className="tasks-done-2 col-lg-12">
                              <h6 className="tiny-header2">Task deatils</h6>
                              <h6 className="project-point-details">
                                {selectedSubTask.description == ""
                                  ? "Not available"
                                  : selectedSubTask.description}
                              </h6>
                            </div>

                            </div>
                            <div className="mt-4 mb-2">
                            <h5 className="projectName mb-3">
                              Asssignee(s)-(
                              {Array.from(selectedSubTask.assignees).length})
                            </h5>
                            <div className="file-show-ongoing-details row">
                              {selectedSubTask != undefined &&
                                Array.from(selectedSubTask.assignees).map(
                                  (item, idx) => (
                                    <div
                                      key={idx}
                                      className="col-md-4 col-sm-6 col-lg-4"
                                    >
                                      <div className="file-attached-ongoing rounded-pill">
                                        <CButton
                                          type="button"
                                          onClick={() =>
                                            delete_assignee(
                                              selectedSubTask.id,
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
                                        {item.assignee.first_name +
                                          " " +
                                          item.assignee.last_name}
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                          </CCardBody>
                        </CCard>
                      </div>
                    </div>
                  </CRow>
               {can_create_wbs(selectedSubTask.assignees) && (
                  <CRow className="justify-content-center">
                    <CButton
                      type="button"
                      className="create-wbs-from-modal"
                      onClick={() => {
                        history.push({
                          pathname: "/dashboard/WBS/create-wbs",
                          state: { task: selectedSubTask },
                        });
                        //console.log("taskkkkkkkkk", selectedSubTask)
                      }}
                    >
                      Create WBS
                    </CButton>
                  </CRow>
                )}

                </CForm>
              </CContainer>
            </CModalBody>
        </CModal>
      )}

      {/*_______CARDS FOR LIST BEGIN */}

      <div className="container">
        <div className="row">
          <div className="col-md-10 col-lg-10 col-sm-12 col-xs-12 mt-1 offset-md-1 offset-lg-1">
            
            <CRow className="dash-header justfy-content-between">
              <CCol lg="3">
                My Projects({Array.from(projectDetails).length})
              </CCol>
              {/* <CCol lg="2">
                <CustomSearch search={search} />
              </CCol> */}

              <CCol lg="7" className="mb-3 pl-4">
                <Select
                  className="custom-forminput-6"
                  placeholder="Filter by TDO"
                  options={alltdos}
                  isMulti
                  onChange={handleTDOChange}
                  value={selectedTdo}
                />
              </CCol>
              <CCol lg="2">
                <CButton
                  className="export-project-list"
                  onClick={() => exportToCSV()}
                >
                  <CIcon name="cil-spreadsheet" className="mr-2" />
                  Export to excel
                </CButton>
              </CCol>
            </CRow>
            {/* {filtered_pm_projects != undefined && ( */}
            <CRow>
              <Accordion
                allowMultipleExpanded={false}
                className="remove-acc-bg  mb-3"
                allowZeroExpanded
              >
                {Array.from(projectDetails).map((project, idx) => (
                  <AccordionItem key={idx} className="card-ongoing-project">
                    <AccordionItemHeading className="ongoing-accordion-header">
                      <AccordionItemButton>
                        <IconButton
                          aria-label="favourite"
                          disabled
                          size="medium"
                        >
                          <GradeIcon
                            fontSize="inherit"
                            className="fav-button"
                          />
                        </IconButton>
                        {console.log("details", project.projects)}

                        {String(project.title).toUpperCase()}
                        <span className="fix-action-btn-alignment">
                          <CButton
                            className="view-ongoing-details"
                            onClick={() => {
                              console.log("pro", project.projects[0]);
                              history.push({
                                pathname:
                                  "/dashboard/Projects/my-projects/subtask-details/" + 
                                  project.projects[0].project.task_delivery_order.id,
                                 state: { project: project.projects },
                              });
                            }}
                          >
                            <CIcon name="cil-list-rich" className="mr-1" />
                            View Details
                          </CButton>
                        </span>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div>
                        <h6 className="show-amount">
                          {calculate_progress(project.projects)} Hrs
                        </h6>
                        <LinearWithValueLabel
                          progress={() =>
                            calculate_progress_in_percentage(project.projects)
                          }
                        />
                      </div>
                      <div className="all-da-buttons-1">
                        {Array.from(project.projects).map((task, idx) =>
                          Array.from(task.subtasks).map((tsk, id) => (
                            <CButton
                              key={id}
                              type="button"
                              className="package-button rounded-pill"
                              onClick={() => {
                                setShowSubTaskDetails(true);
                                setSelectedSubTask(tsk);
                                console.log("data", tsk);
                              }}
                            >
                              {tsk.task_title}
                              <span className="tooltiptext">
                                {tsk.work_package_index}
                              </span>
                            </CButton>
                          ))
                        )}
                      </div>
                      <div className="all-da-workers1">
                        {/* { Array.from(TDOassignees).forEach((assignee,idx)=>{
                        <CTooltip
                        key={idx}
                        contect = {capitalize(assignee)}
                        className = "tooltiptext1"
                        > */}
                        {/* <img
                                    key={idx}
                                    className="img-fluid worker-image"
                                    src={
                                      assignee.profile_pic != null
                                        ? BASE_URL + assignee.profile_pic
                                        : "avatars/user-avatar-default.png"
                                    }
                                  /> */}
                        {/* </CTooltip>
                       })} */}
                        {/* {assignees_under_tdo(project.projects)} */}
                        {Array.from(assignees_under_tdo(project.projects)).map(
                          (assignee, idx) => {
                            <CTooltip
                              key={idx}
                              content={capitalize(
                                assignee.first_name + " " + assignee.last_name
                              )}
                              className="tooltiptext1"
                            >
                              <img
                                key={idx}
                                className="img-fluid worker-image"
                                src={
                                  assignee.profile_pic != null
                                    ? BASE_URL + assignee.profile_pic
                                    : "avatars/user-avatar-default.png"
                                }
                              />
                            </CTooltip>;
                          }
                        )}
                      </div>
                      {/*project info in text */}
                      <div className="information-show row">
                        <div className="info-show-now col-lg-6">
                          <h5 className="project-details-points">
                            <h5 className="info-header-1">
                              {/* Project Manager :{" "} */}
                            </h5>
                          </h5>
                        </div>
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </CRow>

            {/**If no projects are there */}
            {Array.from(filteredprojects).length < 1 ? (
              <CAlert className="no-value-show-alert" color="primary">
                Currently there are no projects
              </CAlert>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default MyProjects;
