import { CCard, CCardBody, CContainer, CRow, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CForm, CCol, CLabel, CInput, CAlert } from '@coreui/react';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { useHistory } from "react-router-dom";
import GradeIcon from '@material-ui/icons/Grade';
import IconButton from '@material-ui/core/IconButton';
import './evmsView.css';
import { API, BASE_URL, USER_ID } from "../../Config";
import { CChart, CChartLine } from '@coreui/react-chartjs';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { fetchEvmsThunk } from '../../store/slices/EvmsSlice';
import swal from 'sweetalert';

const ViewEvms = () => {
    const [visible, setVisible] = useState(false);
    const [evmsId, setEvmsId] = useState('');
    const [projectValue, setProjectValue] = useState('');
    const dispatch = useDispatch();
    let history = useHistory();
    const evmsList = useSelector(state => state.evmsList.data)

    const editEVMSForm = (item) => {
        setVisible(!visible);
        setProjectValue(item?.project.sub_task);
        setEvmsId(item?.id);
        evms_update_form.setValues({
            id: item?.id,
            project: item?.project.id,
            planned_hours: item?.project.planned_hours,
            planned_value: item?.project.planned_value,
            earned_value: item?.earned_value,
            actual_cost: item?.actual_cost,
            estimate_at_completion: item?.estimate_at_completion,
            estimate_to_completion: item?.estimate_to_completion,
            variance_at_completion: item?.variance_at_completion,
            budget_at_completion: item?.budget_at_completion,

        })


    }

    const validate_evms_update = (values) => {
        const errors = {}
        if (!values.planned_value) errors.planned_value = "Planned Value is required"
        if (!values.planned_hours) errors.planned_hours = "Planned hours is required"
        if (!values.earned_value) errors.earned_value = "Earned value is required"
        if (!values.actual_cost) errors.actual_cost = "Actual cost is required"
        if (!values.estimate_at_completion) errors.estimate_at_completion = "Estimate at completion is required"
        if (!values.estimate_to_completion) errors.estimate_to_completion = "Estimate to completion is required"
        if (!values.variance_at_completion) errors.variance_at_completion = "Variance at completion is required"
        if (!values.budget_at_completion) errors.budget_at_completion = "Budget at completion required"
        return errors;
    }

    const updateEvms = (values) => {
        API.put('evms/update/' + values.id + '/', values).then((res) => {
            console.log(res)
            if (res.status == 200 && res.data.success == 'True') {
                dispatch(fetchEvmsThunk(sessionStorage.getItem(USER_ID)))
                setVisible(false)
                swal('EVMS has been updated!', '', 'success')
            }
            else {
                swal('Error', 'There was a problem updating', 'warning')
            }
        })
    }

    const evms_update_form = useFormik({
        initialValues: {
            id: "",
            project: "",
            planned_value: "",
            planned_hours: "",
            earned_value: "",
            actual_cost: "",
            estimate_at_completion: "",
            estimate_to_completion: "",
            variance_at_completion: "",
            budget_at_completion: ""

        },
        validateOnBlur: true,
        validateOnChange: true,
        validate: validate_evms_update,
        onSubmit: updateEvms
    })

    useEffect(() => {
        console.log('evmsList', evmsList)
    }, [evmsList])

    {/**EVMS EDIT FORM FUNCTIONALITY */ }

    return (
        <>
            {/**display all evms */}
            <CContainer>
                {/**modal to edit evms */}
                <CModal closeOnBackdrop={false} alignment="center" show={visible} onClose={editEVMSForm}>
                    <CModalHeader onClose={() => setVisible(!visible)} closeButton>  <CModalTitle className="modal-title">
                        <span className="edit-profile-form-header">
                            Edit EVMS Info
                        </span>
                    </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CForm>
                                <CRow>
                                    {/**Project Name */}
                                    <CCol lg="12" md="12" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="project">
                                            Project Name
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="project" id="project" value={projectValue} readOnly />
                                    </CCol>
                                    {/**Work package */}
                                    {/* <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="wPackage">
                                            Work Package
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="wPackage" id="wPackage" readOnly />
                                    </CCol> */}
                                    {/**Planned Value */}
                                    <CCol className="mb-2" g="6" md="6" sm="12">
                                        <CLabel className="custom-label-5" htmlFor="planned_value">
                                            Planned Value
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="planned_value" id="planned_value" value={evms_update_form.values.planned_value} onChange={evms_update_form.handleChange} type="number" min="1" required readOnly />
                                        {/**Error validation */}
                                        {evms_update_form.errors.planned_value && <p className="error">{evms_update_form.errors.planned_value}</p>}
                                    </CCol>
                                    {/**Planned hours */}
                                    <CCol className="mb-2" g="6" md="6" sm="12">
                                        <CLabel className="custom-label-5" htmlFor="planned_hours">
                                            Planned Hours
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="planned_hours" id="planned_hours" value={evms_update_form.values.planned_hours} onChange={evms_update_form.handleChange} type="number" min="0" required readOnly />
                                        {/**Error validation */}
                                        {evms_update_form.errors.planned_hours && <p className="error">{evms_update_form.errors.planned_hours}</p>}
                                    </CCol>
                                    {/**Earned Value */}
                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="earned_value">
                                            Earned Value
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="earned_value" id="earned_value" value={evms_update_form.values.earned_value} onChange={evms_update_form.handleChange} required type="number" min="0" />
                                        {/**Error validation */}
                                        {evms_update_form.errors.earned_value && <p className="error">{evms_update_form.errors.earned_value}</p>}
                                    </CCol>
                                    {/**Actual Cost */}
                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="actual_cost">
                                            Actual Cost
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="actual_cost" id="actual_cost" value={evms_update_form.values.actual_cost} onChange={evms_update_form.handleChange} type="number" min="0" required />
                                        {/**Error validation */}
                                        {evms_update_form.errors.actual_cost && <p className="error">{evms_update_form.errors.actual_cost}</p>}
                                    </CCol>
                                    {/**estimate at completion */}
                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="estimate_at_completion">
                                            Estimate at completion
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="estimate_at_completion" id="estimate_at_completion" type="number" min="1" value={evms_update_form.values.estimate_at_completion} onChange={evms_update_form.handleChange} required />
                                        {/**Error validation */}
                                        {evms_update_form.errors.estimate_at_completion && <p className="error">{evms_update_form.errors.estimate_at_completion}</p>}
                                    </CCol>

                                    {/**estimate to completion */}
                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="estimate_to_completion">
                                            Estimate to completion
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="estimate_to_completion" id="estimate_to_completion" type="number" min="1" value={evms_update_form.values.estimate_to_completion} onChange={evms_update_form.handleChange} required />
                                        {/**Error validation */}
                                        {evms_update_form.errors.estimate_to_completion && <p className="error">{evms_update_form.errors.estimate_to_completion}</p>}
                                    </CCol>
                                    {/**variance at completion */}

                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="variance_at_completion">
                                            Variance at completion
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="variance_at_completion" id="variance_at_completion" type="number" min="0" value={Math.abs(evms_update_form.values.budget_at_completion - evms_update_form.values.estimate_at_completion)} onChange={evms_update_form.handleChange} readOnly />

                                    </CCol>
                                    {/**budget at completion */}

                                    <CCol lg="6" md="6" sm="12" className="mb-2">
                                        <CLabel className="custom-label-5" htmlFor="budget_at_completion">
                                            Budget at completion
                                        </CLabel>
                                        <CInput className="custom-forminput-6" name="budget_at_completion" id="budget_at_completion" type="number" value={evms_update_form.values.budget_at_completion} onChange={evms_update_form.handleChange} required />
                                        {/**Error validation */}
                                        {evms_update_form.errors.budget_at_completion && <p className="error">{evms_update_form.errors.budget_at_completion}</p>}
                                    </CCol>
                                    {/**submit buttons */}
                                    <CCol md="12">
                                        <div className="project-form-button-holders mt-3">
                                            <CButton className="profile-form-btn update-profile" onClick={evms_update_form.handleSubmit}>
                                                Update Info
                                            </CButton>
                                            <CButton className="profile-form-btn cancel-update" onClick={() => setVisible(!visible)} type="reset">
                                                Cancel
                                            </CButton>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CContainer>
                    </CModalBody>
                </CModal>
                <h4 className="dash-header mb-3">EVMS View</h4>
                <CRow>
                    <div className="col-md-12 col-sm-12 col-xs-12 mt-1">
                        {evmsList != undefined && Array.from(evmsList).map((item, idx) => (
                            <CCard className="card-ongoing-project" key={idx}>
                                <CCardBody className="details-project-body">
                                    <div className="card-header-portion-ongoing">
                                        <h4 className="ongoing-card-header-1"><IconButton aria-label="favourite" disabled size="medium" color="primary">
                                            <GradeIcon fontSize="inherit" className="fav-button" />
                                        </IconButton>{item.project.task_delivery_order.title + ' / ' + item.project.sub_task}</h4>
                                        <div className="action-button-holders--2">
                                            <CButton className="edit-project-on" onClick={() => editEVMSForm(item)}><CIcon name="cil-pencil" className="mr-1" /> Edit</CButton>
                                            <CButton className="view-ongoing-details" onClick={() => history.push({ pathname: '/dashboard/EVMS/details/' })} ><CIcon name="cil-list-rich" className="mr-1" />View Details</CButton>
                                        </div>
                                    </div>
                                    <hr className="header-underline1" />
                                    <div className="row">
                                        {/**graph view */}
                                        <div className="col-lg-6 col-md-12">
                                            <CChart
                                                type="line"
                                                datasets={[
                                                    {
                                                        label: 'Time',
                                                        backgroundColor: 'rgba(179,181,198,0.2)',
                                                        borderColor: 'rgba(179,181,198,1)',
                                                        pointBackgroundColor: 'rgba(179,181,198,1)',
                                                        pointBorderColor: '#fff',
                                                        pointHoverBackgroundColor: '#fff',
                                                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                                                        tooltipLabelColor: 'rgba(179,181,198,1)',
                                                        data: [65, 59, 900, 81, 560, 55, 1000]
                                                    },
                                                    {
                                                        label: 'Cost',
                                                        backgroundColor: 'rgba(255,99,132,0.2)',
                                                        borderColor: 'rgba(255,99,132,1)',
                                                        pointBackgroundColor: 'rgba(255,99,132,1)',
                                                        pointBorderColor: '#fff',
                                                        pointHoverBackgroundColor: '#fff',
                                                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                                                        tooltipLabelColor: 'rgba(255,99,132,1)',
                                                        data: [28, 48, 40, 19, 96, 27, 10]
                                                    }
                                                ]}
                                                options={{
                                                    aspectRatio: 1.5,
                                                    tooltips: {
                                                        enabled: true
                                                    }
                                                }}
                                            // labels={[
                                            //   'Eating', 'Drinking', 'Sleeping', 'Designing',
                                            //   'Coding', 'Cycling', 'Running'
                                            // ]}
                                            />
                                        </div>
                                        {/**Text details */}
                                        <div className="col-lg-5 offset-lg-1 col-md-12 mt-3">
                                            <h5 className="evms-info-view child"><span className="info-header--evms">work package : </span>{item.work_package_number}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">earned value: </span>{item.earned_value}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">actual cost : </span>{item.actual_cost}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">planned value : </span>{item.project.planned_value}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">planned hours : </span>{item.project.planned_hours}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">estimate at completion : </span>{item.estimate_at_completion}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">estimation to completion : </span>{item.estimate_to_completion}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">variance at completion : </span>{Math.abs(item?.budget_at_completion - item?.estimate_at_completion)}</h5>

                                            <h5 className="evms-info-view child"><span className="info-header--evms">budget at completion : </span>{item.budget_at_completion}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">date created : </span>{item.date_created}</h5>
                                            <h5 className="evms-info-view child"><span className="info-header--evms">date updated : </span>{item.date_updated}</h5>

                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                        ))}
                        { /**If no evmsList */}
                        {evmsList == undefined || evmsList == 0 ? (
                            <CAlert className="no-value-show-alert text-center" color="primary">Currently there are no EVMS details available.
                                <div><CButton className="evms-from-details" onClick={() => history.push({ pathname: '/dashboard/EVMS/create' })}>Create a new EVMS</CButton></div>
                            </CAlert>
                        ) : null
                        }
                    </div>
                </CRow>
            </CContainer>
        </>
    )
}
export default ViewEvms;