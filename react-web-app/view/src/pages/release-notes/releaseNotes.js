import React, { useState, useEffect } from "react";
import "./releaseNotes.css";
import Select from "react-select";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CDataTable,
  CBadge,
  CButton,
} from "@coreui/react";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { API } from "../../Config";

const ReleaseNotes = () => {
  return (
    <>
        <h1>Release Notes</h1>
        <h2>5 July 2023</h2>
        <ul className="release-list">
        <li className="release-item">
        <span className="version">1</span>
        <span className="description">The year showing in the footer will now change dynamically.</span>
        </li>
        <li className="release-item">
        <span className="version">2</span>
        <span className="description">Footer will now link to a <b>Release Notes</b> page, which will contain all the information about the last update.</span>
        </li>
        <li className="release-item">
        <span className="version">3</span>
        <span className="description">Users can't upload profile pictures that are greater than 100KB.</span>
        </li>
        <li className="release-item">
        <span className="version">4</span>
        <span className="description">Users are requested to change their profile pictures for data effeciency.</span>
        </li>
  </ul>
    </>
  );
};
export default ReleaseNotes;
