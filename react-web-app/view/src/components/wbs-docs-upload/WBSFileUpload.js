import React, { useEffect, useState } from "react";
import {
    CForm,
    CLabel,
    CInput,
    CCardBody,
    CCard,
    CButton,
    CContainer,
    CCol,CRow,
} from "@coreui/react";
import "./uploadForm.css";
import { API, USER_ID } from "../../Config";
import { arrayRemoveItem } from "../../helper";
import swal from "sweetalert";
import {useRef} from 'react';

const WBSFileUpload = (props) => {
    const inputRef = useRef();
    const [selectedFile,setSelectedFile] = useState()
    const setSelectedProject = useState()
    const [files, setFiles] = useState(props.files)
    const [fileAvatars, setFileAvatars] = useState([])
    const upload = () => {
        let formData = new FormData()
        // formData.append('project', selectedProject.data.project.id)
        formData.append('files', files.length)
        formData.append('upload_by', sessionStorage.getItem(USER_ID))
        Array.from(files).forEach((file, idx) => {
            formData.append('file' + (idx + 1), file)
        })
        API.post('project/shared/document/create/', formData).then((res) => {
            setSelectedProject(null)
            setFileAvatars([])
            setFiles([])
            swal('Uploaded', 'Files are uploaded', 'success')
        })
    }
    function onFileChange(event) {
        let file = event.target.files[0]
        event.target.value=null
        setFiles([...files, file]);
        setFileAvatars([...fileAvatars, URL.createObjectURL(file)]);
        props.setFiles([...files, file])
    }
    function remove_file(index) {
        console.log('on remove',arrayRemoveItem(files, files[index]))
        setFileAvatars(arrayRemoveItem(fileAvatars, fileAvatars[index]))
        setFiles(arrayRemoveItem(files, files[index]))
        props.setFiles(arrayRemoveItem(files, files[index]))
        // inputRef.current.value = null;
    }
    
    return (
        <>
            <CCard className="mt-2 upload-docs">
                <CCardBody>
                    <CContainer>
                        {/**Project Name */}
                        
                        {/**upload files box */}
                        <CCol className="mb-1">
                            <CLabel htmlFor="attachments" className="custom-label-5">
                                Upload Documents
                            </CLabel>
                            <CLabel className="custom-file-upload">
                                <CInput
                                    type="file"
                                    id="file"
                                    ref={inputRef}
                                    className="form-control form-control-file"
                                    onChange={(event) => onFileChange(event)}
                                    accept=".xlsx, .xls, .csv, .pdf, image/*, application/gzip, .zip, .tar, .txt, .doc, .docx, .pptx, .ppt"
                                />
                                <img
                                    src={"assets/icons/upload-thin.svg"}
                                    alt=""
                                    className="upload-icon"
                                // onClick={()=>{document.getElementById('file').click()}}
                                />
                            </CLabel>
                        </CCol>
                        <CCol>
                        {/* <CButton
                            type="button" 
                            onClick = {upload}
                            color="primary"
                          >
                            Upload
                          </CButton> */}
                        </CCol>
                        {/**display uploaded files */}
                        <div className="mb-2">
                            <div className="row">
                                {fileAvatars.map((file, idx) => (
                                    <div key={idx} className="col-md-6 col-sm-6 col-sm-4">
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
                            </div>
                        </div>
                        {/**Submit buttons */}
                        {/* <div className="mb-3 mt-4">
                            <div className="project-form-button-holders ">
                                <CButton className="profile-form-btn update-profile" type="button" onClick={upload}>Upload Documents</CButton>
                                <CButton className="profile-form-btn cancel-update">Cancel</CButton>
                            </div>
                        </div> */}

                    </CContainer>
                </CCardBody>
            </CCard>
        </>
    );
};

export default WBSFileUpload;
