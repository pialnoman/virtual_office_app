import { API, PERMISSIONS } from "./Config"
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

export const hours_spent_left=(user_id)=>{
  API.get('organizations/user/hours/used-left/'+user_id+'/').then((res)=>{
    console.log('used and left hours',res.data.data)
    return res.data.data
  })
}
export const user_groups = () => {
    //let temp=[]
    let groups = sessionStorage.getItem('groups').split(',')
    return groups
}

export const has_group = (group) => {
    let groups = user_groups()
    if (groups.includes(group)) {
        return true
    }
    return false
}
export const has_permission=(permission)=>{
    if(sessionStorage.getItem(PERMISSIONS)!=null){
        let permissions = sessionStorage.getItem(PERMISSIONS).split(',')
        return permissions.includes(permission)
    }
    return false
}
export function arrayRemoveItem(arr, value) {
    return arr.filter(function (ele) {
        // console.log('ele',ele,'value',value)
        return ele != value;
    });
}

export const getBuildDate = (epoch) => {
    const buildDate = moment(epoch).format("DD-MM-YYY HH:MM");
    return buildDate;
};
export function capitalize(string) {
    if (string != undefined) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return ''
}

export function capitalizeFirstLetter(string="") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function unique_elements(array){
    return array.filter((v, i, a) => a.indexOf(v) == i);
}


export const exportPDF = (profile_details,startDate,endDate,pdfData,tableData) => {
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
        startY: 140,
        head: headers,
        body: uData
    };
    const edate= moment(endDate).format("DD/MM/YYYY")
    const name =profile_details.first_name + " " + profile_details.last_name 
    doc.setFontSize(18);
    doc.text(90, 50, "Datasoft Manufacturing & Assembly Gulshan Branch")
    doc.setFontSize(12);
    doc.text(42,100, "Employee Time card")
    doc.text(420, 100, "Week-Ending: "+ edate)
    doc.text(42, 120, "Name: "+ name)
    doc.text(420, 120, "NID: ")   
    doc.text(42, 350, "Submitted : (date & Time)")
    doc.autoTable(content);
    doc.save(profile_details.first_name + "_" + profile_details.last_name + "_" + "Timecard_" + moment(startDate).format("DD/MM/YYYY") + "-" + moment(endDate).format("DD/MM/YYYY") + ".pdf")
}

