import React, { useState } from 'react';
import "../timecards/timeCards.css";
import { useFormik } from "formik";
import { BASE_URL, USER_ID } from '../../Config';
import { API } from '../../Config';
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import CIcon from '@coreui/icons-react';
import moment from "moment";
import { CDataTable, CCardBody, CCard, CForm, CButton, CInput, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CContainer, CRow, CCol, CLabel, CTextarea } from '@coreui/react';
import LinearProgress from '@mui/material/LinearProgress';
import { useSnackbar } from "notistack";

const WeeklyTimecards = () => {
    const profile_details = useSelector(state => state.profile.data)
    const [tableData, setTabledata] = useState([]);
    let newArray = [];
    const [pdfData, setPdfData] = useState([])
    const [pdfTitle, setPdfTitle] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [projectList, setProjectList] = useState([]);
    const [userData, setUserData] = useState([])
    const [totalHrs, setTotalHrs] = useState(0);
    const [editModal, setEditModal] = useState(false);
    var project = []
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
        window.scrollTo(0, 0);
        getWeeklyTimecard();
    }, [])

    function getWeeklyTimecard(){
        API.get('wbs/user-wise/weekly-time-card/' + sessionStorage.getItem(USER_ID) + '/').then((res) => {
            setStartDate(res.data.start_date);
            setEndDate(res.data.end_date);

            if (res.data.data != undefined) {
                res.data.data.forEach((item, idx) => {
                    project.push(item.project.sub_task)
                    console.log("subtask",item.project.task_title)
                    var newItem = {
                        id: item.id,
                        project: item.project,
                        time_card_assignee: item.time_card_assignee,
                        actual_work_done: item.actual_work_done,
                        time_type: item.time_type,
                        submitted: item.submitted,
                        hours_today: item.hours_today,
                        date_created: item.date_created,
                        date_updated: item.date_updated, 
                        task_title: item.project.task_title
                    };
                    newArray.push(newItem);
                });
            }
            console.log(project)
            console.log('new array', newArray)
            setPdfData(newArray);
            {/**let's populate the damn table,shall we?**/ }
            if (newArray.length != 0 || newArray != undefined) {
                let temp_array = []
                var temp_totalHrs = 0;
                for (let index = 0; index < newArray.length; index++) {
                    const element = newArray[index];
                    temp_totalHrs += parseFloat(element.hours_today);
                    console.log("ddddddddd",element)
                    var weekday = moment(element.date_updated).weekday();
                    const days = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    const week = dates()

                    {/**final push to gtable */ }
                    temp_array.push({
                        'Date':week[index],
                        'Days': days[index],
                        'Task':element.task_title,
                        'WP': element.project.work_package_number ,
                        'id': element.id,
                        'WBS': element.actual_work_done,
                        'Time': element.time_type,
                        'Sunday': weekday == 0 ? element.hours_today : '',
                        'Monday': weekday == 1 ? element.hours_today : '',
                        'Tuesday': weekday == 2 ? element.hours_today : '',
                        'Wednesday': weekday == 3 ? element.hours_today : '',
                        'Thursday': weekday == 4 ? element.hours_today : '',
                        'Friday': weekday == 5 ? element.hours_today : '',
                        'Saturday': weekday == 6 ? element.hours_today : '',
                        'Total': element.hours_today
                    })
                    console.log(moment(element.date_updated).weekday())
                }
                temp_array.push({
                    'Date':'',
                    'Days':'',
                    'Task':'', 
                    'WP': '',
                    'id': '',
                    'WBS': '',
                    'Time': '',
                    'Sunday': '',
                    'Monday': '',
                    'Tuesday': '',
                    'Wednesday': '',
                    'Thursday': '',
                    'Friday': '',
                    'Saturday': '',
                    'Total': 'Total = ' + temp_totalHrs.toFixed(1)
                })
                setTabledata(temp_array)
                setUserData(temp_array)
                setTotalHrs(temp_totalHrs.toFixed(1))
                console.log("table", temp_array)
                console.log("tabledata from weekly timecard", totalHrs)
            }
        })
    }

    React.useEffect(() => {
        setProjectList(project);
    }, []);

    {/*initialize form */ }
    const editForm = useFormik({
        initialValues: {
            wbs: "",
            time: "",
            hrs: "",

        },
        validateOnBlur: true,
        validateOnChange: true,
        // onSubmit: getTimeCards
    })

    {/**export fetched tabledata to excel */ }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = (csvData, fileName) => {
        console.log(csvData)
        var temp_data = []
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
   
    const dates =()=>{
        var day = new Date ();
        for(let i =0;i<7;i++){
            if(day.getDay()===0){
                day = moment(day).toDate();
            }
            else{
                const sub = day.getDay()
                day = moment(day).subtract(sub, "day").toDate();
            }
             
           
        }
        const days=[]
        days[0]=day.getDate()+'/'+day.getMonth()+'/'+day.getFullYear()

        for(let i=1;i<7;i++){

              var d = moment(day).add(i, "day").toDate();
              console.log("dd", d)
              days.push( d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear())
        }
        day = day.getDate()+'/'+day.getMonth()+'/'+day.getFullYear()
        console.log("week", days);
        return days;
    }

    React.useEffect(() => {console.log("weeeeeeeek", dates())},[]);


    /**export fetched data to pdf */
    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(12);
      //  doc.rect(130, 30, 600, 40);
        
        const title = profile_details.first_name + "_" + profile_details.last_name + "_" + "Timecard_" + moment(startDate).format("DD/MM/YYYY") + "-" + moment(endDate).format("DD/MM/YYYY");
        const headers = [[
           
            "Date",
            "Days",
            "Task Title",
            "Hours", 
            "Hours Type"
           
        ]];
        console.log("pdfData", pdfData)
        //console.log("table1111111", tableData.Task)
        const uData = tableData.map((elt, idx) => [
           
            elt.Date,
            elt.Days,
            elt.Task,
            elt.Total,
            elt.Time,
        ])
        let content = {
            startY: 120,
            head: headers,
            body: uData
        };
        const edate= moment(endDate).format("DD/MM/YYYY")
        const name =profile_details.first_name + " " + profile_details.last_name 
        doc.text(150, 50, "Datasoft Manufacturing & Assembly Gulshan Branch")
        doc.text(42,80, "Emplyee Time card")
        doc.text(420, 80, "Week-Ending: "+ edate)
        doc.text(42, 100, "Name: "+ name)
        doc.text(420, 100, "NID: ")   
        doc.text(42, 330, "Submitted : (date & Time)")
        doc.autoTable(content);
        doc.save(profile_details.first_name + "_" + profile_details.last_name + "_" + "Timecard_" + moment(startDate).format("DD/MM/YYYY") + "-" + moment(endDate).format("DD/MM/YYYY") + ".pdf")
    }

    const timeType = [
        { value: "RHR", label: "RHR" },
        { value: "OTO", label: "OTO" }
    ]

    function updateTimeCard(event, item) {
        console.log(event.target.value, item)
        var data = {
            "time_type": event.target.value,
            "hours_today": item.Total,
            "date_updated": ""
        }
        API.put('wbs/time-card/update/' + item.id + '/', data).then((res) => {
            console.log(res)
            if(res.status === 200){
                getWeeklyTimecard();
                enqueueSnackbar('Time type update succefull.', { variant: 'info' })
            }
        })
    }

    function updateTimeCardHrs(event, item) {
        console.log(event.target.value, item)
        var data = {
            "time_type": item.Time,
            "hours_today": event.target.value,
            "date_updated": ""
        }
        API.put('wbs/time-card/update/' + item.id + '/', data).then((res) => {
            console.log(res)
            if(res.status === 200){
                getWeeklyTimecard();
                enqueueSnackbar('Actual hours update succefull.', { variant: 'info' })
            }
        })
    }

    return (
        <>
            <CContainer>
                <h3 className="timecards-page-header mb-3">Weekly Timecard</h3>
                <CRow>
                    {/**Export buttons */}
                    {tableData.length != 0 && <CCol md="12">
                        <h5 className="tiny-header--5 mt-0">Export</h5>
                        <div className="format-buttons mt-3 mb-3">
                            <CButton className="file-format-download" onClick={() => exportPDF()}><CIcon name="cil-description" className="mr-2" />PDF</CButton>
                            <CButton className="file-format-download" onClick={() => exportToCSV(tableData, profile_details.first_name + "_" + profile_details.last_name + "_" + "Timecard_" + moment(startDate).format("DD/MM/YYYY") + "-" + moment(endDate).format("DD/MM/YYYY"))} ><CIcon name="cil-spreadsheet" className="mr-2" />Excel</CButton>
                            {/* <CButton className="file-format-download">Print</CButton> */}
                        </div>
                    </CCol>
                    }
                    {/**view timecard data */}
                    <CCol md="4">
                        Name: {profile_details.first_name + " " + profile_details.last_name}<br />
                        Phone: +{profile_details.phone}
                    </CCol>
                    <CCol md="4">
                        Week: {moment(startDate).format("DD/MM/YYYY")} - {moment(endDate).format("DD/MM/YYYY")} <br />
                        Month: {moment(endDate).format('MMMM')} <br />
                        Year: {moment(endDate).format('YYYY')}
                    </CCol>
                    <CCol md="4">
                        Project Name(s): {[...new Set(projectList)].map((item, idx) => (
                            <span>{item}{idx < projectList.length - 1 && <span>, </span>}</span>
                        ))}
                    </CCol>
                    {<CCol md="12">
                        <div className="mt-4 mb-2">
                            <CDataTable items={tableData} fields={[
                                {
                                    key: "WP",
                                    _style: { width: "auto" },
                                    _classes: "font-weight-bold",
                                },
                                'WBS',
                                {
                                    key: 'Time',
                                    _style: { width: '100px' }
                                },
                                {
                                    key: 'Sunday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Monday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Tuesday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Wednesday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Thursday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Friday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Saturday',
                                    _style: { width: '70px' }
                                },
                                {
                                    key: 'Total',
                                    _style: { width: 'auto' }
                                },
                            ]}
                                primary
                                hover
                                striped
                                bordered
                                size="sm"
                                scopedSlots={{
                                    'Time':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Time != "" && <select onChange={(event) => { updateTimeCard(event, item) }}>
                                                        {timeType.map(ele => (
                                                            <option selected={ele.value == item.Time}>{ele.value}</option>
                                                        ))
                                                        }
                                                    </select>}
                                                </td>
                                            )
                                        },
                                    'Sunday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Sunday != "" && <CInput name="Sunday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Sunday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Monday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Monday != "" && <CInput name="Monday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Monday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Tuesday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Tuesday != "" && <CInput name="Tuesday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Tuesday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Wednesday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Wednesday != "" && <CInput name="Wednesday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Wednesday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Thursday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Thursday != "" && <CInput name="Thursday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Thursday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Friday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Friday != "" && <CInput name="Friday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Friday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                    'Saturday':
                                        (item, index) => {
                                            return (
                                                <td className="py-2">
                                                    {item.Saturday != "" && <CInput name="Saturday" type="number" onBlur={(event) => { updateTimeCardHrs(event, item) }} defaultValue={item.Saturday} className="custom-forminput-6" />}
                                                </td>
                                            )
                                        },
                                }}
                            >
                            </CDataTable>
                        </div>
                    </CCol>}
                </CRow>
            </CContainer>
        </>
    )
}
export default WeeklyTimecards;