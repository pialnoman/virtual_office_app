import { CContainer, CRow, CCol, CCard, CCardBody, CButton, CFormInput, CForm, CFormLabel, CFormSelect } from '@coreui/react';
import { React, useState } from 'react';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import './meeting.css';

const OurMeetings = () => {
    return (
        <>
            <CContainer>
                <CRow>
                    {/**Upcoming meetings */}
                    <CCol md="12" lg="4">
                        <h4 className="section-name"> Meetings</h4>

                        {/*Meeting list */}
                        <div>
                            <CCard className="meeting-cards">
                                <CCardBody>
                                    <div className="d-flex">
                                        <div className="icon-holder">
                                            <VideoCallIcon className="videoIcon" />
                                        </div>
                                        <div>
                                            <h6 className="meeting-id">Meeting ID: #677465</h6>
                                            <h5 className="projectName">Virtual Office</h5>
                                            <div className="join-btn-holder"><CButton className="meeting-join-btn">Join</CButton></div>
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                            {/**dummy cards,remove after dynamic */}

                            <CCard className="meeting-cards">
                                <CCardBody>
                                    <div className="d-flex">
                                        <div className="icon-holder">
                                            <VideoCallIcon className="videoIcon" />
                                        </div>
                                        <div>
                                            <h6 className="meeting-id">Meeting ID: #677465</h6>
                                            <h5 className="projectName">Virtual Office</h5>
                                            <div className="join-btn-holder"><CButton className="meeting-join-btn">Join</CButton></div>
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                            {/**dummy cards,remove after dynamic */}
                            <CCard className="meeting-cards">
                                <CCardBody>
                                    <div className="d-flex">
                                        <div className="icon-holder">
                                            <VideoCallIcon className="videoIcon" />
                                        </div>
                                        <div>
                                            <h6 className="meeting-id">Meeting ID: #677465</h6>
                                            <h5 className="projectName">Virtual Office</h5>
                                            <div className="join-btn-holder"><CButton className="meeting-join-btn">Join</CButton></div>
                                        </div>
                                    </div>
                                </CCardBody></CCard>
                        </div>
                    </CCol>
                    {/**create a new meeting */}
                    <CCol md={{ span: 12, offset: 0 }} lg={{ span: 7, offset: 1 }}>
                        <h4 className="section-name">Create a new meeting</h4>
                        {/**create that meeting!! */}
                        <CCard className="meeting-creator-form">
                            <CCardBody>
                                <CForm>
                                    {/**Project Name */}
                                    <div className="mb-3">
                                        <CFormLabel className="custom-label3">Project Name</CFormLabel>
                                        <CFormSelect aria-label="Default select example" className="custom-formgroup3">
                                            <option disabled>Open this select menu</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </CFormSelect>
                                    </div>
                                    {/**host name */}
                                    <div className="mb-3">
                                        <CFormLabel
                                            htmlFor="hostName"
                                            className="custom-label3"
                                        >Host</CFormLabel>
                                        <CFormInput type="text" id="hostName" className="custom-formgroup3" />

                                    </div>
                                    {/*agenda*/}
                                    <div className="mb-3">
                                        <CFormLabel
                                            htmlFor="agendaItem"
                                            className="custom-label3"
                                        >Meeting Agenda</CFormLabel>
                                        <CFormInput type="text" id="agendaItem" className="custom-formgroup3" />

                                    </div>
                                    {/*room name*/}
                                    <div className="mb-3">
                                        <CFormLabel
                                            htmlFor="roomItem"
                                            className="custom-label3"
                                        >Room Name</CFormLabel>
                                        <CFormInput type="text" id="roomItem" className="custom-formgroup3" />

                                    </div>
                                    {/**password */}
                                    <div className="mb-3">
                                        <CFormLabel
                                            htmlFor="exampleInputPassword1"
                                            className="custom-label3"
                                        >
                                            Password
                                        </CFormLabel>
                                        <CFormInput
                                            type="password"
                                            id="exampleInputPassword1"
                                            className="custom-formgroup3"
                                        />

                                    </div>
                                    {/**submit button */}
                                    <div className="mb-3 create-meet-btn-holder">
                                        <CButton className="create-meeting-btn">Create Meeting</CButton>
                                    </div>

                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}
export default OurMeetings;