import CIcon from '@coreui/icons-react'
import { CButton, CCol, CRow, CCard, CCardBody } from '@coreui/react'
import React, { useState } from 'react'
import { API, BASE_URL, USER_ID } from '../../Config'
import Select, { defaultTheme } from "react-select";
import { useSelector } from 'react-redux';
import  store  from '../../store/Store';

const ViewFiles = () => {
    const [itemToShow,setItemToShow]=useState(4)
    const [expanded,setExpanded]=useState(false)
    const [sharedDocs,setSharedDocs]=useState([])
    const projects = useSelector(state=>{
        let temp=[]
        Array.from(state.projects.data).forEach((item,idx)=>{
            temp.push({value:item.project.work_package_number, label: item.project.task_delivery_order.title+' > '+item.project.sub_task, data:item})
        })
        return temp
    })
    function download(dataurl, filename) {
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = dataurl;
        link.target="_blank"
        link.download = "";
        link.click();
      }
    const showMore = () => {
        if(itemToShow === 4){
            setExpanded(true)
            setItemToShow(4)
        }
        else{
            setExpanded(false)
        }
    }
    const handleProjectChange=(option,actionMeta)=>{
        if(actionMeta.action == 'select-option'){
            let temp=[]
            let projects = store.getState().projects.data
            console.log("projects", sharedDocs)
            Array.from(sharedDocs).forEach((item,idx)=>{
                console.log('dd',item.project)
                if(item.work_package_number == option.value){
                    temp.push(item)
                }
            })
            setSharedDocs(temp)
        }
    }
    React.useEffect(()=>{
        API.get('project/all-files/').then(res=>{
            console.log(res)
            setSharedDocs(res.data.data)
        })
    },[])
    return (
        <>
            <h4 className="project-name">Select Project</h4>
            <CRow>
                <CCol sm="12" md="4" lg="4">
                    <Select
                        options={projects}
                        onChange={handleProjectChange}
                    />
                </CCol>
            </CRow>
            <div className="expand-btn-holder">
                <CButton className="see-all-btn mb-3" onClick={showMore}>{expanded ? (
                    <span>Show less</span>
                ) : (
                    <span>Show all</span>
                )
                }</CButton>
            </div>
            <CRow>
                {sharedDocs.slice(0, itemToShow).map((file, i) =>
                    <CCol lg="3" md="6" sm="6" key={i}>
                        <CCard className="doc-cards">
                            <CCardBody className="doc-file-body" onClick={()=>download(BASE_URL+file.file,'test.jpg')}>
                                <div className="icon-holder-shared-files">
                                    <CIcon name="cil-file" className="file-icon-show" size="2xl"></CIcon>
                                </div>
                                <h5 className="file-name mt-2">{file.fileName}</h5>
                                <h6 className="create-time"><span className="thicc-header">Created:</span>{file.date_created}</h6>
                                <h6 className="uploadedBy"><span className="thicc-header">Uploaded by:</span>{file.upload_by.first_name}</h6>

                            </CCardBody>
                        </CCard>
                    </CCol>)}

                {/* <CCol lg="2" md="6">

                </CCol>
                <CCol lg="2" md="6"></CCol>
                <CCol lg="2" md="6"></CCol>
                <CCol lg="2" md="6"></CCol> */}
            </CRow>
        </>
    )
}

export default ViewFiles
