import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import GradeIcon from '@material-ui/icons/Grade';
import { CAlert, CCard, CCardBody, CButton, CModal, CModalHeader, CModalBody, CContainer, CForm, CRow, CLabel, CInput, CModalTitle } from '@coreui/react';
const SubTaskDetailsModal =(props)=>{
    return(
        <>
        {props.selectedSubTask && <CModal closeOnBackdrop={false} alignment="center" show={props.show} onClose={() => props.onPressClose()}>
                <CModalHeader onClose={() => props.onPressClose(!props.show)} closeButton>
                    <CModalTitle className="modal-title-projects">
                        <span className="edit-profile-form-header">Subtask Details</span>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CContainer>
                        <CForm>
                            <div className="card-header-portion-ongoing">
                                <h4 className="ongoing-card-header-1">
                                    <IconButton aria-label="favourite" disabled size="medium" color="primary">
                                        <GradeIcon fontSize="inherit" className="fav-button" />
                                    </IconButton>
                                    {props.selectedSubTask != undefined ? props.selectedSubTask.task_delivery_order.title : ''}
                                </h4>
                            
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 mt-1 mb-2">
                                    <CCard className="card-ongoing-project">
                                        <CCardBody className="details-project-body">
                                            <div className="ongoing-initial-info row">
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Sub Task Name</h6>
                                                    <h6 className="project-point-details">{props.selectedSubTask.task_title}</h6></div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">PM Name</h6>
                                                    <h6 className="project-point-details">{props.selectedSubTask.pm.first_name + ' ' + props.selectedSubTask.pm.last_name}</h6></div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Work Package Number</h6>
                                                    <h6 className="project-point-details">{props.selectedSubTask.work_package_number}</h6>
                                                </div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Task Title</h6>
                                                    <h6 className="project-point-details">{props.selectedSubTask.task_title}</h6>
                                                </div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Estimated Person(s)</h6>
                                                    <h6 className="project-point-details">{props.selectedSubTask.estimated_person}</h6>
                                                </div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Planned Value</h6>
                                                    <h6 className="project-point-details">{Number(parseFloat(props.selectedSubTask.planned_value)).toFixed(2)} </h6>
                                                </div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Planned Hours</h6>
                                                    <h6 className="project-point-details">{Number(parseFloat(props.selectedSubTask.planned_hours)).toFixed(2)} </h6>
                                                </div>
                                                <div className="tasks-done-2 col-lg-4"><h6 className="tiny-header2">Remaining Hours</h6>
                                                    <h6 className="project-point-details">{Number(parseFloat(props.selectedSubTask.remaining_hours)).toFixed(2)} </h6>
                                                </div>
                                            </div>

                                            <div className="col-md-12 mt-4 mb-2">
                                                <h5 className="projectName mb-3">Asssignee(s)-({Array.from(props.selectedSubTask.assignees).length})</h5>
                                                <div className="file-show-ongoing-details row">
                                                    {props.selectedSubTask != undefined && Array.from(props.selectedSubTask.assignees).map((item, idx) => (
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
                        </CForm>
                    </CContainer>
                </CModalBody>
            </CModal>}
        </>
    )
}

export default SubTaskDetailsModal