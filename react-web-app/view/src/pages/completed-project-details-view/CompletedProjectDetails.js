import { CCardBody, CCard, CButton, CBadge, CContainer } from "@coreui/react";
import React, { useEffect, useState } from "react";
import GradeIcon from "@material-ui/icons/Grade";
import IconButton from "@material-ui/core/IconButton";
import "../ongoing-project-details-view/OngoingProjectDetailsView.css";
import CIcon from "@coreui/icons-react";
import { useHistory, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { API, BASE_URL, USER_ID } from '../../Config';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const CompletedDetailsView = () => {
  const { work_package_number } = useParams();
  const location = useLocation();

  const [project, setProject] = useState();
  const dispatch = useDispatch()
  let history = useHistory();


 
  // console.log('project from completed page', project)

  useEffect(() => {
    API.get("project/details/"+ work_package_number +"/").then((res) => {
      if(res.statusText != 'OK'){
        history.push('/dashboard/Projects/completed-projects')
    }
    else{
      setProject(res.data.data);
    }
    
  
  
    });
    console.log('project from completed page', project)
  }, [project])
   {/**export in excel */ }
   const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
   const fileExtension = '.xlsx';
   var fileName;
   const xlData = [];
  const exportToCSV = () => {
      for (let i = 0; i < project.subtasks.length; i++) {


          const item = project.subtasks[i];
          fileName='Details of'+' '+item.sub_task;
       
          let assigneNames = [];
          var assigneName;
          Array.from(item.assignees).map((el) => {
              assigneNames.push(el.assignee.first_name + ' ' + el.assignee.last_name)
          })
          assigneName = assigneNames.join(",");

          xlData.push({'Sl. No': i+1,'TDO':item.task_delivery_order.title,'Project Name':item.sub_task,'Work Package Number':item.work_package_number,'Work Package Index':item.work_package_index,'Project Manager':item.pm.first_name+''+item.pm.last_name,'Task Title':item.task_title,'Estimated Persons':item.estimated_person,'Planned Value':project.project.planned_value,'Planned Hours':project.project.planned_hours,'Planned Delivery Date':project.project.planned_delivery_date,'Assignee(s)':assigneName})
         
      }
      const ws = XLSX.utils.json_to_sheet(xlData);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
  }
  return (
    <>
      {project != undefined &&
        <CContainer>
          <h3 className="dash-header-1">Project Details <CButton className="export-project-list" onClick={() => exportToCSV()}><CIcon name="cil-spreadsheet" className="mr-2"/>Export to excel</CButton></h3>
          <div className="card-header-portion-ongoing">
            <h4 className="ongoing-card-header-1">
              <IconButton
                aria-label="favourite"
                disabled
                size="medium"
                color="primary"
              >
                <GradeIcon fontSize="inherit" className="fav-button" />
              </IconButton>
              {project.project.task_delivery_order.title}
            </h4>
          </div>
          {/**card show */}
          <hr className="header-underline1" />
          {/**Details card */}
          <div className="row">
            <div className="col-md-11 col-sm-12 col-xs-12 mt-1 mb-2">
            {Array.from(project.subtasks).map((subtask, idx) => (
              <CCard className="card-ongoing-project" key={idx}>
                <CCardBody className="details-project-body">
                  {/*task percentage portion */}
                  <div className="ongoing-initial-info row">
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Sub Task Name</h6>
                      <h6 className="project-point-details">{project.project.sub_task}</h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">PM Name</h6>
                      <h6 className="project-point-details">{project.project.pm.first_name + ' ' + project.project.pm.last_name} </h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Work Package Number</h6>
                      <h6 className="project-point-details">{project.project.work_package_number}</h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Work Package Index</h6>
                      <h6 className="project-point-details">{project.project.work_package_index}</h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Task Title</h6>
                      <h6 className="project-point-details">
                      {subtask.task_title}
                      </h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Estimated Person(s)</h6>
                      <h6 className="project-point-details">
                      {subtask.estimated_person}
                      </h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Planned Value</h6>
                      <h6 className="project-point-details">{Number(parseFloat(project.project.planned_value)).toFixed(2)} </h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Planned Hours</h6>
                      <h6 className="project-point-details">{Number(parseFloat(project.project.planned_hours)).toFixed(2)}</h6>
                    </div>
                    <div className="tasks-done-2 col-lg-4">
                      <h6 className="tiny-header2">Remaining Hours</h6>
                      <h6 className="project-point-details">{Number(parseFloat(project.project.remaining_hours)).toFixed(2)}</h6>
                    </div>
                  </div>

                  {/**assignees */}
                  <div className="col-md-12 mt-4 mb-2">
                    <h5 className="projectName mb-3">Asssignee(s)-({Array.from(project.assignees).length})</h5>
                    <div className="file-show-ongoing-details row">
                      {project != undefined && Array.from(project.assignees).map((item, idx) => (
                        <div className="col-md-6 col-sm-6 col-lg-2" key={idx}>
                          <div className="file-attached-ongoing rounded-pill">
                            {item.first_name + ' ' + item.last_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            ))}
            </div>
          </div>
        </CContainer>}
    </>
  );
};
export default CompletedDetailsView;
