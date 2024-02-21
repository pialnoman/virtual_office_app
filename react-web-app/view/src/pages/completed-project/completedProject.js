import { CCard, CModalTitle, CCardBody, CButton, CModal, CModalHeader, CModalBody, CContainer, CForm, CRow, CAlert } from '@coreui/react';
import GradeIcon from '@material-ui/icons/Grade';
import '../ongoing-project-details/ongoingProjectDetails.css'
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
import CIcon from "@coreui/icons-react";
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../Config';
import '../my-projects/myProjects.css';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import SubTaskDetailsModal from '../../components/subtask-details-modal/SubTaskDetailsModal';
import LinearWithValueLabel from '../../components/linear-progress-bar/linear-progress-bar';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const CompleteProjects = () => {
    let historyTo = useHistory();
    const projects = useSelector(state => state.projects.data.filter((project) => project.project.status === 1))
    const remaining_hours = (remaining, total) => {
        return String(parseFloat(total) - parseFloat(remaining))
    }
    const [show_sub_task_details, setShowSubTaskDetails] = useState(false)
    const [selectedSubTask, setSelectedSubTask] = useState()
    function calculate_progress_in_percentage(total_hours, remaining_hours) {
        let worked_hours = parseFloat(total_hours) - parseFloat(remaining_hours)
        return (100 * worked_hours) / parseFloat(total_hours)
    }
     {/**export in excel */ }
     const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
     const fileExtension = '.xlsx';
     const fileName = 'Completed project(s) List';
     const xlData = [];
     const exportToCSV = () => {
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
                                        <IconButton aria-label="favourite" disabled size="medium" color="primary">
                                            <GradeIcon fontSize="inherit" className="fav-button" />
                                        </IconButton>
                                        {selectedSubTask != undefined ? selectedSubTask.task_delivery_order.title : ''}
                                    </h4>

                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 mt-1 mb-2">
                                        <CCard className="card-ongoing-project">
                                            <CCardBody className="details-project-body">
                                                <div className="ongoing-initial-info row">
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Sub Task Name</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.task_title}</h6></div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">PM Name</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.pm.first_name + ' ' + selectedSubTask.pm.last_name}</h6></div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Work Package Number</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.work_package_number}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Task Title</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.task_title}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Estimated Person(s)</h6>
                                                        <h6 className="project-point-details">{selectedSubTask.estimated_person}</h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Planned Value</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.assignees[0].project.planned_value)).toFixed(2)} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Planned Hours</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.assignees[0].project.planned_hours)).toFixed(2)} </h6>
                                                    </div>
                                                    <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Remaining Hours</h6>
                                                        <h6 className="project-point-details">{Number(parseFloat(selectedSubTask.remaining_hours)).toFixed(2)} </h6>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mt-4 mb-2">
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
                                            </CCardBody>
                                        </CCard>
                                    </div>
                                </div>
                            </CRow>
                        </CForm>
                    </CContainer>
                </CModalBody>
            </CModal>}
            {/* <SubTaskDetailsModal show={show_sub_task_details} onPressClose={setShowSubTaskDetails} selectedSubTask={selectedSubTask}/> */}
            <div className="container">
               
                <div className="row">

                    <div className="col-md-11 col-sm-12 col-xs-12 mt-1">
                    <h3 className="dash-header">Completed Projects({projects.length}) <CButton className="export-project-list" onClick={() => exportToCSV()}><CIcon name="cil-spreadsheet" className="mr-2"/>Export to excel</CButton></h3>
                        {projects != undefined && <Accordion allowMultipleExpanded={false} className="remove-acc-bg" allowZeroExpanded>
                            {projects.map((project, idx) => (
                                <AccordionItem key={idx} className="card-ongoing-project">
                                    <AccordionItemHeading className="ongoing-accordion-header">
                                        <AccordionItemButton>
                                            <IconButton aria-label="favourite" disabled size="medium" >
                                                <GradeIcon fontSize="inherit" className="fav-button" />

                                            </IconButton>{String(project.project.sub_task).toUpperCase()}

                                            <span className="fix-action-btn-alignment">
                                            <CButton className="view-ongoing-details" onClick={() => historyTo.push({ pathname: '/dashboard/Projects/completed-projects/details/' + project.project.work_package_number, state: { project: project } })}><CIcon name="cil-list-rich" className="mr-1" />View Details</CButton>
                                            </span>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel>
                                        {/*task percentage portion */}
                                        <div>
                                            <h6 className="show-amount">{remaining_hours(project.project.remaining_hours, project.project.planned_hours)}/{parseInt(project.project.planned_hours)} Hrs</h6>
                                            <LinearWithValueLabel progress={calculate_progress_in_percentage(project.project.planned_hours, project.project.remaining_hours)} />
                                        </div>

                                        {/*Project category buttons */}
                                        <div className="all-da-buttons-1">
                                            {Array.from(project.subtasks).length > 0 && Array.from(project.subtasks).map((task, idx) => (
                                                <CButton className="package-button rounded-pill" type="button" onClick={() => { setShowSubTaskDetails(true); setSelectedSubTask(task); console.log('task', task) }}>
                                                    {task.task_title}
                                                    <span className="tooltiptext">{task.work_package_index}</span>
                                                </CButton>
                                            ))}
                                        </div>
                                        {/*Project participants */}
                                        <div className="all-da-workers1">
                                            {project.assignees.length > 0 && Array.from(project.assignees).map((assignee, idx) => (
                                                <img className="img-fluid worker-image" src={assignee.profile_pic != null ? BASE_URL + assignee.profile_pic : 'avatars/user-avatar-default.png'} />
                                            ))}
                                        </div>
                                        {/*project info in text */}
                                        <div className="information-show row">
                                            <div className="info-show-now col-md-6">
                                                <h5 className="project-details-points child"><h5 className="info-header-1">Assigned by :</h5>{project.project.pm.first_name + ' ' + project.project.pm.last_name}</h5>
                                                <h5 className="project-details-points"><h5 className="info-header-1">Project Manager : </h5>{project.project.pm.first_name + ' ' + project.project.pm.last_name}</h5>
                                            </div>
                                            <div className="info-show-now col-md-6">
                                                <h5 className="project-details-points child"><h5 className="info-header-1">Start Date : </h5>{project.project.date_created}</h5>

                                                <h5 className="project-details-points"><h5 className="info-header-1">Planned Delivery Date : </h5>{project.project.planned_delivery_date}</h5>
                                            </div>
                                        </div>

                                    </AccordionItemPanel>
                                </AccordionItem>
                            ))}

                        </Accordion>
                        }

                        
                        {/**If no projects are there */}
                        {projects == '' ? (



                            <CAlert className="no-value-show-alert" color="primary">Currently there are no completed projects</CAlert>


                        ) : null


                        }
                    </div>
                </div>
            </div>

        </>
    )
}
export default CompleteProjects;