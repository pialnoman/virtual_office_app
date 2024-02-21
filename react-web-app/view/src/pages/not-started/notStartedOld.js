import React, { useState, useEffect } from "react";
import "./notStarted.css";
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

const NoWbs = () => {
  const [notStartedWBS, setNotStartedWBS] = useState([]);
  const [tdooptions, settdooptions] = useState([]);
  const [notstaredDetails, setnotstaredDetails] = useState([]);
  const [initialwbs, setinitialwbs] = useState([]);
  const [table, setTable] = useState([]);
  const [response, setresponse] = useState([]);

  let history = useHistory();
  const [selectedProject, setSelectedProject] = useState([]);
  const [fetchproject, setfetchproject] = useState([]);
  const [tdos, setTdos] = useState([]);

  const populateOption = (a) => {
    let list = [];
    for (let i = 0; i < a.length; i++) {
      list.push({
        data: a[i],
        label: a[i].project.task_delivery_order.title,
        value: a[i].project.task_delivery_order.id,
      });
    }
    list.unshift({
      label: "Select All",
      value: "all",
      data: {},
    });
    console.log("list", uniqBy(list, "value"));
    setTdos(uniqBy(list, "value"));
    settdooptions(uniqBy(list, "value"));

    let info = [];

    for (let i = 0; i < a.length; i++) {
      let everyone = a[i].allassignees;

      info.push({
        data: a[i],
        name: a[i].project.sub_task,
        tdo: a[i].project.task_delivery_order.title,
        id: a[i].project.task_delivery_order.id,
        startDate: a[i].project.date_created,
        endDate: a[i].project.planned_delivery_date,
        allassignees: a[i].allassignees,
        everyone: [],
        total: Number(a[i].assignees.length),
        assignees: a[i].assignees,
        wbs: a[i].project.wbs_list.length,
        nowbspeople: [],
        taskTitle: a[i].project.task_title,
      });
      for (let j = 0; j < everyone.length; j++) {
        //console.log("every", everyone[j]);
        let a =
          everyone[j].assignee.first_name +
          " " +
          everyone[j].assignee.last_name;

        info[i].everyone.push(a);
      }
      let itm = a[i].assignees;
      for (let item = 0; item < itm.length; item++) {
        let assi =
          itm[item].assignee.first_name +
          " " +
          itm[item].assignee.last_name +
          ",";
        info[i].nowbspeople.push(assi);
      }
    }
    console.log("info array", info);
    setnotstaredDetails(info);
    setfilteredProjects(info);

    let initialWBSInfo = [];
    for (let i = 0; i < a.length; i++) {
      let assignees = a[i].allassignees;
      initialWBSInfo.push({
        assignees: a[i].allassignees,
        date_created: a[i].project.date_created,
        date_updated: a[i].project.date_updated,
        description: a[i].project.description,
        estimated_person: a[i].project.estimated_person,
        id: a[i].project.id,
        planned_delivery_date: a[i].project.planned_delivery_date,
        planned_hours: a[i].project.planned_hours,
        planned_value: a[i].project.planned_value,
        pm: a[i].project.pm,
        remaining_hours: a[i].project.remaining_hours,
        start_date: a[i].project.start_date,
        status: a[i].project.status,
        sub_task: a[i].project.sub_task,
        task_delivery_order: a[i].project.task_delivery_order,
        task_title: a[i].project.task_title,
        work_package_index: a[i].project.work_package_index,
        work_package_number: a[i].project.work_package_number,
      });
    }
    setinitialwbs(initialWBSInfo);
    console.log("wbsinfoarray", initialWBSInfo);
  };

  const data_populate = (a) => {
    console.log("data passed", a);

    let tableData = [];
    for (let i = 0; i < a.length; i++) {
      let temp = [];
      let temp1 = [];
      let allassignee = a[i].allassignees;
      let noWBS = a[i].assignees;

      for (let j = 0; j < allassignee.length; j++) {
        let a =
          capitalize(allassignee[j].assignee.first_name) +
          " " +
          capitalize(allassignee[j].assignee.last_name);
        //  tableData[i].Assignees.push(a)
        temp.push(a);
      }

      for (let j = 0; j < noWBS.length; j++) {
        let a =
          capitalize(noWBS[j].assignee.first_name) +
          " " +
          capitalize(noWBS[j].assignee.last_name);
        //  tableData[i].Assignees.push(a)
        temp1.push(a);
      }

      if (a[i].assignees.length != 0) {
        tableData.push({
          TDO: a[i].project.task_delivery_order.title,
          "Sub Task": a[i].project.sub_task,
          "Task Title": a[i].project.task_title,
          "Planned Delivery Date": a[i].project.planned_delivery_date,
          Assignees: temp,
          "Assignees with no WBS": temp1,
          id: a[i].project.id,
        });
      }
    }
    console.log("aa", tableData);
    setTable(tableData);
    //setmyProjectDetails(a)
    // for(let j=0;j<a.length;j++)
    // {
    // let wbs=[]
    // let temp = [];
    // let temp1 = [];
    // let allassignee = res.data.data[i].allassignees;
    // let noWBS = res.data.data[i].assignees;
    // for(let i=0;i<a.length;i++)
    // {
    //     wbs.push({
    //       TDO: a[i].project.task_delivery_order.title,
    //         "Sub Task": a[i].project.sub_task,
    //         "Task Title": a[i].project.task_title,
    //         "Planned Delivery Date":
    //           a[i].project.planned_delivery_date,
    //         Assignees: temp,
    //         "Assignees with no WBS": temp1,
    //         "id": a[i].project.id,
    //     })
    // }

    //   console.log('wbs', wbs)
    // }
    let info = [];
    for (let i = 0; i < a.length; i++) {
      let everyone = a[i].allassignees;
      info.push({
        data: a[i],
        name: a[i].project.sub_task,
        tdo: a[i].project.task_delivery_order.title,
        id: a[i].project.task_delivery_order.id,
        startDate: a[i].project.date_created,
        endDate: a[i].project.planned_delivery_date,
        allassignees: a[i].allassignees,
        everyone: [],
        total: Number(a[i].assignees.length),
        assignees: a[i].assignees,
        wbs: a[i].project.wbs_list.length,
        nowbspeople: [],
        taskTitle: a[i].project.task_title,
      });
      for (let j = 0; j < everyone.length; j++) {
        let a =
          everyone[j].assignee.first_name +
          " " +
          everyone[j].assignee.last_name;

        info[i].everyone.push(a);
      }
      let itm = a[i].assignees;
      for (let item = 0; item < itm.length; item++) {
        let assi =
          itm[item].assignee.first_name +
          " " +
          itm[item].assignee.last_name +
          ",";
        info[i].nowbspeople.push(assi);
      }
    }
    console.log("info array from populate", info);
    setfilteredProjects(info);
    let initialWBSInfo = [];
    for (let i = 0; i < a.length; i++) {
      let assignees = a[i].allassignees;
      initialWBSInfo.push({
        assignees: a[i].allassignees,
        date_created: a[i].project.date_created,
        date_updated: a[i].project.date_updated,
        description: a[i].project.description,
        estimated_person: a[i].project.estimated_person,
        id: a[i].project.id,
        planned_delivery_date: a[i].project.planned_delivery_date,
        planned_hours: a[i].project.planned_hours,
        planned_value: a[i].project.planned_value,
        pm: a[i].project.pm,
        remaining_hours: a[i].project.remaining_hours,
        start_date: a[i].project.start_date,
        status: a[i].project.status,
        sub_task: a[i].project.sub_task,
        task_delivery_order: a[i].project.task_delivery_order,
        task_title: a[i].project.task_title,
        work_package_index: a[i].project.work_package_index,
        work_package_number: a[i].project.work_package_number,
      });
    }
    setinitialwbs(initialWBSInfo);
    console.log("wbsinfoarray", initialWBSInfo);
  };

  const projects = useSelector((state) => {
    let e = [];
    Array.from(state.projects.pm_projects).forEach((item, idx) => {
      e.push(item);
    });
    //console.log("all Projects", e);
    return e;
  });
  const [filteredProjects, setfilteredProjects] = useState(projects);

  const filter_notStarted_by_projects = (options) => {
    let temp = [];
    console.log("filter", options);
    if (options.find((item) => item.value == "all")) {
      temp.push(notstaredDetails);
      console.log("temp all", temp);
    } else {
      for (let index = 0; index < options.length; index++) {
        for (let index1 = 0; index1 < notstaredDetails.length; index1++) {
          if (
            options[index].value ==
            notstaredDetails[index1].data.project.task_delivery_order.id
          ) {
            console.log(
              options[index].value,
              "matched! ",
              notstaredDetails[index1].data.project.task_delivery_order.id
            );

            temp.push(notstaredDetails[index1].data);
          }
        }
      }
      console.log("filtered array", temp);
    }
    data_populate(temp);
  };

  const handleProjectChange = (value, actionMeta) => {
    console.log("select ", value, "action ", actionMeta);
    if (actionMeta.action == "select-option") {
      if (value.find((item) => item.value == "all")) {
        filter_notStarted_by_projects(
          tdooptions.filter((item) => item.value != "all")
        );
        setSelectedProject(tdooptions.filter((item) => item.value != "all"));
        console.log("value", value);
      } else {
        setSelectedProject(value);
        console.log("value", value);
        filter_notStarted_by_projects(value);
      }
    } else if (actionMeta.action == "clear") {
      setSelectedProject([]);
      filter_notStarted_by_projects(
        tdooptions.filter((item) => item.value != "all")
      );
    } else if (actionMeta.action == "remove-value") {
      setSelectedProject(value);
      if (value.length == 0) {
        filter_notStarted_by_projects(
          tdooptions.filter((item) => item.value != "all")
        );
      } else {
        filter_notStarted_by_projects(value);
      }
    }
  };
  React.useEffect(() => {
    if (projects.length > 0 && fetchproject.length == 0) {
      setfetchproject(projects);
    }
  }, [projects]);
  function capitalize(string) {
    if (string != undefined) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return "";
  }

  const createWBS = (item) => {
    console.log("item", item);
    let wbs = [];
    for (let i = 0; i < response.length; i++) {
      if (response[i].project.id == item.id) {
        console.log("match", response[i]);
        let a = response[i];
        wbs.push({
          assignees: a.assignees,
          date_created: a.project.date_created,
          date_updated: a.project.date_updated,
          description: a.project.description,
          estimated_person: a.project.estimated_person,
          id: a.project.id,
          planned_delivery_date: a.project.planned_delivery_date,
          planned_hours: a.project.planned_hours,
          planned_value: a.project.planned_value,
          pm: a.project.pm,
          remaining_hours: a.project.remaining_hours,
          start_date: a.project.start_date,
          status: a.project.status,
          sub_task: a.project.sub_task,
          task_delivery_order: a.project.task_delivery_order,
          task_title: a.project.task_title,
          work_package_index: a.project.work_package_index,
          work_package_number: a.project.work_package_number,
        });
      }
    }

    history.push({
      pathname: "/dashboard/WBS/create-wbs",
      state: { task: wbs[0] },
    });
  };

  const dateOver = (endDate) => {
    let today = new Date();
    const moment = require("moment");
    let daysleft = moment(endDate).diff(moment(today), "days");
    console.log("end date", endDate);
    console.log("days left ", daysleft + 1);
    if (daysleft + 1 <= 0) {
      return false;
    }
    return true;
  }; 
  React.useEffect(() => {
    API.get("project/assignees-with-no-wbs/").then((res) => {
      let temp = [];
      console.log("api response", res.data.data);

      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].assignees.length != 0  && dateOver(res.data.data[i].project.planned_delivery_date)) {
          temp.push(res.data.data[i]);
        }
      }
       console.log('response', temp)

      setresponse(temp);

      let tableData = [];

      for (let i = 0; i < res.data.data.length; i++) {
        if(dateOver(res.data.data[i].project.planned_delivery_date)){
        let temp = [];
        let temp1 = [];
        let allassignee = res.data.data[i].allassignees;
        let noWBS = res.data.data[i].assignees;

        for (let j = 0; j < allassignee.length; j++) {
          let a =
            capitalize(allassignee[j].assignee.first_name) +
            " " +
            capitalize(allassignee[j].assignee.last_name);
          //  tableData[i].Assignees.push(a)
          temp.push(a);
        }

        for (let j = 0; j < noWBS.length; j++) {
          let a =
            capitalize(noWBS[j].assignee.first_name) +
            " " +
            capitalize(noWBS[j].assignee.last_name);
          //  tableData[i].Assignees.push(a)
          temp1.push(a);
        }

        if (res.data.data[i].assignees.length != 0) {
          tableData.push({
            TDO: res.data.data[i].project.task_delivery_order.title,
            "Sub Task": res.data.data[i].project.sub_task,
            "Task Title": res.data.data[i].project.task_title,
            "Assigned Date":
              res.data.data[i].project.date_updated,
            Assignees: temp,
            "Assignees with no WBS": temp1,
            id: res.data.data[i].project.id,
          });
        }
      }
      }

      let wbsinfo = [];
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].assignees.length != 0) {
          let a = res.data.data[i];
          wbsinfo.push({
            assignees: a.assignees,
            date_created: a.project.date_created,
            date_updated: a.project.date_updated,
            description: a.project.description,
            estimated_person: a.project.estimated_person,
            id: a.project.id,
            planned_delivery_date: a.project.planned_delivery_date,
            planned_hours: a.project.planned_hours,
            planned_value: a.project.planned_value,
            pm: a.project.pm,
            remaining_hours: a.project.remaining_hours,
            start_date: a.project.start_date,
            status: a.project.status,
            sub_task: a.project.sub_task,
            task_delivery_order: a.project.task_delivery_order,
            task_title: a.project.task_title,
            work_package_index: a.project.work_package_index,
            work_package_number: a.project.work_package_number,
          });
        }
      }
      //setTable(wbsinfo)
      console.log("111", wbsinfo);
      console.log("temp", temp);
      console.log("tableData", tableData);
      setTable(tableData);
      setNotStartedWBS(temp);
      populateOption(temp);
    });
  }, []);
  return (
    <>
      <CRow>
        <CCol lg="9">
          <h3 className="timecards-page-header mb-3">
            {/* Not Created WBS Details ({filteredProjects.length}){" "} */}
            People who still didn't create their WBS {" "}
          </h3>
        </CCol>
        <CCol lg="3" className="mb-3 pl-4">
          <Select
            className="custom-forminput-6"
            placeholder="Filter by TDOs"
            searchable={true}
            options={tdos}
            isMulti
            onChange={handleProjectChange}
            value={selectedProject}
          />
        </CCol>
        <CCol className="mt-5 mb-3">
          <CDataTable
            items={table}
            primary
            hover
            sorter
            striped
            bordered
            size="sm"
            itemsPerPage={15}
            pagination
            fields={[
              {
                key: "TDO",
                _style: { width: "10%" },
                _classes: "font-weight-bold",
              },

              "Sub Task",
              "Task Title",
              {
                key: "Assigned Date",
                _style: { width: "15%" },
              },

              {
                key: "Assignees",
                _style: { width: "20%" },
              },
              {
                key: "Assignees with no WBS",
                _style: { width: "20%" },
              },
              {
                key: "Action",
                _style: { width: "5%" },
              },
            ]}
            scopedSlots={{
              Action: (item) => (
                <td>
                  <CBadge>
                    <CButton
                      type="button"
                      className="create-wbs-from-modal float-right"
                      size="sm"
                      onClick={() => {
                        createWBS(item);
                      }}
                    >
                      Create WBS
                    </CButton>
                  </CBadge>
                </td>
              ),
            }}
          ></CDataTable>
        </CCol>
      </CRow>
    </>
  );
};
export default NoWbs;
