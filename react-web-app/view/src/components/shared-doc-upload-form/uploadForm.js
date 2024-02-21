import React, { useState } from "react";
import {
  CForm,
  CLabel,
  CInput,
  CCardBody,
  CCard,
  CButton,
  CContainer,
} from "@coreui/react";
import "./uploadForm.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";
import { API, USER_ID } from "../../Config";
import { arrayRemoveItem } from "../../helper";
import swal from "sweetalert";

const UploadDocuments = () => {
  const colourStyles = {
    // control: (styles, state) => ({ ...styles,height:"35px", fontSize: '14px !important', lineHeight: '1.42857', borderRadius: "8px",borderRadius:".25rem",color:"rgb(133,133,133)",border:state.isFocused ? '2px solid #0065ff' :'inherit'}),
    option: (provided, state) => ({ ...provided, fontSize: "14px !important" }),
  };
  const [selectedProject, setSelectedProject] = useState()
  const [selectedProjectError, setSelectedProjectError] = useState('')
  const [files, setFiles] = useState([])
  const [fileAvatars, setFileAvatars] = useState([])

  
  const upload = () => {
    let formData = new FormData()
    formData.append('project', selectedProject.data.project.id)
    formData.append('files', files.length)
    formData.append('upload_by', sessionStorage.getItem(USER_ID))
    Array.from(files).forEach((file, idx) => {
      formData.append('file'+(idx+1),file)
    })
    API.post('project/shared/document/create/', formData).then((res)=>{
      setSelectedProject(null)
      setFileAvatars([])
      setFiles([])
      swal('Files are uploaded!','','success')
    })
  }
  const projects = useSelector(state => {
    let temp = []
    Array.from(state.projects.data).forEach((project, idx) => {
      temp.push({ value: project.project.id, label: project.project.task_delivery_order.title + ' / ' + project.project.sub_task, data: project })
    })
    return temp
  })
  function onImageChange(selectedFile) {
    setFiles([...files, selectedFile]);
    setFileAvatars([...fileAvatars, URL.createObjectURL(selectedFile)]);
  }
  const handleProjectChange = (value, actionMeta) => {
    if (actionMeta.action == 'select-option' || actionMeta.action == 'remove-value') {
      setSelectedProject(value)
    }
    else if (actionMeta.action == 'clear') {
      setSelectedProject(null)
    }
  };
  function remove_file(index) {
    console.log(fileAvatars)
    setFileAvatars(arrayRemoveItem(fileAvatars, fileAvatars[index]))
    setFiles(arrayRemoveItem(files, files[index]))
  }
  return (
    <>
      <CCard className="mt-4 upload-docs">
        <CCardBody>
          <CContainer>
            {/**Project Name */}
            <div className="mb-3">
              <CLabel className="custom-label-5" htmlFor="prjctSelect">
                Select Project
              </CLabel>
              <Select
                closeMenuOnSelect={true}
                aria-labelledby="prjctSelect"
                id="prjctSelect"
                minHeight="35px"
                placeholder="Select from list"
                isClearable={true}
                isMulti={false}
                onChange={handleProjectChange}
                classNamePrefix="custom-forminput-6"
                value={selectedProject}
                options={projects}
                styles={colourStyles}
              />
            </div>
            {/**upload files box */}
            <div className="mb-3">
              <CLabel htmlFor="attachments" className="custom-label-5">
                Upload Documents
              </CLabel>
              <CLabel className="custom-file-upload">
                <CInput
                  type="file"
                  id="file"
                  className="form-control form-control-file"
                  onChange={(event) => onImageChange(event.target.files[0])}
                  accept=".xlsx, .xls, .csv, .pdf, image/*, application/gzip, .zip, .tar, .txt, .doc, .docx, .pptx, .ppt"
                />
                <img
                  src={"assets/icons/upload-thin.svg"}
                  alt=""
                  className="upload-icon"
                // onClick={()=>{document.getElementById('file').click()}}
                />
              </CLabel>
            </div>
            {/**display uploaded files */}
            <div className="mb-3">
              <div className="row">
                {fileAvatars.map((file, idx) => (
                  <div key={idx} className="col-md-6 col-sm-6 col-lg-4">
                    <div className="file-attached-ongoing rounded-pill">
                      <CButton className="remove-file-ongoing" type="button" onClick={() => { remove_file(idx) }}>
                        <img
                          src={"assets/icons/icons8-close-64-blue.svg"}
                          className="close-icon-size"
                        />
                      </CButton>
                      {files[idx].name}
                    </div>
                  </div>
                ))}
                {/**dummy cards,remove once dynamic */}
                {/* <div className="col-md-6 col-sm-6 col-lg-4">
                  <div className="file-attached-ongoing rounded-pill">
                    <CButton className="remove-file-ongoing">
                      <img
                        src={"assets/icons/icons8-close-64-blue.svg"}
                        className="close-icon-size"
                      />
                    </CButton>
                    abcdjskjdksjkds.xvts
                  </div>
                </div> */}

              </div>
            </div>
            {/**Submit buttons */}
            <div className="mb-3 mt-4">
              <div className="project-form-button-holders ">
                <CButton className="profile-form-btn update-profile" type="button" onClick={upload}>Upload Documents</CButton>
                <CButton className="profile-form-btn cancel-update">Cancel</CButton>
              </div>
            </div>

          </CContainer>
        </CCardBody>
      </CCard>
    </>
  );
};

export default UploadDocuments;
