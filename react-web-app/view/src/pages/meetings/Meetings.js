import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CInput,
  CForm,
  CLabel,
  CSelect,
  CAlert,
  CTextarea,
} from "@coreui/react";
import { React, useEffect, useState } from "react";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import GroupsIcon from "@mui/icons-material/Groups";
import "./meetings.css";
import JitsiMeet from "../jitsi/JitsiMeet";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { API, TOKEN, USER_ID } from "../../Config";
import swal from "sweetalert";
import Select from "react-select";
import Datetime from "react-datetime";
import moment from "moment";
import { fetchMeetingList } from "../../store/slices/MeetingSlice";
import sortBy from "lodash/sortBy";

const OurMeetings = () => {
  const [meeting, setMeeting] = useState(false);
  const dispatch = useDispatch();
  // const [roomName,setRoomName]=useState('')
  // const [username,setUserName] = useState('')
  const meetings = useSelector((state) => {
    let temp = [];
    let temp1 = [];
    let temp2 = [];
    temp = state.meetings.data;
    for (let i = 0; i < temp.length; i++) {
      let now = new Date();
      let meetingTime = moment(temp[i].start_time).diff(
        moment(now),
        "seconds"
      );

      if (meetingTime > 0) {
        temp1.push(temp[i]);
      } else {
        temp2.push(temp[i]);
      }
    }
    temp1 = sortBy(temp1, "start_time");
    //temp2.push(sortBy(temp, "start_time"));

    console.log("sorted1", temp1);
    console.log("sorted2", temp2)
    temp = temp1.concat(temp2);
    console.log("length", temp.length)
    return temp;
  });

  const projects = useSelector((state) => {
    //console.log(state.projects.pm_projects)
    let temp = [];
    state.projects.pm_projects.forEach((item, id) => {
      temp.push({
        value: item.project.work_package_number,
        label:
          item.project.task_delivery_order.title +
          " / " +
          item.project.sub_task,
        data: item,
      });
    });
    return temp;
  });
  const user = useSelector((state) => state.profile.data);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const reset_form = () => {
    // setRoomName("")
    formMeeting.handleReset();
  };
  const create_meeting = (val) => {
    switch (val) {
      case true:
        setMeeting(val);
        break;
      case false:
        reset_form();
        setMeeting(val);
        break;
    }
    setMeeting(val);
  };
  const handleMeetingTypeChange = (option, actionMeta) => {
    if (actionMeta.action == "select-option") {
      formMeeting.setFieldValue("type", option.value);
    }
  };
  const handleMeetingLocationChange = (option1, actionMeta) => {
    if (actionMeta.action == "select-option") {
      formMeeting.setFieldValue("medium", option1.value);
      console.log("meeting location", option1.value);
    }
  };
  const handleProjectChange = (option, actionMeta) => {
    if (actionMeta.action == "select-option") {
      console.log(option.data);

      let temp = [];
      let temp_string = "";
      Array.from(option.data.assignees).forEach((assignee, idx) => {
        temp.push({
          value: assignee.id,
          label: assignee.first_name,
          data: assignee,
        });
        if (idx == option.data.assignees - 1) {
          temp_string += assignee.id;
        } else {
          temp_string += assignee.id + ",";
        }
      });

      formMeeting.setValues({
        medium: formMeeting.values.medium,
        type: formMeeting.values.type,
        room_id: formMeeting.values.room_id,
        room_name: formMeeting.values.room_name,
        participant: temp_string,
        project: option.data.project.work_package_number,
        agenda: formMeeting.values.agenda,
        comments: formMeeting.values.comments,
        start_time: formMeeting.values.start_time,
        host: formMeeting.values.host,
      });
      setSelectedParticipants(temp);
    }
  };
  const handleParticipantsChange = (value, actionMeta) => {
    console.log(actionMeta.action);
    if (
      actionMeta.action == "select-option" ||
      actionMeta.action == "remove-value"
    ) {
      let temp_array = [];
      let temp = [];
      let temp_string = "";
      for (let index = 0; index < value.length; index++) {
        temp_array.push({
          value: value[index].value,
          label: value[index].label,
          data: value[index].data,
        });
        temp.push(value[index].value);
        if (index == value.length - 1) {
          temp_string += value[index].value;
        } else {
          temp_string += value[index].value + ",";
        }
      }
      formMeeting.setFieldValue("participant", temp_string);
      setSelectedParticipants(temp_array);
    } else if (actionMeta.action == "clear") {
      setSelectedParticipants([]);
    }
  };
  const validateMeetForm = (values) => {
    const errors = {};
    if (values.medium == "1" && !values.room_name) {
      errors.room_name = "Room Name is required!";
    }
    if (values.type == "0" && !values.project) {
      errors.project = "Project is required";
    }
    // if ((values.type == '1') && (!values.participants)) {errors.participants = "Participants are required is required"}
    // if (!values.project) errors.project = "project name is required!";
    return errors;
  };
  const createRoom = (values) => {
    if (values.medium == "0") {
      values.room_name = "N/A";
    }
    let formData = new FormData();
    for (const item in values) {
      formData.append(item, values[item]);
      if (item == "participant") {
        formData.append(
          item,
          values[item] + "," + sessionStorage.getItem(TOKEN)
        );
      } else {
        formData.append(item, values[item]);
      }
    }
    //setMeeting(true)
    console.log("values", JSON.stringify(values));
    API.post("meetings/create/", values).then((res) => {
      console.log("res", res.data);
      formMeeting.handleReset();
      setSelectedParticipants([]);
      dispatch(fetchMeetingList(sessionStorage.getItem(USER_ID)));
      swal("Created", "", "success");
    });
  };

  const formMeeting = useFormik({
    initialValues: {
      medium: "-1",
      type: "-1",
      room_id: "",
      room_name: "",
      participant: "",
      project: "",
      agenda: "",
      comments: "",
      start_time: "",
      host: sessionStorage.getItem(USER_ID),
      // end_time: "",
      // duration: "",
    },
    validateOnChange: true,
    validateOnBlur: true,
    validate: validateMeetForm,
    onSubmit: createRoom,
  });
  const handleTypeChange = (value, actionMeta) => {
    if (actionMeta.action == "select-option") {
      formMeeting.setFieldValue("type", value.value);
    }
  };
  const valid_date = (current) => {
    let yesterday = moment().subtract(1, "day");
    return current.isAfter(yesterday);
  };
  const setShowMeeting = (meeting) => {
    setMeeting(meeting);
  };
  useEffect(() => {
    API.get("auth/assignee/list/").then((res) => {
      console.log("assignees", res.data.data);
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        temp.push({
          value: item.id,
          label: item.first_name + " " + item.last_name,
          data: item,
        });
      });
      setParticipants(temp);
    });
  }, []);
  let meetingEnded = " ";
  const timeleft = (time) => {
    let now = new Date();
    console.log("timeeee", time);
    let meetingTime = moment(time).diff(moment(now), "seconds");
    console.log(" all seconds ", meetingTime);
    if (meetingTime > 0) {
      meetingTime = Number(meetingTime);
      var days = Math.floor(meetingTime / 86400);
      meetingTime -= days * 86400;
      // calculate (and subtract) whole hours
      var hours = Math.floor(meetingTime / 3600) % 24;
      meetingTime -= hours * 3600;
      // calculate (and subtract) whole minutes
      var minutes = Math.floor(meetingTime / 60) % 60;
      meetingTime -= minutes * 60;
      // what's left is seconds
      var seconds = meetingTime % 60;
      var dDisplay = days > 0 ? days + (days == 1 ? " day, " : " days, ") : "";
      var hDisplay =
        hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
      var mDisplay =
        minutes > 0
          ? minutes + (minutes == 1 ? " minute, " : " minutes, ")
          : "";
      var sDisplay =
        seconds > 0 ? seconds + (seconds == 1 ? " second" : " seconds") : "";

      let str = "Starts Within " + dDisplay + hDisplay + mDisplay + sDisplay;
      return str;
    } else {
      let str1 = "Meeting Ended";
      meetingEnded = str1;
      return str1;
    }
  };
  return (
    <>
      <CContainer>
        {!meeting ? (
          <div className="row">
            {/**Upcoming meetings */}
            <div className="col-md-12 col-lg-4">
              <h4 className="section-name">Meetings ({meetings.length})</h4>
              {/*Meeting list */}
              {meetings.length > 0 ? (
                
                meetings.map((meeting, idx) => (
                  <div key={idx}>
                    <CCard className="meeting-cards">
                      <CCardBody>
                        <CRow>
                          <CCol className="col-md-9">
                            <h6 className="meeting-id">
                              Meeting Agenda: {meeting.agenda}
                            </h6>
                            <h6 className="projectName">
                              Room name : {meeting.room_name}
                            </h6>
                            {meeting.host != null && (
                              <h6 className="projectName">
                                Host:{" "}
                                {meeting.host.first_name +
                                  " " +
                                  meeting.host.last_name}
                              </h6>
                            )}
                            <h6 className="meeting-id mt-2">
                              {timeleft(meeting.start_time)}
                            </h6>
                          </CCol>
                          <CCol className="col-md-3">
                            {meeting.medium == 0 && (
                              <div className="icon-holder">
                                <GroupsIcon className="groupIcon" />
                              </div>
                            )}
                            {meeting.medium == 1 && (
                              <div className="icon-holder">
                                <VideoCallIcon className="videoIcon" />
                              </div>
                            )}
                            {meeting.medium == 1 && (
                              <div className="join-btn-holder">
                                <CButton
                                  className="meeting-join-btn"
                                  type="button"
                                  onClick={() => setShowMeeting(meeting)}
                                >
                                  Join
                                </CButton>
                              </div>
                            )}
                            {/* {meeting.medium == 1 && meetingEnded=="Meeting Ended" && (
                              <div className="join-btn-holder">
                                <CButton
                                  className="meeting-join-btn"
                                  type="button"
                                  disabled
                                >
                                  Join
                                </CButton>
                              </div>
                            )} */}
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                    {/**dummy cards,remove after dynamic */}
                  </div>
                ))
              ) : (
                <CAlert className="no-value-show-alert" color="primary">
                  Currently there are no meetings
                </CAlert>
              )}
            </div>
            {/**create a new meeting */}
            <div className="col-md-12 col-lg-8">
              <h4 className="section-name">Create a new meeting</h4>
              {/**create that meeting!! */}
              <CCard className="meeting-creator-form">
                <CCardBody>
                  <CForm>
                    {/**Project Name */}
                    <div className="mb-3">
                      <CLabel htmlFor="agendaItem" className="custom-label-5">
                        Meeting Title
                      </CLabel>
                      <CInput
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter Meeting Title"
                        className="custom-forminput-6"
                      />
                    </div>

                    <div className="mb-3">
                      <CLabel className="custom-label-5" htmlFor="medium">
                        Meeting Location
                      </CLabel>

                      <Select
                        closeMenuOnSelect={true}
                        aria-labelledby="medium"
                        id="medium"
                        placeholder="Select from list"
                        isClearable
                        onChange={handleMeetingLocationChange}
                        // value={defaultValue}
                        isMulti={false}
                        classNamePrefix="custom-forminput-6"
                        options={[
                          { value: 0, label: "Physical" },
                          { value: 1, label: "Virtual" },
                        ]}
                        // styles={colourStyles}
                      />
                      {formMeeting.touched.medium &&
                        formMeeting.errors.medium && (
                          <small style={{ color: "red" }}>
                            {formMeeting.errors.medium}
                          </small>
                        )}
                    </div>
                    <div className="mb-3">
                      <CLabel className="custom-label-5">Meeting Type</CLabel>
                      <Select
                        closeMenuOnSelect={true}
                        aria-labelledby="projects"
                        id="projects"
                        placeholder="Select from list"
                        isClearable
                        onChange={handleMeetingTypeChange}
                        // value={defaultValue}
                        isMulti={false}
                        classNamePrefix="custom-forminput-6"
                        options={[
                          { value: 0, label: "Project" },
                          { value: 1, label: "General" },
                        ]}
                        // styles={colourStyles}
                      />
                      {formMeeting.touched.type && formMeeting.errors.type && (
                        <small style={{ color: "red" }}>
                          {formMeeting.errors.type}
                        </small>
                      )}
                    </div>
                    {formMeeting.values.type == "0" && (
                      <div className="mb-3">
                        <CLabel className="custom-label-5">Project</CLabel>
                        {/* <CSelect aria-label="Default select example" id="medium" name="medium" value={formMeeting.values.medium} onChange={formMeeting.handleChange} className="custom-forminput-6">
                                                <option value="-1">-- Select --</option>
                                                {projects && projects.map((project,idx)=>(
                                                    <option value={project.value}>{project.label}</option>
                                                ))}
                                            </CSelect> */}
                        <Select
                          closeMenuOnSelect={true}
                          aria-labelledby="projects"
                          id="projects"
                          placeholder="Select from list"
                          isClearable
                          onChange={handleProjectChange}
                          // value={defaultValue}
                          // isMulti={false}
                          classNamePrefix="custom-forminput-6"
                          options={projects}
                          // styles={colourStyles}
                        />
                        {formMeeting.touched.project &&
                          formMeeting.errors.project && (
                            <small style={{ color: "red" }}>
                              {formMeeting.errors.project}
                            </small>
                          )}
                      </div>
                    )}
                    {/**host name */}
                    <div className="mb-3">
                      <CLabel htmlFor="hostName" className="custom-label-5">
                        Host
                      </CLabel>
                      <CInput
                        type="text"
                        id="host"
                        name="host"
                        value={user.first_name + " " + user.last_name}
                        className="custom-forminput-6"
                        readOnly
                      />
                    </div>
                    {/*agenda*/}
                    <div className="mb-3">
                      <CLabel htmlFor="agendaItem" className="custom-label-5">
                        Meeting Agenda
                      </CLabel>
                      <CTextarea
                        id="agenda"
                        name="agenda"
                        value={formMeeting.values.agenda}
                        onChange={formMeeting.handleChange}
                        className="custom-forminput-6"
                      />
                    </div>
                    {/*room name*/}
                    {formMeeting.values.medium == "1" && (
                      <div className="mb-3">
                        <CLabel htmlFor="roomItem" className="custom-label-5">
                          Room Name
                        </CLabel>
                        <CInput
                          type="text"
                          id="room_name"
                          name="room_name"
                          className="custom-forminput-6"
                          value={formMeeting.values.room_name}
                          onChange={formMeeting.handleChange}
                        />
                        {formMeeting.errors.room_name &&
                          formMeeting.touched.room_name && (
                            <p className="error">Room Name invalid</p>
                          )}
                      </div>
                    )}
                    <div className="mb-3">
                      <CLabel className="custom-label-5" htmlFor="participants">
                        Participants
                      </CLabel>
                      <Select
                        closeMenuOnSelect={false}
                        aria-labelledby="participants"
                        id="participants"
                        placeholder="Select from list"
                        isClearable
                        onChange={handleParticipantsChange}
                        value={selectedParticipants}
                        isMulti
                        classNamePrefix="custom-forminput-6"
                        options={participants}
                        // styles={colourStyles}
                      />
                    </div>
                    {/**password */}
                    <div className="mb-3">
                      <CLabel
                        htmlFor="exampleInputPassword1"
                        className="custom-label-5"
                      >
                        Start date & time
                      </CLabel>
                      <Datetime
                        isValidDate={valid_date}
                        // value={formMeeting.values.start_time}
                        input={false}
                        // updateOnView="date"
                        dateFormat="YYYY-MM-DD"
                        timeFormat={"h:mm A"}
                        // closeOnSelect={true}
                        closeOnTab={true}
                        // onChange={(e)=>{console.log(e.format())}}
                        onChange={(e) => {
                          formMeeting.setFieldValue("start_time", e.format());
                        }}
                      />
                    </div>
                    {/* <div className="mb-3">
                                            <CLabel
                                                htmlFor="exampleInputPassword1"
                                                className="custom-label-5"
                                            >
                                                End date & time
                                            </CLabel>
                                            <Datetime
                                                value={formMeeting.values.end_time} 
                                                input={false}
                                                onChange={formMeeting.handleChange}
                                            />
                                        </div> */}
                    {/* <div className="mb-3">
                                            <CLabel
                                                htmlFor="exampleInputPassword1"
                                                className="custom-label-5"
                                            >
                                                Password
                                            </CLabel>
                                            <CInput
                                                type="password"
                                                id="exampleInputPassword1"
                                                className="custom-forminput-6"
                                                value={password} onChange={(event) => setPassword(event.target.value)}
                                            />
                                        </div> */}
                    {/**submit button */}
                    <div className="mb-3 create-meet-btn-holder">
                      <CButton
                        className="create-meeting-btn"
                        type="button"
                        onClick={formMeeting.handleSubmit}
                      >
                        Create Meeting
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </div>
          </div>
        ) : (
          <CRow>
            <JitsiMeet
              roomName={"dma"}
              username="Shaif"
              onMeetingClose={() => create_meeting(false)}
            />
          </CRow>
        )}
      </CContainer>
    </>
  );
};
export default OurMeetings;
