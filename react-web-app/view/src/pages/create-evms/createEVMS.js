import {
  CCard,
  CContainer,
  CRow,
  CCardHeader,
  CForm,
  CLabel,
  CInput,
  CButton,
  CAlert
} from "@coreui/react";
import { useHistory } from "react-router-dom";

import { BASE_URL } from '../../Config';
import React, { useState } from "react";
import Select from "react-select";
import "../createProject/createProject.css";
import { fetchProjectsThunk, fetchProjectsForPMThunk, fetchProjectsAssigneeThunk, fetchWbsThunk } from '../../store/slices/ProjectsSlice';
import { fetchEvmsThunk } from "../../store/slices/EvmsSlice";
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik';
import { API, USER_ID } from '../../Config';
import swal from 'sweetalert'
const ProjectEVMS = () => {
  let history = useHistory();
  const colourStyles = {
    // control: (styles, state) => ({ ...styles,height:"35px", fontSize: '14px !important', lineHeight: '1.42857', borderRadius: "8px",borderRadius:".25rem",color:"rgb(133,133,133)",border:state.isFocused ? '2px solid #0065ff' :'inherit'}),
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };
  const projects = useSelector(state => {
    let e = []
    Array.from(state.projects.pm_projects).forEach((item, idx) => {
      // e.push({ value: item.project.id, label: item.project.task_delivery_order.title + '/' + item.project.sub_task, data: item })
      e.push({ data: item })
    })
    console.log('e', e);
    return e

  })

  console.log("pM projects", projects);

  const evmsList = useSelector(state => {
    let f = []
    Array.from(state.evmsList.data).forEach((item, idx) => {
      f.push({ data: item })
    })
    return f

  })

  console.log('existing evms', evmsList)
  {/**get only the unique values */ }
  // const uniqueProjects = projects.filter(function(o1){
  //   return !evmsList.some(function(o2){
  //     return o1.project.id === o2.project.id
  //   })

  // })
  const uniqueProjects = projects.filter(o1 => !evmsList.some(o2 => o1.data.project.id === o2.data.project.id));
  console.log('unique projects', uniqueProjects)
  const uniqueArray = [];
  Array.from(uniqueProjects).forEach((item, idx) => {
    uniqueArray.push({ value:item.data.project.id, label: item.data.project.task_delivery_order.title + '/' + item.data.project.sub_task, data: item })

  })
  console.log('uniqueArray', uniqueArray)



  const dispatch = useDispatch();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    console.log('pm project list', projects)
  }, [projects])




  // const handleChange = (field, value) => {
  //   switch (field) {
  //     case "projects":

  //       setProjectValue(value);


  //       break;
  //     case "workPackage":
  //       setPackageValue(value);
  //       break;
  //     default:
  //       break;
  //   }
  // };
  const [projectValue, setProjectValue] = useState();


  const getAssigneeList = (option) => {

    // dispatch(fetchProjectsAssigneeThunk(option.data.project.work_package_number))
    setProjectValue(option)

    console.log('projectValue', option)
    formCreateEVMS.setValues({
      project: option.value,
      planned_hours: option.data.data.project.planned_hours,
      planned_value: option.data.data.project.planned_value,
      work_package_number: option.data.data.project.work_package_number
    })
    // formCreateEVMS.setValues(project,option.value)

    // formCreateEVMS.setFieldValue('planned_hours', option.data.data.project.planned_hours)
    // formCreateEVMS.setFieldValue('planned_value', option.data.data.project.planned_value)
    // formCreateEVMS.setFieldValue('work_package_number', option.data.data.project.work_package_number)

    // setSelectedProjectEndDate(option.planned_delivery_date)
  }

  const reset_form = () => {
    formCreateEVMS.resetForm()
    setProjectValue(null);


  }
  {/**validation stuff */ }
  const validate_evms_form = (values) => {
    console.log('validating values', values)
    const errors = {}
    if (!values.project) errors.project = "Project Selection is required"
    if (!values.earned_value) errors.earned_value = "Earned Value is required"
    if (!values.actual_cost) errors.actual_cost = "Actual Cost is required"
    if (!values.estimate_at_completion) errors.estimate_at_completion = "Estimate at completion is required"
    if (!values.estimate_to_completion) errors.estimate_to_completion = "Estimate to completion is required"
    if (!values.planned_value) errors.planned_value = "Planned Value is required"
    if (!values.planned_hours) errors.planned_hours = "Planned hours is required"
    if(!values.variance_at_completion)errors.variance_at_completion="Variance at completion is required"
    if (!values.budget_at_completion) errors.budget_at_completion = "Budget at completion is required"
    return errors
  }
  const create_evms = async () => {
    console.log('values', JSON.stringify(formCreateEVMS.values))
    API.post('evms/create/', formCreateEVMS.values).then((res) => {
      console.log(res)
      if (res.status == 200 && res.data.success == 'True') {
        reset_form()
        swal('Successfully Created!', '', 'success')
      }
      else {
        console.log("error", res)
        swal('Problem occured during creating EVMS!', '', 'warning');
      }
    })
  }
  const formCreateEVMS = useFormik({
    initialValues: {
      project: "",
      work_package_number: "",
      earned_value: "",
      actual_cost: "",
      estimate_at_completion: "",
      estimate_to_completion: "",
      planned_value: "",
      planned_hours: "",
      variance_at_completion: "",
      budget_at_completion: ""

    },

    validateOnChange: true,
    validateOnBlur: true,
    validate: validate_evms_form,
    onSubmit: create_evms
  })
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      create_evms(formCreateEVMS.values)
    }
  }
  return (
    <>
      <CContainer>

        <CRow>
          { (uniqueArray.length !=0 || evmsList.length == 0) ?(
          <div className="col-lg-10 offset-lg-1 col-md-12">
            <CCard className="custom-project-card-1">
              <CCardHeader className="project-header-3">
                {" "}
                <h4 className="section-name-projectcreate">Create EVMS</h4>
              </CCardHeader>
              <CContainer>
                <CForm className="mt-3">
                  <CRow>
                    {/**Project Name */}
                    <div className="col-lg-12 mb-3">
                      <CLabel className="custom-label-5" htmlFor="projectName">
                        Project *
                      </CLabel>
                      <Select
                        closeMenuOnSelect={true}
                        aria-labelledby="projectName"
                        id="projectName"
                        // getOptionLabel={option => option.task_delivery_order.title + " / " + option.sub_task}
                        // getOptionValue={option => option.id}
                        placeholder="Select a project"
                        isClearable={false}
                        isMulti={false}

                        // onChange={(value) => handleChange("projects", value)}
                        onChange={getAssigneeList}
                        classNamePrefix="custom-forminput-6"

                        options={uniqueArray}
                        styles={colourStyles}
                      />
                      {/**View related TDO details */}
                      {projectValue != undefined ?
                        (<div className="mt-1">
                          <CAlert color="primary">
                            <small>
                              <b>Work Package Number:</b> {projectValue.data.data.project.work_package_number}
                              <br />
                              <b>Estimated Persons: </b> {projectValue.data.data.project.estimated_person}
                              <br />
                              <b>Planned Delivery Date: </b> {projectValue.data.data.project.planned_delivery_date}
                              <br />
                              {/* <b>Assignee(s):</b><span> </span> */}


                            </small>
                          </CAlert>
                        </div>
                        ) :
                        null}
                      {/**Error show */}
                      {formCreateEVMS.errors.project && <p className="error">{formCreateEVMS.errors.project}</p>}
                    </div>
                    {/**Work package */}
                 
                    {/**Earned Value */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="earned_value">
                        Earned Value *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="earned_value" id="earned_value" type="number" min="0.00" step="0.01" value={formCreateEVMS.values.earned_value} onChange={formCreateEVMS.handleChange} required>

                      </CInput>
                      {/**Error show */}
                      {formCreateEVMS.errors.earned_value && <p className="error">{formCreateEVMS.errors.earned_value}</p>}
                    </div>
                    {/**Actual Cost */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="actual_cost">
                        Actual Cost  *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="actual_cost" id="actual_cost" type="number" min="0" step="0.1" value={formCreateEVMS.values.actual_cost} onChange={formCreateEVMS.handleChange} required />
                      {/**Error show */}
                      {formCreateEVMS.errors.actual_cost && <p className="error">{formCreateEVMS.errors.actual_cost}</p>}
                    </div>
                    {/**estimate at completion */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="estimate_at_completion">
                        Estimate at completion *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="estimate_at_completion" id="estimate_at_completion" type="number" min="0" step="0.1" value={formCreateEVMS.values.estimate_at_completion} 
                        onChange={formCreateEVMS.handleChange} required />
                      {/**error show */}
                      {formCreateEVMS.errors.estimate_at_completion && <p className="error">{formCreateEVMS.errors.estimate_at_completion}</p>}
                    </div>
                    {/**estimate to completion */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="estimate_to_completion">
                        Estimate to completion *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="estimate_to_completion" id="estimate_to_completion" type="number" min="0" step="0.1" value={formCreateEVMS.values.estimate_to_completion} onChange={formCreateEVMS.handleChange} required />
                      {/**Error show */}
                      {formCreateEVMS.errors.estimate_to_completion && <p className="error">{formCreateEVMS.errors.estimate_to_completion}</p>}
                    </div>
                    {/**Planned Value */}

                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="planned_value">
                        Planned Value
                      </CLabel>
                      <CInput className="custom-forminput-6" name="planned_value" id="planned_value" type="number" min="0" value={formCreateEVMS.values.planned_value} onChange={formCreateEVMS.handleChange} readOnly />
                      {/**Error show */}
                      {formCreateEVMS.errors.planned_value && <p className="error">{formCreateEVMS.errors.planned_value}</p>}
                    </div>
                    {/**Planned hours */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="planned_hours">
                        Planned Hours
                      </CLabel>
                      <CInput className="custom-forminput-6" name="planned_hours" id="planned_hours" type="number" min="1" value={formCreateEVMS.values.planned_hours} onChange={formCreateEVMS.handleChange} readOnly />
                      {/**Error show */}
                      {formCreateEVMS.errors.planned_hours && <p className="error">{formCreateEVMS.errors.planned_hours}</p>}
                    </div>
                    {/**variance at completion */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="variance_at_completion">
                        Variance at completion *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="variance_at_completion" id="variance_at_completion" type="number" min="0" value={Math.abs(formCreateEVMS.values.budget_at_completion - formCreateEVMS.values.estimate_at_completion)} onChange={formCreateEVMS.handleChange} readOnly />
                      {/**Error show */}
                    </div>
                    {/**budget at completion */}
                    <div className="col-lg-6 mb-3">
                      <CLabel className="custom-label-5" htmlFor="budget_at_completion">
                        Budget at completion *
                      </CLabel>
                      <CInput className="custom-forminput-6" name="budget_at_completion" id="budget_at_completion" type="number" min="0" step="0.1" value={formCreateEVMS.values.budget_at_completion} onChange={(e) => {formCreateEVMS.setFieldValue('budget_at_completion', e.target.value); formCreateEVMS.setFieldValue('variance_at_completion', Math.abs(formCreateEVMS.values.budget_at_completion - formCreateEVMS.values.estimate_at_completion))}} required />

                      {/**Error show */}
                      {formCreateEVMS.errors.budget_at_completion && <p className="error">{formCreateEVMS.errors.budget_at_completion}</p>}
                    </div>
                    {/**submit buttons */}
                    <div className="col-md-12">
                      <div className="project-form-button-holders mt-3">
                        <CButton className="create-btn-prjct create-prjct" onClick={formCreateEVMS.handleSubmit} >Create EVMS</CButton>
                        <CButton className="create-btn-prjct cancel-prjct" onClick={reset_form}>Cancel</CButton>
                      </div>
                    </div>

                  </CRow>
                </CForm>
              </CContainer>
            </CCard>
          </div>
          ):null}
          {/**if there are no evms to create */}
          {(uniqueArray.length == 0 && evmsList.length != 0)?( <div className="col-lg-10 offset-lg-1 col-md-12">
          <CAlert className="no-value-show-alert text-center" color="primary">All existing projects' EVMS has been created.
                        <div><CButton className="evms-from-create" variant="ghost" onClick={() => history.push({ pathname: '/dashboard/EVMS/view' })}>View Details</CButton> of already existing EVMS's</div>
                       </CAlert>
          </div>
          ):null}

        </CRow>
      </CContainer>
    </>
  );
};
export default ProjectEVMS;
