import { React, useEffect, useState } from 'react';
import './ongoingProjectDetails.css'
import { CTooltip, CAlert, CCard, CCardBody, CButton, CModal, CModalHeader, CModalBody, CContainer, CForm, CRow, CCol, CInput, CModalTitle } from '@coreui/react';
import GradeIcon from '@material-ui/icons/Grade';
import IconButton from '@material-ui/core/IconButton';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, USER_ID } from '../../Config';
import { API } from '../../Config';
import swal from 'sweetalert'
import { fetchProjectsThunk } from '../../store/slices/ProjectsSlice';
import SearchIcon from '@mui/icons-material/Search';
import { has_permission } from '../../helper';
// import '../my-projects/myProjects.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { capitalize } from '../../helper';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import LinearWithValueLabel from '../../components/linear-progress-bar/linear-progress-bar';
import { Grid } from '@mui/material';
import CustomSearch from '../../components/CustomSearch/CustomSearch';

export const can_create_wbs=(assignees)=>{
    let result=false
    assignees.forEach((item,idx)=>{
        if(item.assignee.id == sessionStorage.getItem(USER_ID)){
            result=true
        }
    })
    return result
}

const OngoingProjectDetails = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    
    const [pmStatus, setPmStatus] = useState(1);
    const [status, setStatus] = useState(0);
    const radioHandler = (status, pmStatus) => {
        setStatus(status);
        setPmStatus(pmStatus);
    };
    const [showTaskForm, setShowTaskForm] = useState(false);
    //const projects=useSelector(state=> state.projects.data.filter((item)=> project.project.status === 0))
    const projects = useSelector(state => {
        let temp = []
        state.projects.data.forEach((item, idx) => {
            if (item.project.status == 0) {
                temp.push(item)
            }
        })

        console.log('temp', temp)

        return temp;

    })

    const toggleTaskForm = () => {
        setShowTaskForm(!showTaskForm);
    };
    const closeForm = () => {
        setShowTaskForm(false)
    }
    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: 'rgba(238, 232, 250, 0.5)', border: '1px solid #EEE8FA', borderRadius: "8px", minHeight: "60px", boxShadow: "inset 0px 4px 20px rgba(189, 158, 251, 0.1)", fontSize: "16px", lineHeight: "24px" }),
    }
    const [visible, setVisible] = useState(false);

    const animatedComponents = makeAnimated();
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log('projects', projects);
        dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)))
    }, [])

    const mark_project_completed = (id) => {
        swal({
            title: "Are you sure?",
            text: "You can change project status later!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willUpdate) => {
                if (willUpdate) {
                    API.put('/project/change-status/' + id + "/", { status: 1 }).then(response => {
                        if (response.data.success == "True") {
                            dispatch(fetchProjectsThunk(sessionStorage.getItem(USER_ID)))
                            swal("Poof! Project is marked as completed", {
                                icon: "success",
                            });

                        }
                        else if (response.data.success == "False") {
                            swal("Poof!" + response.data.message, {
                                icon: "error",
                            });
                        }

                    }).catch(error => {
                        //swal("Failed!",error,"error");
                    })

                }
            });
    }
    const [show_sub_task_details, setShowSubTaskDetails] = useState(false)
    const [selectedSubTask, setSelectedSubTask] = useState()
    const worked_hours = (remaining, total) => {
        return String(parseFloat(total) - parseFloat(remaining))
    }
    const remaining_hours = (projects) => {
        let remaining_hours = 0;
        projects.forEach(item => {
            console.log(item.remaining_hours)
            remaining_hours += parseFloat(item.remaining_hours);
        })
        return remaining_hours;
    }
    function totalProjectHrs(projects) {
        let total_hours = 0;
        projects.forEach(item => {
            console.log(item.planned_hours)
            total_hours += parseFloat(item.planned_hours);
        })
        return total_hours;
    }
    function calculate_progress_in_percentage(total_hours, remaining_hours) {
        let worked_hours = parseFloat(total_hours) - parseFloat(remaining_hours)
        return (100 * worked_hours) / parseFloat(total_hours)
    }

    const dateOver = (endDate) => {
        let today = new Date ()
        const moment = require("moment");
        let daysleft =  moment(endDate).diff(moment(today), "days");
        console.log("days left ", daysleft) 


    }
    {/**export in excel */ }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'Assigned project List';
    const xlData = [];
    const exportToCSV = () => {
        console.log("date", selectedSubTask.planned_delivery_date)
        for (let i = 0; i < projects.length; i++) {
            const item = projects[i];
            let subTaskNames = [];
            var subTaskName;
            Array.from(item.subtasks).map((el) => {
                subTaskNames.push(el.task_title)
            })
            subTaskName = subTaskNames.join(",");
            let assigneNames = [];
            var assigneName;
            Array.from(item.assignees).map((el) => {
                assigneNames.push(el.first_name + ' ' + el.last_name)
            })
            assigneName = assigneNames.join(",");
            xlData.push({ 'Sl. No': i + 1, 'TDO': item.project.task_delivery_order.title, 'Work Package Number': item.project.work_package_number, 'Work Package Index': item.project.work_package_index, 'Project Name': item.project.sub_task, 'Subtasks': subTaskName, 'Assignee(s)': assigneName, 'Planned Value': item.project.planned_value, 'Planned Hours': item.project.planned_hours, 'Planned Delivery Date': item.project.planned_delivery_date })
        }
        const ws = XLSX.utils.json_to_sheet(xlData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    
   
    return (
        <>
            {/* <MatResult open={open} handleClose={()=>setOpen(false)} searchText={searchText} result={result}/> */}
                {/* <DraggableSearchResultTab open={open} handleClose={()=>setOpen(false)} searchText={searchText} result={result}/> */}
                {/* <MatFullScreenSearchResult open={open} handleClose={()=>setOpen(false)}/> */}
                {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
                {/* <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <DirectionsIcon />
            </IconButton> */}
            {selectedSubTask && <CModal closeOnBackdrop={false} size="lg" alignment="center" show={show_sub_task_details} onClose={() => { setShowSubTaskDetails(!show_sub_task_details) }}>
                <CModalHeader onClose={() => setShowSubTaskDetails(!show_sub_task_details)} closeButton>
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
                                        {/* <IconButton aria-label="favourite" disabled size="medium" color="primary">
                                            <GradeIcon fontSize="inherit" className="fav-button" />
                                        </IconButton> */}
                                        {selectedSubTask != undefined ? selectedSubTask.sub_task : ''}
                                    </h4>

                                </div>
                                <div className="row justify-content-center">
                                    <div className="">
                                        <CCard className="card-ongoing-project">
                                            <CCardBody className="details-project-body">
                                                <div className="ongoing-initial-info row">
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Work Package Index</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.work_package_index}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Task Title</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.task_title}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">PM Name</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.pm.first_name + ' ' + selectedSubTask.pm.last_name}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Estimated Person(s)</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.estimated_person}</h6>
                                                    </div>
                                                    {has_permission("projects.add_projects") && <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Planned Value</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.planned_value)).toFixed(2)} </h6>
                                                    </div>}
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Planned Hours</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.planned_hours)).toFixed(2)} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Actual Hours</h6>
                                                        <h6 className="project-point-details">{(selectedSubTask.planned_hours - selectedSubTask.remaining_hours).toFixed(2)} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Remaining Hours</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.remaining_hours)).toFixed(2)} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Start Date</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.start_date} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4">
                                                        <h6 className="tiny-header2">Planned delivery Date</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.planned_delivery_date} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-12">
                                                        <h6 className="tiny-header2">Task Deatils</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.description == '' ? 'Not available' : selectedSubTask.description}</h6>
                                                    </div>
                                                </div>

                                                <div className="mt-4 mb-2">
                                                    <h5 className="projectName mb-3">Asssignee(s)-({Array.from(selectedSubTask.assignees).length})</h5>
                                                    <div className="file-show-ongoing-details row">
                                                        {selectedSubTask != undefined && Array.from(selectedSubTask.assignees).map((item, idx) => (
                                                            <div key={idx} className="col-md-4 col-sm-6 col-lg-4">
                                                                <div className="file-attached-ongoing rounded-pill">
                                                                    {item.assignee.first_name + ' ' + item.assignee.last_name}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-12 mt-2 mb-2">
                                                    <div className="project-actions">
                                                        <CButton className="edit-project-ongoing-task" onClick={() => editInfoForm(subtask)} ><CIcon name="cil-pencil" className="mr-1" /> Edit </CButton>
                                                        <CButton type="button" onClick={() => delete_subtask(subtask.work_package_index)} className="delete-project-2"><CIcon name="cil-trash" className="mr-1" /> Delete</CButton>
                                                    </div>
                                                </div> */}
                                            </CCardBody>
                                        </CCard>
                                    </div>
                                </div>
                            </CRow>
                            {/**forward to wbs button  */}
                            {can_create_wbs(selectedSubTask.assignees)==true && <CRow className="justify-content-center">
                                {dateOver(selectedSubTask.planned_delivery_date)}
                                <CButton type='button' className="create-wbs-from-modal" onClick={() => history.push({ pathname: '/dashboard/WBS/create-wbs',state:{task:selectedSubTask} })}>Create WBS</CButton>
                            </CRow>}
                        </CForm>
                    </CContainer>
                </CModalBody>
            </CModal>}
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        {/* <CRow className="mb-3">
                            <CCol>
                                <CInput style={{width:'400px'}}/>
                            </CCol>
                        </CRow> */}
                        <h4 className="dash-header">Assigned Projects ({Array.from(projects).length}) <CButton className="export-project-list" onClick={() => exportToCSV()}><CIcon name="cil-spreadsheet" className="mr-2" />Export to excel</CButton><CustomSearch/></h4>
                    
                        {projects != undefined &&
                            <Accordion allowMultipleExpanded={false} className="remove-acc-bg" allowZeroExpanded>
                                {Array.from(projects).map((project, idx) => (
                                    <AccordionItem key={idx} className="card-ongoing-project">
                                        <AccordionItemHeading className="ongoing-accordion-header">
                                            <AccordionItemButton>

                                                <IconButton aria-label="favourite" disabled size="medium" >
                                                    <GradeIcon fontSize="inherit" className="fav-button" />
                                                </IconButton>{String(project.project.task_delivery_order.title).toUpperCase()+' / '+String(project.project.sub_task).toUpperCase()}
                                                {/**action buttons */}
                                                <span className="fix-action-btn-alignment">
                                                    <CButton className="view-ongoing-details" onClick={() => history.push({ pathname: '/dashboard/Projects/assigned-projects/details/' + project.project.work_package_number, state: { project: project } })}><CIcon name="cil-list-rich" className="mr-1" />View Details</CButton>
                                                    {has_permission('projects.change_projects') && sessionStorage.getItem(USER_ID) == project.project.pm.id && <CButton type="button" onClick={() => { mark_project_completed(project.project.work_package_number) }} className="mark-ongoing-completed"><CIcon name="cil-check-alt" className="mr-1" />Mark as Completed</CButton>}
                                                </span>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            {/* <hr className="header-underline1" /> */}
                                            {/*task percentage portion */}
                                            <div>
                                                <h6 className="show-amount">{remaining_hours(project.subtasks).toFixed(2)}/{totalProjectHrs(project.subtasks).toFixed(2)} Hrs</h6>
                                                <LinearWithValueLabel progress={() => calculate_progress_in_percentage(totalProjectHrs(project.subtasks), remaining_hours(project.subtasks))} />
                                            </div>
                                            {/*Project category buttons */}
                                            <div className="all-da-buttons-1">

                                                {Array.from(project.subtasks).length > 0 && Array.from(project.subtasks).map((task, idx) => (
                                                    <CButton key={idx} type="button" className="package-button rounded-pill" onClick={() => { setShowSubTaskDetails(true); setSelectedSubTask(task); console.log('task', task) }}>
                                                        {task.task_title}
                                                        <span className="tooltiptext">{task.work_package_index}</span>
                                                    </CButton>
                                                ))}
                                            </div>
                                            {/*Project participants */}
                                            <div className="all-da-workers1">
                                                {project.assignees.length > 0 && Array.from(project.assignees).map((assignee, idx) => (
                                                    <CTooltip content={capitalize(assignee.first_name + ' ' + assignee.last_name)} className="tooltiptext1">
                                                        <img key={idx} className="img-fluid worker-image" src={assignee.profile_pic != null ? BASE_URL + assignee.profile_pic : 'avatars/user-avatar-default.png'} />
                                                        {/* <span className="tooltiptext1">{capitalize(assignee.first_name + ' ' + assignee.last_name)}</span> */}
                                                    </CTooltip>
                                                ))}
                                            </div>
                                            {/*project info in text */}
                                            <div className="information-show row">
                                                {/* <div className="info-show-now col-lg-6">
                                                    <h5 className="project-details-points child"><h5 className="info-header-1">Assigned by :</h5>{project.project.pm.first_name + ' ' + project.project.pm.last_name}</h5>
                                                </div> */}
                                                <div className="info-show-now col-lg-6">
                                                    <h5 className="project-details-points"><h5 className="info-header-1">Project Manager : </h5>{project.project.pm.first_name + ' ' + project.project.pm.last_name}    </h5>
                                                </div>
                                                {/* <div className="info-show-now col-lg-6">
                                                    <h5 className="project-details-points child"><h5 className="info-header-1">Planned delivery date :</h5>{project.project.planned_delivery_date}</h5>
                                                </div> */}
                                                {/* <div className="info-show-now col-lg-6"> */}
                                                {/* <h5 className="project-details-points"><h5 className="info-header-1">Project Details :</h5>Design and develop the app for the seller and buyer module</h5> */}
                                                {/* <h5 className="project-details-points child"><h5 className="info-header-1">Start Date : </h5>{project.project.date_created}</h5>

                                                    <h5 className="project-details-points"><h5 className="info-header-1">Planned Delivery Date : </h5>{project.project.planned_delivery_date}</h5>
                                                </div> */}
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        }
                        {/**If no projects are there */}
                        {Array.from(projects).length < 1 ? (
                            <CAlert className="no-value-show-alert" color="primary">Currently there are no ongoing projects</CAlert>
                        ) : null}
                    </div>
                    {/**Dummy cards for viewing design */}

                    {/**Dummy card,REMOVE AFTER DYNAMIC DATA LOAD */}

                </div>
            </div>

        </>
    )
}

export default OngoingProjectDetails;