import {
  CContainer,
  CNav,
  CRow,
  CTabs,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import React from "react";
import CIcon from "@coreui/icons-react";
import "./sharedDocs.css";
import ShowDocuments from "../../components/shared-docs-view-file/viewDocsList";
import UploadDocuments from "../../components/shared-doc-upload-form/uploadForm";
import { useSelector } from "react-redux";

const SharedDocuments = () => {
  const projects = useSelector(state => {
    let temp = []
    Array.from(state.projects.data).forEach((project, idx) => {
      temp.push({ value: project.project.id, label: project.project.sub_task })
    })
    return temp
  })
  return (
    <>
      <CContainer>
        <CTabs activeTab="uploadDocs">
          <CNav variant="tabs" className="tab-style">
            {/**Upload Documents */}
            <CNavItem>
              <CNavLink data-tab="uploadDocs" className="special">
                <CIcon name="cil-arrow-thick-to-top" /> Upload Documents
              </CNavLink>
            </CNavItem>
            {/**View all uploaded documents */}
            <CNavItem>
              <CNavLink data-tab="viewDocs" className="special">
                <CIcon name="cil-library" className="mr-1" />View Shared Documents
              </CNavLink>
            </CNavItem>
          </CNav>
          {/**___________nav tab details______ */}
          <CTabContent>
            {/**Upload documents */}
            <CTabPane data-tab="uploadDocs">
              <CContainer>
                <h3 className="profile-page-header">Upload Documents</h3>
                <CRow>
                  <div className="col-lg-8 offset-lg-2">
                    <UploadDocuments />
                  </div>
                </CRow>
              </CContainer>
            </CTabPane>
            {/**VIEW DOCUMENTS */}
            <CTabPane data-tab="viewDocs">
              <CContainer>
                {/* <h3 className="profile-page-header">View Shared Documents</h3> */}
                <CRow>
                  <div className="col-md-12">
                    <ShowDocuments />
                  </div>
                </CRow>
              </CContainer>
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CContainer>
    </>
  );
};
export default SharedDocuments;
