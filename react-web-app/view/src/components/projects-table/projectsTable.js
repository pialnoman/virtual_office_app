import React, { useEffect } from 'react';
import './projectsTable.css';
import { CButton, CCard, CCardBody, CAlert, CRow, CCol } from '@coreui/react';
import { useDispatch, useSelector } from "react-redux";
// import { fetchProjectsThunk } from "../../store/slices/ProjectsSlice";
// import { USER_ID } from "../../Config";
import { useHistory } from "react-router-dom";


const ProjectsTableDashboard = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    const projects = useSelector(state => state.projects.data);
    useEffect(() => {
        console.log("ProjectsList", projects)
    }, [projects])
    return (
        <>
            <div className="main-holder-projects">
                <h3 className="projectsHeader">
                    Assigned Project({projects.length})
                </h3>

                <div className="card-holder1">
                    {projects != undefined && Array.from(projects).slice(0, 3).map((item, idx) => (
                        <CCard className="project-card1" key={idx} onClick={() => history.push({ pathname: 'dashboard/Projects/assigned-projects/details/' + item.project.work_package_number + '/' })}>
                            <CCardBody>
                                {/* <h6 className="id-no1">Work Package Number: # {item.project.work_package_number}</h6> */}
                                <h5 className="card-details1"><span className="p-header-3">Project Name: </span> {item.project.sub_task}</h5>
                                <h5 className="card-details1"><span className="p-header-3">Planned Hours: </span> {Number(parseFloat(item.project.planned_hours)).toFixed(2)}</h5>
                                <h5 className="card-details1"><span className="p-header-3">Remaining Hours: </span> {Number(parseFloat(item.project.remaining_hours)).toFixed(2)}</h5>
                                <h5 className="card-details1"><span className="p-header-3">Planned Delivery Date : </span>{item.project.planned_delivery_date}</h5>
                            </CCardBody>
                        </CCard>
                    ))}
                    { /**If no projects */}
                    {projects == '' || projects == undefined ? (
                        <CAlert className="no-value-show-alert" color="primary">Currently there are no projects assigned to you</CAlert>
                    ) : null
                    }
                </div>
                {projects != undefined && <CRow className="button-holder3">
                    <CCol className="p-header-3 col-md-9 mt-2">
                       
                    </CCol>

                    <CCol className="col-md-3">
                    <CButton className="tiny-buttons1" onClick={() => history.push({ pathname: '/dashboard/Projects/assigned-projects' })}>View all</CButton>
                    </CCol>
                    </CRow>}


            </div>
        </>
    )
}
export default ProjectsTableDashboard;