export async function exportxl(pdfData, pdfTitle, endDate, totalHrs, startDate) {
    console.log("pdf", pdfData.length)
    console.log("pdftitle", pdfTitle);
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("sheet1");

    sheet.mergeCells("C1:E2");
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
    sheet.mergeCells("C3:E3");
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
    sheet.getCell("A5").value = "Actual Worked Hours";

    sheet.mergeCells("F6:G6");
    const endate = moment(endDate).format("DD/MM/YYYY");
    //sheet.getCell("F6").value = "Week-Ending: " + endDate;

    sheet.mergeCells("A6:D6");
    sheet.getCell("A6").value = "Name: " + pdfTitle;

    var borderStyles = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getRow(8).values = [
      "WP",
      "Project Name",
      "Task Title",
      "Description",
      "Hour(s)",
      "Type",
      "Date Created",
    ];
    sheet.getRow(8).font = {
      name: "Arial Black",
      family: 3,

      size: 10,
    };

    sheet.getRow(8).height = 20;
    sheet.columns = [
      { key: "wp", width: 10 },
      { key: "name", width: 30 },
      { key: "task_title", width: 32 },
      { key: "description", width: 32 },
      { key: "hours", width: 17 },
      { key: "type", width: 15 },
      { key: "date_created", width: 15 },
    ];

    for (let i = 0; i < pdfData.length; i++) {
      sheet.addRow({
        wp: pdfData[i].data.project.work_package_number,
        name: pdfData[i].data.project.sub_task,
        task_title: pdfData[i].data.project.task_title,
        description: pdfData[i].data.actual_work_done,
        hours: pdfData[i].data.hours_today,
        type: pdfData[i].data.time_type,
        date_created: pdfData[i].data.date_created,
      });
    }
    let row_num = pdfData.length + 11;
    if (totalHrs != 0) {
      let cell_num = pdfData.length + 10;
      sheet.getRow(cell_num).values = [
        "",
        "",
        "",
        "",
        "Total=" + Number(totalHrs).toFixed(2),
      ];
    }

    if (totalHrs != 0) {
      sheet.getRow(row_num).values = ["From " + startDate + " to " + endDate];
    }

    let day = new Date();
    let time = day.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    day = moment(day).format("DD/MM/YY");
    //sheet.getRow(row_num + 1).values = ["Submitted : " + time + "  " + day];

    const buffer = await workbook.xlsx.writeBuffer(pdfData);
    const fileType = "application/octet-stream";
    const fileExtension = ".xlsx";
    const blob = new Blob([buffer], { type: fileType });
    
    let today = new Date();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = weekday[today.getDay()];
    let todayDate = moment(today).format("DD-MM-YYYY");
    //let pdf = pdfTitle.replace(/\s/g, '_')
    let pdf = pdfTitle
    const fileName = pdf +"_"+ days + "_" + todayDate +fileExtension;
    saveAs(blob, fileName);
    
  } 

  export function exportPdf  (pdfData, pdfTitle, endDate, totalHrs, startDate )  {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const headers = [
      [
        "WP",
        "Project Name",
        "Task Title",
        "Description",
        "Hour(s)",
        "Type",
        "Date Created",
      ],
    ];

    const uData = pdfData.map((elt, idx) => [
      elt.data.project.work_package_number,
      elt.data.project.sub_task,
      elt.data.project.task_title,
      elt.data.actual_work_done,
      elt.data.hours_today,
      elt.data.time_type,
      elt.data.date_created,
    ]);

    let content = {
      startY: 145,
      head: headers,
      body: uData,
    };

    let day = new Date();
    let time = day.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    day = moment(day).format("DD/MM/YY");
    const edate = moment(endDate).format("DD/MM/YYYY");

    doc.setFontSize(17);
    doc.text(170, 50, "Datasoft Manufacturing & Assembly");
    doc.setFontSize(13);
    doc.text(245, 75, "Gulshan Branch");
    doc.setFontSize(11);
    doc.text(42, 105, "Actual Worked Hours");
    // doc.text(410, 105, "Week-Ending: " + edate); //+ edate)
    doc.text(42, 125, "Name: " + pdfTitle); //+ name)
    doc.autoTable(content);
    let date = new Date();
    console.log("date", date);
    if (totalHrs != 0) {
      doc.text(
        42,
        doc.lastAutoTable.finalY+25,
        "From " +
          startDate +
          " to " +
          endDate 
         
      );
    }
    doc.text(430, doc.lastAutoTable.finalY+25, " Total Hours " + Number(totalHrs).toFixed(2))
    //doc.text(396, doc.lastAutoTable.finalY+25, "Submitted : " + time + "  " + day);
    let today = new Date();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = weekday[today.getDay()];
    let todayDate = moment(today).format("DD-MM-YYYY");
    //let pdf = pdfTitle.replace(/\s/g, '_')
    let pdf = pdfTitle
    doc.save(pdf +"_"+ days + "_" + todayDate +".pdf");
    console.log("data", pdfData);
  };
  export function exportPdfview  (pdfData, pdfTitle, endDate, totalHrs, startDate )  {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const headers = [
      [
        "WP",
        "Project Name",
        "Task Title",
        "Description",
        "Hour(s)",
        "Type",
        "Date Created",
      ],
    ];

    const uData = pdfData.map((elt, idx) => [
      elt.data.project.work_package_number,
      elt.data.project.sub_task,
      elt.data.project.task_title,
      elt.data.actual_work_done,
      elt.data.hours_today,
      elt.data.time_type,
      elt.data.date_created,
    ]);

    let content = {
      startY: 145,
      head: headers,
      body: uData,
    };

    let day = new Date();
    let time = day.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    day = moment(day).format("DD/MM/YY");
    const edate = moment(endDate).format("DD/MM/YYYY");

    doc.setFontSize(17);
    doc.text(170, 50, "Datasoft Manufacturing & Assembly");
    doc.setFontSize(13);
    doc.text(245, 75, "Gulshan Branch");
    doc.setFontSize(11);
    doc.text(42, 105, "Actual Worked Hours");
    // doc.text(410, 105, "Week-Ending: " + edate); //+ edate)
    doc.text(42, 125, "Name: " + pdfTitle); //+ name)
    doc.autoTable(content);
    let date = new Date();
    console.log("date", date);
    if (totalHrs != 0) {
      doc.text(
        42,
        doc.lastAutoTable.finalY+25,
        "From " +
          startDate +
          " to " +
          endDate 
         
      );
    }
    doc.text(430, doc.lastAutoTable.finalY+25, " Total Hours " + Number(totalHrs).toFixed(2))
    //doc.text(396, doc.lastAutoTable.finalY+25, "Submitted : " + time + "  " + day);
    let today = new Date();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = weekday[today.getDay()];
    let todayDate = moment(today).format("DD-MM-YYYY");
    let pdf = pdfTitle.replace(/\s/g, '_')
    //doc.save(pdf +"_"+ days + "_" + todayDate +".pdf");
    window.open(doc.output("bloburl"), "_blank");
    console.log("data", pdfData);
  };