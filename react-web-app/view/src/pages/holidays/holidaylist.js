import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CLabel,
  CButton,
  CDataTable,
  CBadge,
} from "@coreui/react";
import orderBy from "lodash/orderBy";
import React, { useState, useEffect } from "react";
//import "./timeCards.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { FILE_API, USER_ID } from "../../Config";
import { API } from "../../Config";
import { has_permission } from "../../helper";
import { useFormik } from "formik";
import jsPDF from "jspdf";
import "jspdf-autotable";

import CIcon from "@coreui/icons-react";
import moment from "moment";
import swal from "sweetalert";

import { saveAs } from "file-saver";
//import AddTimecardItms from "./addTimecardItem";
//import EditTimeCard from "./Edit";
import "./holidays.css";
import { useLocation } from "react-router-dom";

const Holidaylist = () => {
  const [allholidays, setallHolidays] = useState([]);
  const [holidayData, setholidayData] = useState([]);
  const [excelData, setExcelData] = useState([])
  const [totalHolidays, setTotalHolidays] = useState(0)
  const [year, setYear]=useState(0)

  const holidayTable = (data) => {
    var tableData = [];
    for (let i = 0; i < data.length; i++) {
      tableData.push({
        // Year: data[i].Year,
        "Holiday Title": data[i].holiday_title,
        "Start Date": data[i].start_date,
        "End Date": data[i].end_date,
        Hours: data[i].hours,
        "Days" : data[i].hours/8,
        
       
      });
      console.log("table data ", tableData);
    }
    let totalDays = 0 
    for(let i=0;i<data.length;i++)
    {
      totalDays = totalDays+tableData[i].Days
    }
    console.log("total days", totalDays)
    let thisYear = new Date()
    thisYear = thisYear.getFullYear()
    setYear(thisYear)
    setTotalHolidays(totalDays)
    setholidayData(tableData);
  };

  async function exoprtExcel () {
    
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("sheet1");

    sheet.mergeCells("B1:D2");
    const customcell = sheet.getCell("C1");
    customcell.value = "Datasoft Manufacturing & Assembly";
    customcell.font = {
      size: 15,
      bold: true,
    };
    sheet.getCell("C1").alignment = {
      horizontal: "center",
      vertical: "center",
    };
    sheet.mergeCells("B3:D3");
    const customcell1 = sheet.getCell("C3");
    customcell1.value = "Gulshan Branch";
    customcell1.font = {
      size: 13,
      bold: true,
    };
    customcell1.alignment = {
      horizontal: "center",
      vertical: "center",
    };

    sheet.mergeCells("A5:B5");
    sheet.getCell("A5").value = "List of Holidays (" + year+ ")" ;
    sheet.getCell("A5").font={
      bold: true,
    }
    sheet.getCell("E5").value = "Total Holidays "+ totalHolidays;
    sheet.getCell("E5").font={
      bold: true,
    }
    sheet.mergeCells("F6:G6");
    
    sheet.mergeCells("A6:D6");

    sheet.getRow(8).values = [
      // "Year",
      "Holiday Title",
      "Start Date",
      "End Date",
      "Hours",
      "Days",
    ];
    sheet.getRow(8).font = {
      name: "Arial Black",
      family: 3,

      size: 10,
    };

    sheet.getRow(9).height = 20;
    sheet.columns = [
      // { key: "year", width: 10 },
      { key: "title", width: 30 },
      { key: "start", width: 15 },
      { key: "end", width: 15 },
      { key: "hours", width: 15 },
      { key: "days", width: 15 },
      
    ];
    
    for (let i = 0; i < excelData.length; i++) {
      sheet.addRow({
        // year: excelData[i].Year,
        title: excelData[i].holiday_title,
        start: excelData[i].start_date,
        end: excelData[i].end_date,
        hours: excelData[i].hours,
        days: excelData[i].hours/8,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer(excelData);
    const fileType = "application/octet-stream";
    const fileExtension = ".xlsx";
    const blob = new Blob([buffer], { type: fileType });
    
    const fileName = "List-of-Holidays"+fileExtension;
    saveAs(blob, fileName);
  };



  const exportPdf =()=>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);

    const headers = [[
      // "Year",
      "Holiday Title",
      "Start Date",
      "End Date",
      "Hours",
      "Days",
    ],
  ];
  const uData = excelData.map((elt, idx) => [
       
    // elt.Year,
    elt.holiday_title,
    elt.start_date,
    elt.end_date,
    elt.hours,
    elt.hours/8,
])
console.log("pdfData", uData)
  let content = {
    startY: 140,
    head: headers,
    body: uData,
};

    doc.setFontSize(18);
    doc.text(165, 50, "Datasoft Manufacturing & Assembly")
    doc.setFontSize(14);
    doc.text(230, 65,"Gulshan Branch")
    doc.setFontSize(12);
    doc.text(42,100, "List of Holidays (" + year+ ")")
    doc.text(450, 100, "Total Holidays "+ totalHolidays)
    doc.autoTable(content);

    
    doc.save("List-of-Holidays.pdf")
  }
  useEffect(() => {
    API.get("organizations/holiday/all/").then((res) => {
      console.log("res", res.data.data);
      setallHolidays(res.data.data);
      holidayTable(res.data.data);
      setExcelData(res.data.data);
    });
    
  }, []);

  return (
    <CContainer>
      <CRow className="justify-content-between">
        <CCol md="12">
          <CRow className="justify-content-between">
            <CCol>
              <h3 className="timecards-page-header mb-3">List of Holidays ({year})</h3>
            </CCol>
            <CCol md="8" id="tableRef" className="d-flex justify-content-end">
              <h5 className="tiny-header--5 mt-3 mr-2">Export </h5>
              <div className="format-buttons mt-3 mb-3 ">
                <CButton
                  className="file-format-download"
                  onClick={() => exportPdf()}
                >
                  <CIcon name="cil-description" className="mr-2" /> PDF
                </CButton>
                <CButton
                  className="file-format-download"
                  onClick={
                    () => exoprtExcel()
                    //exportToCSV(usersData, "Timecard of" + " " + pdfTitle)
                  }
                >
                  <CIcon name="cil-spreadsheet" className="mr-2" />
                  Excel
                </CButton>
                {/* <CButton className="file-format-download">Print</CButton> */}
              </div>
            </CCol>
          </CRow>
          <CDataTable
            items={holidayData}
            fields={[
              // "Year",
              "Holiday Title",
              "Start Date",
              "End Date",
              "Hours",
              "Days", 

            ]}
            primary
            hover
            striped
            bordered
            sorter
            //columnFilter
            size="sm"
            itemsPerPage={20}
            pagination
          />
        </CCol>
      </CRow>
      <CRow className="justify-content-end mb-5">
        <CCol md="2" className="justify-content-end tiny-header--5">
          Total Holidays {totalHolidays}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Holidaylist;
