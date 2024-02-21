import React, { useState } from 'react';
import './evmsTable.css';
import { CButton, CCard, CCardBody, CAlert, CRow, CCol } from '@coreui/react';
import { useHistory } from "react-router-dom";
import { fetchEvmsThunk } from '../../store/slices/EvmsSlice';
import { useSelector, useDispatch } from 'react-redux';


const EvmsView = () => {
    let history = useHistory();
    
    var cpiVal
    const evmsList = useSelector(state => state.evmsList.data)
    console.log('evms from dashboard', evmsList)
    function calculateCPI(ev,ac){
      let val = Math.abs(ev/ac)

      return val;

}


  
   
    return (
        <>
            <div className="main-holder-projects">
                <h3 className="projectsHeader">
                    EVMS Summary ({evmsList.length})
                </h3>
                <div className="card-holder1">
                    {evmsList != undefined && Array.from(evmsList).slice(0, 3).map((item, idx) => (
                        <CCard className="project-card1" key={idx}>
                            <CCardBody>
                                <h6 className="id-no1">{item.project.task_delivery_order.title} / {item.project.sub_task}</h6>
                                <h5 className="card-details2"><span className="p-header-4">Cost Performance Index (CPI) :</span><span> {calculateCPI(item.earned_value,item.actual_cost)}</span><small className="ml-1 star-color">*(CPI{'>'}1, within budget.CPI {'<'}1, over budget)</small></h5>
                                <h5 className="card-details2"><span className="p-header-4">Schedule Performance Index (SPI) :</span><span> {calculateCPI(item.earned_value,item.project.planned_value)}</span><small className="ml-1 star-color">*(SPI {'>'}1, within schedule,SPI {'<'}1, behind schedule)</small></h5>
                            </CCardBody>
                        </CCard>
                    ))}
                    { /**If no evmsList */}
                    {evmsList == undefined || evmsList == 0 ? (



                        <CAlert className="no-value-show-alert" color="primary">Currently there are no projects assigned to you</CAlert>


                    ) : null


                    }

                </div>
                {evmsList != undefined &&
                    <CRow className="button-holder3">
                         <CCol className="p-header-3 col-md-9 mt-2">
                       
                    </CCol>

                    <CCol className="col-md-3"><CButton className="tiny-buttons1" onClick={() => history.push({ pathname: '/dashboard/EVMS/view' })}>View all</CButton>
                    </CCol>
                    </CRow>}

            </div>

        </>
    )
}
export default EvmsView;