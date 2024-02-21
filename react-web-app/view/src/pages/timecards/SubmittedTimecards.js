import {
  CContainer,
  CRow,
  CCol,
  CDataTable,
  CLabel,
  CButton,
  CInput,
} from "@coreui/react";
import uniqBy from "lodash/uniqBy";
import CIcon from "@coreui/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import sortBy from "lodash/sortBy";
import { capitalize, exportPdfview } from "../../helper";
import moment from "moment";
import "./timeCards.css";
import { fetchUserSubmittedTimecards } from "../../store/slices/TimecardSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState, useEffect } from "react";
import { has_permission } from "../../helper.js";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom";
import { API } from "../../Config";
import Select from "react-select";
import { fetchWorkTypes } from "../../store/slices/WorkTypeSlice";

const SubmittedTimecards = () => {
  const dispatch = useDispatch();
  const [assignees, setAssignees] = useState([]);
  const [selectedWeekend, setselectedWeekend] = useState();
  const [totalSubmitted, settotalSubmitted] = useState();
  const [headers,setheaders] = useState()
  const [pdfData, setPdfData]= useState([])

  let submitted = [];
  const profile_details = useSelector((state) => state.profile.data);
  const worktypes = useSelector((state)=> state.worktypes.data)
  const submitted_timecards = useSelector((state) => {
    let temp = [];

    Array.from(state.timecardList.user_weekly_submitted_timecards).forEach(
      (item, idx) => {
        //console.log("weekly submitted", item)
        temp.push({
          id: item.employee.id,
          data: item.employee,
          Weekending: moment(item.week_end).format("ddd, MMMM DD, YYYY"),
          Name: item.employee.first_name + " " + item.employee.last_name,
          Total: item.total_hours,
          RHR: item.RHR == null ? "-" : item.RHR,
          SIC: item.SIC == null ? "-" : item.SIC,
          HOL: item.HOL == null ? "-" : item.HOL,
          WFH: item.WFH == null ? "-" : item.WFH,
          OTO: item.OTO == null ? "-" : item.OTO,
          VAC: item.VAC == null? "-" : item.VAC,
          COM: item.COM == null? "-" : item.COM,
          PB: item.PB == null? "-" : item.PB,
          PB1: item["PB1"] == null ? "-" : item["PB1"],
          PB2: item["PB2"] == null ? "-" : item["PB2"],
          Submitted:
            moment(item.submitted_at).format("ddd, MMMM DD, YYYY") +
            " at " +
            moment(item.submitted_at).format("h:mm"),
        });
      }
    );

    submitted = [...temp];
    // console.log("submitted", temp);
    return temp;
  });

  const [submittedTimecards, setsubmittedTimecards] = useState([]);

  const weekendingList = useSelector((state) => {
    let optionlist = [];
    Array.from(state.timecardList.user_weekly_submitted_timecards).forEach(
      (item, idx) => {
        optionlist.push({
          data: item,
          label: moment(item.week_end).format("ddd, MMMM DD, YYYY"),
          value: moment(item.week_end).format("ddd, MMMM DD, YYYY"),
        });
      }
    );
    let options = uniqBy(optionlist, "label");
    options.sort((a, b) => {
      const dateA = moment(a.data.week_end);
      const dateB = moment(b.data.week_end);
      return dateB - dateA;
    });
  
    return options;
  });

  const handleWeekendChange = (option, actionMeta) => {
    setselectedWeekend(option);
    let filteredtimecards = [];
    if (actionMeta.action == "select-option") {
      filteredtimecards = [];
      console.log("select");
      for (let i = 0; i < submitted_timecards.length; i++) {
        if (option.value == submitted_timecards[i].Weekending) {
          filteredtimecards.push(submitted_timecards[i]);
        }
      }
    } else if (actionMeta.action == "clear") {
      console.log("clear");
      for (let i = 0; i < submitted_timecards.length; i++) {
        filteredtimecards.push(submitted_timecards[i]);
      }
    }
    console.log("filtered", filteredtimecards);
    setsubmittedTimecards(filteredtimecards);
    setPdfData(filteredtimecards)
  };

  const submittedAssignees = () => {
    let temp = [];
    for (let i = 0; i < submittedTimecards.length; i++) {
      temp.push({
        name: submittedTimecards[i].Name,
      });
    }
    temp = uniqBy(temp, "name");
    console.log("len", temp.length);
    return temp.length;
  };
  let len = 0
  const populate_data = () => {
   
    if (selectedWeekend == "undefined" || selectedWeekend == null) {
      //console.log("len",(submitted_timecards).length)
      //len = (submitted_timecards).length
      //settotalSubmitted(submitted_timecards.length)
      len = uniqBy(submitted_timecards, 'Name')
      //console.log("uniqed ", len.length)
      return submitted_timecards;
    } else {
      //console.log("len",(submittedTimecards).length)
      //len = (submittedTimecards).length
      //settotalSubmitted(submittedTimecards.length)
      len = uniqBy(submittedTimecards, 'Name')
      //console.log("uniqed ", len.length)
      return submittedTimecards;
    }
    
  };

  const set_headers= () =>{
    let work_type_list = []
    work_type_list.push({
      key: "Weekending",
      _style: { width: "15%" },
      _classes: "font-weight-bold",
    })
    work_type_list.push("Name")
    work_type_list.push("Total")
    worktypes.map((work_type,idx)=>{
      work_type_list.push({
        key: work_type.title,
        sorter: false,
      })
    })
    console.log("SETTING HEADERS")
    work_type_list.push("Submitted")
    setheaders(work_type_list)
  };

  // React.useEffect(() => {
  //     //setsubmittedTimecards(submitted_timecards)
  //     let temp=[]
  //     if(submitted_timecards.length>0)
  //     {
  //       for(let i=0;i<submitted_timecards.length;i++)
  //       {
  //          temp.push(submitted_timecards[i])
  //       }
  //     }
  //     setsubmittedTimecards(temp)
  // }, [submitted_timecards])

  React.useEffect(() => {
    dispatch(fetchUserSubmittedTimecards());
    
    API.get("auth/assignee/list/").then((res) => {
      console.log("assignees", res.data.data);
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        if (item.first_name != "") {
          temp.push({
            value: item.id,
            label: item.first_name + " " + item.last_name,
            data: item,
          });
        }
      });
      console.log("all assignees", temp.length);
      setAssignees(temp.length);
    });

    if(worktypes.length === 0){
      dispatch(fetchWorkTypes());
    }
    

  }, []);

  React.useEffect(()=>{
    if(worktypes.length>0){
      set_headers()
    }
  },[worktypes]);

  const exportPDF = () => {
    
    const pdfTitle =
      profile_details.first_name + "_" + profile_details.last_name;
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);


    // const headers = [
    //   [
    //     "Weekending",
    //     "Name",
    //     "Total",
    //     "RHR",
    //     "SIC",
    //     "HOL",
    //     "PB1",
    //     "PB2",
    //     "WFH",
    //     "OTO",
    //     "VAC",
    //     "+COM",
    //     "-COM",
    //     "Submitted",
    //   ],
    // ];
    
    
    
    let uData = []
    if (selectedWeekend == "undefined" || selectedWeekend == null) {
      setPdfData(submitted_timecards)
      console.log("submitted tcs", submitted_timecards)
     uData = submitted_timecards.map((elt, idx) => [
        elt.Weekending,
        elt.Name,
        elt.Total,
        elt.RHR,
        elt.SIC,
        elt.HOL,
        elt.PB1,
        elt.PB2,
        elt.WFH,
        elt.OTO,
        elt.VAC,
        elt.pCOM,
        elt.nCOM,
        elt.Submitted,
        console.log("data", elt),
      ]);
    }else{
   uData = pdfData.map((elt, idx) => [
      elt.Weekending,
      elt.Name,
      elt.Total,
      elt.RHR,
      elt.SIC,
      elt.HOL,
      elt.PB1,
      elt.PB2,
      elt.WFH,
      elt.OTO,
      elt.VAC,
      elt.pCOM,
      elt.nCOM,
      elt.Submitted,
      console.log("data", elt),
    ]);
  }
    let content = {
      startY: 145,
      head: headers,
      body: uData,
    };
    let day = new Date();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = weekday[day.getDay()];
    let todayDate = moment(day).format("DD-MM-YYYY");
    console.log("days ", todayDate);
    doc.text(170, 50, "Datasoft Manufacturing & Assembly");
    doc.setFontSize(13);
    doc.text(245, 75, "Gulshan Branch");
    doc.setFontSize(11);
    doc.text(42, 105, "Submitted Time Cards");
    if (!has_permission("projects.add_projects")) {
      doc.text(42, 125, "Employee Name: " + pdfTitle);
    }
    doc.text(440, 360, "Total " + submitted.length + " Submitted");
    doc.autoTable(content);
    doc.save(pdfTitle + "_" + days + "_" + todayDate + "_" + ".pdf");
  };

  async function exportXL() {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("sheet1");
    sheet.mergeCells("B1:F2");
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
    sheet.mergeCells("C3:D3");
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
    sheet.getCell("A5").value = "Submitted Timecards";
    sheet.getRow(8).values = [
      "Weekending",
      "Name",
      "Total",
      "RHR",
      "SIC",
      "HOL",
      "PB1",
      "PB2",
      "WFH",
      "OTO",
      "VAC",
      "+COM",
      "-COM",
      "Submitted",
    ];
    sheet.getRow(8).font = {
      name: "Arial Black",
      family: 3,

      size: 9,
    };
    sheet.getRow(8).height = 20;
    sheet.columns = [
      { key: "Weekending", width: 20 },
      { key: "Name", width: 25 },
      { key: "Total",width: 10 },
      { key: "RHR", width: 10 },
      { key: "SIC", width: 10 },
      { key: "HOL", width: 10 },
      { key: "PB1", width: 10 },
      { key: "PB2", width: 10 },
      { key: "WFH", width: 10 },
      { key: "OTO", width: 10 },
      { key: "VAC", width: 10 },
      { key: "+COM", width: 10 },
      { key: "-COM", width: 10 },

      { key: "Submitted", width: 20 },
    ];
    console.log("submitted", submitted);
    if (selectedWeekend == "undefined" || selectedWeekend == null) {
      for (let i = 0; i < submitted_timecards.length; i++) {
        sheet.addRow({
          Weekending: submitted_timecards[i].Weekending,
          Name: submitted_timecards[i].Name,
          Total: submitted_timecards[i].Total,
          RHR: submitted_timecards[i].RHR,
          SIC: submitted_timecards[i].SIC,
          HOL: submitted_timecards[i].HOL,
          PB1: submitted_timecards[i].PB1,
          PB1: submitted_timecards[i].PB2,
          WFH: submitted_timecards[i].WFH,
          OTO: submitted_timecards[i].OTO,
          VAC: submitted_timecards[i].VAC,
          pCOM: submitted_timecards[i].pCOM,
          nCOM: submitted_timecards[i].nCOM,
          Submitted: submitted_timecards[i].Submitted,
        });
      }
      let row_num = submitted_timecards.length + 11;
      let total = submitted_timecards.length;
      if (total != 0) {
        sheet.getRow(row_num).values = ["Total Submitted =  " + submitted_timecards.length];
      }
    }
    else{

    for (let i = 0; i < pdfData.length; i++) {
      sheet.addRow({
        Weekending: pdfData[i].Weekending,
        Name: pdfData[i].Name,
        Total: pdfData[i].Total,
        RHR: pdfData[i].RHR,
        SIC: pdfData[i].SIC,
        HOL: pdfData[i].HOL,
        PB1: pdfData[i].PB1,
        PB2: pdfData[i].PB2,
        WFH: pdfData[i].WFH,
        OTO: pdfData[i].OTO,
        VAC: pdfData[i].VAC,
        pCOM: pdfData[i].pCOM,
        nCOM: pdfData[i].nCOM,
        Submitted: pdfData[i].Submitted,
      });
    }
    let row_num = pdfData.length + 11;
    let total = pdfData.length;
    if (total != 0) {
      sheet.getRow(row_num).values = ["Total Submitted =  " + pdfData.length];
    }
  }
    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = "application/octet-stream";
    const fileExtension = ".xlsx";
    const blob = new Blob([buffer], { type: fileType });
    const pdfTitle =
      profile_details.first_name + "_" + profile_details.last_name;
    let day = new Date();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = weekday[day.getDay()];
    let todayDate = moment(day).format("DD-MM-YYYY");

    const fileName =
      pdfTitle + "_" + days + "_" + todayDate + "_" + fileExtension;
    saveAs(blob, fileName);
  }
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalHrs, setTotalHrs] = useState(0);

  const nextSatDay = () => {
    var satday = new Date();
    for (let i = 0; i < 7; i++) {
      if (satday.getDay() === 6) {
        console.log("sat", satday);
        break;
      } else {
        satday = moment(satday).add(1, "day").toDate();
      }
    }
    satday = moment(satday).format("YYYY-MM-DD");
    return satday;
  };
  const dateRange = () => {
    var sdate = new Date();
    var edate = new Date();

    for (let i = 0; i < 7; i++) {
      if (sdate.getDay() === 0) {
        console.log("start", sdate);
        break;
      } else {
        sdate = moment(sdate).subtract(1, "day").toDate();
      }
    }
    console.log("end date", edate);

    setStartDate(moment(sdate).format("YYYY-MM-DD"));
    setEndDate(nextSatDay());

    return {
      start: moment(sdate).format("YYYY-MM-DD"),
      end: nextSatDay(),
    };
  };

  const assigneepdf = (item) => {
    //console.log("id : ", empid, "Name ", empName);
    //console.log("item", item.Weekending )
    let end= moment(item.Weekending).format("YYYY-MM-DD")
    
    let start = moment(item.Weekending).subtract(6, "day").toDate();
    start=  moment(start).format("YYYY-MM-DD")
    
    
    // const { start, end } = dateRange();
    // console.log("start end ", start, end)
    let empid = item.id
    let empName=item.Name

    API.get("wbs/user/time-card/list/" + empid + "/").then((res) => {
      //console.log("assignee tc", res.data);
      let temp = [];
      Array.from(res.data.data).forEach((item, idx) => {
        temp.push({ data: item });
      });
      console.log("temp", temp)
      let filteredData = temp;
      filteredData = temp.filter(
        (p) => p.data.date_updated >= start && p.data.date_updated <= end
      );

      console.log("filtered", filteredData);

      let hours_total = 0;
      let total_not_submitted = 0;
      let submittedtc = [];

      for (let index = 0; index < filteredData.length; index++) {
        if (filteredData[index].data.submitted == false) {
          total_not_submitted++;
        }
        if (filteredData[index].data.submitted == true) {
          //submittedtc[index] = filteredData[index]
          submittedtc.push(filteredData[index]);
          hours_total += parseFloat(filteredData[index].data.hours_today);
        }
      }
      console.log("submittedtcs", submittedtc);
      console.log("total hours", hours_total);
      exportPdfview(submittedtc, empName, end, hours_total, start);
    });
  };
  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <h3 className="timecards-page-header mb-3">Submitted Timecards</h3>
          </CCol>
          <CCol md="8" id="tableRef" className="d-flex justify-content-end">
            <h5 className="tiny-header--5 mt-3 mr-2">Export </h5>
            <div className="format-buttons mt-3 mb-3 ">
              <CButton
                className="file-format-download"
                onClick={() => {
                  exportPDF();
                }}
              >
                <CIcon name="cil-description" className="mr-2" /> PDF
              </CButton>
              <CButton
                className="file-format-download"
                onClick={() => {
                  exportXL();
                }}
              >
                <CIcon name="cil-spreadsheet" className="mr-2" />
                Excel
              </CButton>
            </div>
          </CCol>
        </CRow>
        <CRow >
          <CCol xl="3" lg="3" md="6">
            {/* <CLabel className="custom-label-5" htmlFor="assigneeSelect">
              Company :{" "}
              {profile_details.slc_details?.slc?.department?.company?.name}
            </CLabel> */}
            <div>
              <CLabel className="custom-label-5" htmlFor="assigneeSelectPM">
                Select Weekending
              </CLabel>
              <Select
                closeMenuOnSelect={true}
                placeholder={""}
                id="assigneeSelectPM"
                minHeight="35px"
                isClearable={true}
                isMulti={false}
                onChange={handleWeekendChange}
                classNamePrefix="custom-forminput-6"
                options={weekendingList}
                value={selectedWeekend}
                //styles={colourStyles}
              />
            </div>
          </CCol>
        </CRow>
        <CRow>
          {!has_permission("projects.add_projects") && (
            <CCol>
              {/* <CLabel className="custom-label-5" htmlFor="assigneeSelect">
                Employee Name :{" "}
                {capitalize(profile_details.first_name) +
                  " " +
                  capitalize(profile_details.last_name)}
              </CLabel> */}
            </CCol>
          )}
        </CRow>
        <CRow className="mt-5">
          <CCol>
            {console.log("HEADERS",headers)}
            {headers===undefined?null:
            <CDataTable
            //items={submittedTimecards.length==0? submitted_timecards:submittedTimecards}
            items={populate_data()}
            fields={headers}
            // fields={[
            //   {
            //     key: "Weekending",
            //     _style: { width: "15%" },
            //     _classes: "font-weight-bold",
            //   },
            //   "Name",
            //   "Total",
            //   {
            //     key: "RHR",
            //     sorter: false,
            //   },
            //   {
            //     key: "SIC",
            //     sorter: false,
            //   },
            //   {
            //     key: "HOL",
            //     sorter: false,
            //   },
            //   {
            //     key: "PB1",
            //     sorter: false,
            //   },
            //   {
            //     key: "PB2",
            //     sorter: false,
            //   },
            //   {
            //     key: "WFH",
            //     sorter: false,
            //   },
            //   {
            //     key: "OTO",
            //     sorter: false,
            //   },
            //   {
            //     key: "VAC",
            //     sorter: false,
            //   },
            //   {
            //     key: '-COM',
            //     sorter: false,
            //   },
            //   {
            //     key: "+COM",
            //     sorter: false,
            //   },
            //   {
            //     key: "Submitted",
            //     sorter: false,
            //   },
            // ]}
            itemsPerPage={10}
            pagination
            striped
            bordered
            sorter
            scopedSlots={{
              Name: (item) => (
                <td>
                  <a
                    onClick={() => {
                      assigneepdf(item);
                      //assigneepdf(item["id"], item["Name"]);
                    }}
                    size="sm"
                    type="button"
                    color="primary"
                  >
                    <u> {item["Name"]}</u>
                  </a>
                </td>
              ),
            }}
          />}
            {/* <CDataTable
              //items={submittedTimecards.length==0? submitted_timecards:submittedTimecards}
              items={populate_data()}
              fields={headers}
              // fields={[
              //   {
              //     key: "Weekending",
              //     _style: { width: "15%" },
              //     _classes: "font-weight-bold",
              //   },
              //   "Name",
              //   "Total",
              //   {
              //     key: "RHR",
              //     sorter: false,
              //   },
              //   {
              //     key: "SIC",
              //     sorter: false,
              //   },
              //   {
              //     key: "HOL",
              //     sorter: false,
              //   },
              //   {
              //     key: "PB1",
              //     sorter: false,
              //   },
              //   {
              //     key: "PB2",
              //     sorter: false,
              //   },
              //   {
              //     key: "WFH",
              //     sorter: false,
              //   },
              //   {
              //     key: "OTO",
              //     sorter: false,
              //   },
              //   {
              //     key: "VAC",
              //     sorter: false,
              //   },
              //   {
              //     key: '-COM',
              //     sorter: false,
              //   },
              //   {
              //     key: "+COM",
              //     sorter: false,
              //   },
              //   {
              //     key: "Submitted",
              //     sorter: false,
              //   },
              // ]}
              itemsPerPage={10}
              pagination
              striped
              bordered
              sorter
              scopedSlots={{
                Name: (item) => (
                  <td>
                    <a
                      onClick={() => {
                        assigneepdf(item);
                        //assigneepdf(item["id"], item["Name"]);
                      }}
                      size="sm"
                      type="button"
                      color="primary"
                    >
                      <u> {item["Name"]}</u>
                    </a>
                  </td>
                ),
              }}
            /> */}
            <div class="alert alert-info" role="alert">
              <CRow>
                <CCol md="9"></CCol>
                {has_permission("projects.add_projects") && (
                <CCol md="3">
                  {
                    <small>
                      {"   "}
                      Total{" "}
                      <b>
                        &nbsp;{uniqBy(populate_data(), 'Name').length} / {assignees} &nbsp;
                      </b>
                      {/* Total <b>&nbsp;{submittedAssignees()}{" "} / {assignees} &nbsp;</b> */}
                      Employees Submitted
                    </small>
                  }
                </CCol>
                )}
                {!has_permission("projects.add_projects") && (
                <CCol md="3">
                  {
                    <small>
                      {"   "}
                      Total{" "}
                      <b>
                      &nbsp;{populate_data().length}{" "} &nbsp;
                      </b>
                      {/* Total <b>&nbsp;{submittedAssignees()}{" "} / {assignees} &nbsp;</b> */}
                    Submitted
                    </small>
                  }
                </CCol>
                )}
              </CRow>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default SubmittedTimecards;
