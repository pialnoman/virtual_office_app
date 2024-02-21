import React from 'react'
import { CButton, CCard, CCardBody, CAlert, CRow, CCol } from '@coreui/react';
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetingList } from "../../store/slices/MeetingSlice";
import { USER_ID } from "../../Config";
import { useHistory } from "react-router-dom";

const ScheduleMeetings = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    const meeting = useSelector(state => state.meetings.data);
    React.useEffect(() => {
        dispatch(fetchMeetingList(sessionStorage.getItem(USER_ID)))
    }, [])
    return (
        <>
            <div className="main-holder-projects">
                <h3 className="projectsHeader">
                    Scheduled Meetings({meeting.length})
                </h3>

                <div className="card-holder1 ">
                    {meeting != undefined && meeting.slice(0, 3).map((item, idx) => (
                        <CCard className="project-card2" key={idx}>
                            <CCardBody>
                                {item.room_id != "" &&
                                <h6 className="id-no1">room id: #{item.room_id}</h6>}
                                {item.room_id == "" && <h6 className="id-no1">meeting id: #{item.id}</h6>}
                                <h5 className="card-details1"><span className="p-header-3">Agenda:</span> {item.agenda}</h5>
                                <h5 className="card-details1"><span className="p-header-3">Location:</span> {item.medium == 0 ? 'Physical' :'Virtual'}</h5>
                                <h5 className="card-details1"><span className="p-header-3">Scheduled Date &amp; Time :</span> {item.start_time}</h5>
                            </CCardBody>

                        </CCard>
                    ))}
                    { /**If no meetings */}
                    {meeting == undefined || meeting == '' ? (
                        <CAlert className="no-value-show-alert" color="primary">Currently there are no upcoming meetings</CAlert>
                    ) : <></>}
                </div>
                {meeting != undefined  && <CRow className="button-holder3">
                <CCol className="p-header-3 col-md-9 mt-2">
                       
                    </CCol>

                    <CCol className="col-md-3">
                    <CButton className="tiny-buttons1"  onClick={() => history.push({pathname:'/dashboard/meetings'})}>View all</CButton>
                    </CCol>
                    </CRow>}
            </div>


        </>
    )
}
export default ScheduleMeetings
