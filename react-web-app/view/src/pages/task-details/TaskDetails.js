import React, { useEffect, useState } from "react";
import { CContainer, CCard, CCardBody, CButton, CCardFooter } from "@coreui/react";
import LinearWithValueLabel from '../../components/linear-progress-bar/linear-progress-bar';
import { has_permission } from "../../helper";
import { useHistory,useParams } from "react-router";
import '../ongoing-project-details-view/OngoingProjectDetailsView.css'
import CIcon from '@coreui/icons-react';
import { can_create_wbs } from '../ongoing-project-details/ongoingProjectDetails';
import { API, USER_ID } from "../../Config";

const TaskDetails = () => {
    let history = useHistory()
    const { work_package_index } = useParams()
    
    const [project, setProject] = useState()
    function calculate_progress_in_percentage(total_hours, remaining_hours) {
        let worked_hours = parseFloat(total_hours) - parseFloat(remaining_hours)
        return (100 * worked_hours) / parseFloat(total_hours)
    }
    useEffect(() => {
        console.log('mounted',work_package_index)
        API.get('project/details/' + String(work_package_index).split('.')[0] + '/').then((res) => {
            
            if (res.statusText == 'OK') {
                console.log('proj details',res.data.data)
                setProject(res.data.data)
            }
            
        }).catch(err => {
            console.log(err)
        })
    }, [])
    return (
        <>
            <CContainer>
            <div className="row">
                    <div className="col-md-11 col-sm-12 col-xs-12 mt-1 mb-2">
                        {project?.subtasks && Array.from(project.subtasks).filter(sub=>sub.work_package_index==work_package_index).map((subtask, idx) => (
                            <CCard key={idx} className="card-ongoing-project">
                            <CCardBody className="details-project-body">
                                {/*task percentage portion */}
                                <div className="ongoing-initial-info row">
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Work Package Index</h6>
                                        <h6 className="project-point-details">{subtask.work_package_index}</h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Task Title</h6>
                                        <h6 className="project-point-details">{subtask.task_title}</h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">PM Name</h6>
                                        <h6 className="project-point-details">{subtask.pm.first_name + ' ' + subtask.pm.last_name}</h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Estimated Person(s)</h6>
                                        <h6 className="project-point-details">{subtask.estimated_person}</h6>
                                    </div>
                                    {has_permission("projects.add_projects") && <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Planned Value</h6>
                                        <h6 className="project-point-details">{subtask.planned_value} </h6>
                                    </div>}
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Planned Hours</h6>
                                        <h6 className="project-point-details">{subtask.planned_hours} </h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Actual Hours</h6>
                                        <h6 className="project-point-details">{(subtask.planned_hours - subtask.remaining_hours).toFixed(1)} </h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Remaining Hours</h6>
                                        <h6 className="project-point-details">{subtask.remaining_hours} </h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Start date</h6>
                                        <h6 className="project-point-details">{subtask.start_date} </h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-4">
                                        <h6 className="tiny-header2">Planned delivery date</h6>
                                        <h6 className="project-point-details">{subtask.planned_delivery_date} </h6>
                                    </div>
                                    <div className="tasks-done-2 col-lg-12">
                                        <h6 className="tiny-header2">Task deatils</h6>
                                        <h6 className="project-point-details-2">{subtask.description == '' ? 'Not available' : subtask.description}</h6>
                                    </div>
                                </div>
                                <div>
                                    <LinearWithValueLabel progress={() => calculate_progress_in_percentage(subtask.planned_hours, subtask.remaining_hours)} />
                                </div>
                                {/**assignees */}
                                <div className="mt-4 mb-2">
                                    <h5 className="projectName mb-3">Asssignee(s)-({Array.from(subtask.assignees).length})</h5>
                                    <div className="file-show-ongoing-details row">
                                        {project != undefined && Array.from(subtask.assignees).map((item, idx) => (
                                            <div key={idx} className="col-md-4 col-sm-6 col-lg-2">
                                                <div className="file-attached-ongoing rounded-pill">
                                                    {has_permission('projects.delete_projectassignee') && has_permission('projects.change_projectassignee') && sessionStorage.getItem(USER_ID) == project.pm && <CButton type="button" onClick={() => { }} className="remove-file-ongoing"><img src={"assets/icons/icons8-close-64-blue.svg"} className="close-icon-size" /></CButton>}{item.assignee.first_name + ' ' + item.assignee.last_name}
                                                </div>
                                            </div>
                                        ))}
                                        {/* *extra static buttons,delete code after dynamic implementation */}
                                    </div>
                                </div>
                                {/**ACTION BUTTONS !!!!!!!!!! */}
                                {has_permission('projects.delete_projects') && sessionStorage.getItem(USER_ID) == project.pm && <div className="col-md-12 mt-2 mb-2">
                                    <div className="project-actions">
                                        <CButton className="edit-project-ongoing-task" onClick={() => { }} ><CIcon name="cil-pencil" className="mr-1" /> Edit </CButton>
                                        <CButton type="button" onClick={() => { }} className="delete-project-2"><CIcon name="cil-trash" className="mr-1" /> Delete</CButton>
                                    </div>
                                </div>}
                            </CCardBody>
                            <CCardFooter row>
                                {can_create_wbs(subtask.assignees) == true && <CButton type='button' className="create-wbs-from-modal float-right" size='sm' onClick={() => history.push({ pathname: '/dashboard/WBS/create-wbs', state: { task: subtask } })}>Create WBS</CButton>}
                            </CCardFooter>
                        </CCard>
                        ))}
                    </div>
                </div>
            </CContainer>
        </>
    )
}

export default TaskDetails