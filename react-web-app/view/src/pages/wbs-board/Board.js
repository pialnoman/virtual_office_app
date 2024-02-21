import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import "./Board.css";
import Board, { Lane } from "react-trello";
import WbsModal from "./wbs-modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchPMWbsThunk, fetchWbsThunk } from "../../store/slices/WbsSlice";
import CIcon from "@coreui/icons-react";
import { USER_ID } from "../../Config";
import { API } from "../../Config";
import Select from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { has_permission } from "../../helper.js";
import makeAnimated from "react-select/animated";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";


const animatedComponents = makeAnimated();
const WbsBoard = () => {
  
    /**export in excel */
  
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  var fileName;
  const xlData = [];
  const [wbsList, setWbsList] = useState(null);
  const [projects, setProjects] = useState([]);
  const [wbsAssigneeList, setWbsAssigneeList] = useState([]);
  let location = useLocation();
  const dispatch = useDispatch();
  const [fetchData, setFetchedData] = useState([]);
  const [data_loaded, setDataLoaded] = useState(false);
  const [update, setUpdate] = useState(0);
  const profile = useSelector((state) => state.profile.data);
  const pm_wbs_list = useSelector(state=>{
    let pre_selected_items = [];
    Array.from(state.wbs.pm_wbs_list).forEach((item, idx) => {
      pre_selected_items.push(item);
    });
    pre_selected_items = sortBy(pre_selected_items, [
      function (item) {
        return new Date(item.date_created);
      },
    ]).reverse();
    return pre_selected_items
  })
  const [selectedAssignee, setSelectedAssignee] = useState();

  const [boardData, setBoardData] = useState({
    lanes: [
      {
        id: "lane1",
        title: "TO DO",
        label: "",
        cards: [],
      },
      {
        id: "lane2",
        title: "IN PROGRESS",
        label: "",
        cards: [],
      },
      {
        id: "lane3",
        title: "DONE",
        label: "",
        cards: [],
      },
      {
        id: "lane4",
        title: "DELINQUENT",
        label: "",
        cards: [],
      },
    ],
  });

  function capitalize(string) {
    if (string != undefined) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return "";
  }

  
  const populate_data = (data) => {
    console.log("populating data", data);
    setFetchedData(data);
    let temp_data = {
      lanes: [
        {
          id: "lane1",
          title: "TO DO",
          label: "",
          cards: [],
        },
        {
          id: "lane2",
          title: "IN PROGRESS",
          label: "",
          cards: [],
        },
        {
          id: "lane3",
          title: "DONE",
          label: "",
          cards: [],
        },
        {
          id: "lane4",
          title: "DELINQUENT",
          label: "",
          cards: [],
        },
      ],
    };

    if (data != undefined) {
      data.forEach((element) => {
        let card_title = String(element.title)
        if(card_title.length>19)
        {
          card_title = (card_title).slice(0,19)+ '...'
        }
        if (element.status === 1) {
          // console.log("1st cond", data.lanes[0])
          temp_data.lanes[0].cards.push({
            id: element.id.toString(),
            laneId: "lane1",
            title: card_title,
            description:
              element.description +
              "\n ➤ " +
              capitalize(element.assignee.first_name) +
              " " +
              capitalize(element.assignee.last_name),
            label: "★ " + element.end_date,
          });
          // console.log('1', temp_data)
        } else if (element.status === 2) {
          // console.log("2nd cond", temp_data.lanes[1])
          temp_data.lanes[1].cards.push({
            id: element.id.toString(),
            laneId: "lane2",
            title: card_title,
            description:
              element.description +
              "\n ➤ " +
              capitalize(element.assignee.first_name) +
              " " +
              capitalize(element.assignee.last_name),
            label: "★ " + element.end_date,
          });
          // console.log('2', temp_data)
        } else if (element.status === 3) {
          // console.log("3rd cond", temp_data.lanes[2])
          temp_data.lanes[2].cards.push({
            id: element.id.toString(),
            laneId: "lane3",
            title: card_title,
            description:
              element.description +
              "\n ➤ " +
              capitalize(element.assignee.first_name) +
              " " +
              capitalize(element.assignee.last_name),
            label: "★ " + element.end_date,
          });
          // console.log('3', temp_data)
        } else if (element.status === 4) {
          // console.log("3rd cond", temp_data.lanes[2])
          temp_data.lanes[3].cards.push({
            id: element.id.toString(),
            laneId: "lane4",
            title: card_title,
            description:
              element.description +
              "\n ➤ " +
              capitalize(element.assignee.first_name) +
              " " +
              capitalize(element.assignee.last_name),
            label: "★ " + element.end_date,
          });
          // console.log('3', temp_data)
        }
      });
      // console.log('tempAssigneList', tempAssigneList)
      // setWbsAssigneeList(sortBy(tempAssigneList, 'first_name'))
      // setSelectedAssignee({value:sessionStorage.getItem(USER_ID), label:profile.first_name+' '+profile.last_name})
    }
    setBoardData(temp_data);
    setDataLoaded(true)
  };

  const populate_assignees = () => {
    API.get("project/assignees/all/" + sessionStorage.getItem(USER_ID) + "/")
      .then((res) => {
        console.log("assignees", res.data.data);
        let temp_array = [];
        Array.from(res.data.data).forEach((element) => {
          if (!temp_array.find((item) => item.value === element.id)) {
            temp_array.push({
              value: element.id,
              label: element.first_name + " " + element.last_name,
            });
          }
        });
        temp_array=uniqBy(temp_array,'value')
        console.log('pppp',sortBy(temp_array, "label").concat(wbsAssigneeList))
        setWbsAssigneeList(sortBy(temp_array, "label").concat(wbsAssigneeList))
      })
      .catch((err) => {});
  };
  useEffect(()=>{
    if(profile?.id!=undefined){
      console.log('ass list',[...wbsAssigneeList,{
        value: profile.id,
        label: profile.first_name + " " + profile.last_name,
      }])
      setWbsAssigneeList([...wbsAssigneeList,{
        value: profile.id,
        label: profile.first_name + " " + profile.last_name,
      }]);
      console.log("LINE 238 SETTING ASSIGNEE")
      setSelectedAssignee({
        value: profile.id,
        label: profile.first_name + " " + profile.last_name,
      })
    }
  },[profile])

  const boardStyle = {
    backgroundColor: "#fff",
    marginRight: "40px",
    marginLeft: "40px",
  };
  const laneStyle = { backgroundColor: "rgb(243 243 243)" };
  let currentLaneId, currentCardId = "";
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [timeCardListData, setTimeCardListData] = useState([]);

  const exportToCSV = () => {
    console.log(fetchData);

    for (let i = 0; i < fetchData.length; i++) {
      const item = fetchData[i];
      function getStatus(info) {
        if (info == "1") {
          return "To Do";
        } else if (info == "2") {
          return "In Progress";
        } else if (info == "3") {
          return "Done";
        }
      }
      xlData.push({
        "Sl. No.": i + 1,
        TDO: item.project.task_delivery_order.title,
        Project: item.project.sub_task,
        "Task Title": item.project.task_title,
        Assignee: item.assignee.first_name + " " + item.assignee.last_name,
        "WBS Title": item.title,
        "WBS Description": item.description,
        "Hrs Worked": item.hours_worked,
        "Date Updated": item.date_updated,
        "Progress(%)": item.progress + "%",
        Status: getStatus(item.status),
        Reporter: item.reporter.first_name + " " + item.reporter.last_name,
      });
    }
    const current = new Date();
    const date = `${current.getDate()}/${
      current.getMonth() + 1
    }/${current.getFullYear()}`;
    //  console.log("date is", date);
    fileName = "WBS" + date;
    const ws = XLSX.utils.json_to_sheet(xlData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const editWbs = (cardId, metadata, laneId) => {
    setUpdate(update + 1);
    currentLaneId = laneId;
    currentCardId = cardId;
    console.log(boardData.lanes.find((element) => element.id == currentLaneId));
    const wbsId = boardData.lanes.find((element) => element.id == currentLaneId).cards.find((element) => element.id == currentCardId).id;

    API.get("wbs/time-card/list/" + wbsId + "/").then((res) => {
      console.log("time-card list result", res);
      setTimeCardListData(res.data);
      dispatch(fetchWbsThunk(sessionStorage.getItem(USER_ID)));
      console.log("timeCardListData: ", timeCardListData);
    });
    setModalData(wbsList.find((element) => element.id == wbsId));
    console.log('modal data',wbsList.find((element) => element.id == wbsId))
    setModal(true);
  };

  const toggle = () => {
    setModalData(null);
    setModal(!modal);
  };

  const onWbsUpdate = () => {
    setModal(false);
    dispatch(fetchWbsThunk(sessionStorage.getItem(USER_ID)));
    setModalData(null);
    setUpdate(update + 1);
  };

  const updateStatus = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    let values;
    if (targetLaneId == "lane1") {
      values = {
        status: 1,
      };
    } else if (targetLaneId == "lane2") {
      values = {
        status: 2,
      };
    } else if (targetLaneId == "lane3") {
      values = {
        status: 3,
      };
    }
    API.put("wbs/update/status/" + parseInt(cardDetails.id) + "/", values).then(
      (res) => {
        dispatch(fetchWbsThunk(sessionStorage.getItem(USER_ID)));
        setUpdate(update + 1);
      }
    );
  };

  // filter wbs
  const filterWbs = (newValue, actionMeta) => {
    setSelectedAssignee(newValue);
    var temWbsList = pm_wbs_list.filter(
      (item) => item.assignee.id == newValue.value
    );
    setWbsList(temWbsList)
    setShowClearBtn(true);
  };

  const [showClearBtn, setShowClearBtn] = useState(false);
  
  function clearFilter() {
    setSelectedProjects([]);
    filter_wbs_project_wise(projects.filter((item) => item.value != "all"));
    setShowClearBtn(false);
    setSelectedAssignee({
      value: profile.id,
      label: profile.first_name + " " + profile.last_name,
    })
  }

  const filter_wbs_project_wise = (options) => {
    let temp_wbs_list = [];
    console.log("filter", options);
    if (options.find((item) => item.value == "all")) {
      temp_wbs_list = wbsList.filter(
        (item) => item.assignee.id == selectedAssignee.value
      );
    } else {
      for (let index = 0; index < options.length; index++) {
        for (let index1 = 0; index1 < wbsList.length; index1++) {
          if (
            wbsList[index1].project.sub_task == options[index].value &&
            wbsList[index1].assignee.id == selectedAssignee.value
          ) {
            temp_wbs_list.push(wbsList[index1]);
          }
        }
      }
    }
    // let temWbsList = wbsList.filter(item => item.assignee.id === newValue.value)
    populate_data(temp_wbs_list);
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedProjects, setSelectedProjects] = useState();
  const handleProjectChange = (value, actionMeta) => {
    console.log("select", value);
    if (actionMeta.action == "select-option") {
      if (value.find((item) => item.value == "all")) {
        setSelectedProjects(projects.filter((item) => item.value != "all"));
        filter_wbs_project_wise(projects.filter((item) => item.value != "all"));
      } else {
        setSelectedProjects(value);
        filter_wbs_project_wise(value);
      }
    } else if (actionMeta.action == "clear") {
      setSelectedProjects([]);
      filter_wbs_project_wise(projects.filter((item) => item.value != "all"));
    } else if (actionMeta.action == "remove-value") {
      setSelectedProjects(value);
      if (value.length == 0) {
        filter_wbs_project_wise(projects.filter((item) => item.value != "all"));
      } else {
        filter_wbs_project_wise(value);
      }
    }
  };
  const setProjectsList=(projects)=>{
    let temp_projects = [];
    Array.from(projects).forEach((item, idx) => {
      temp_projects.push({
        label: item.sub_task,
        value: item.sub_task,
        data: item,
      });
    });
    temp_projects.unshift({
      label: "Select All",
      value: "all",
      data: {},
    });
    setProjects(uniqBy(temp_projects, "value"));
  }
  React.useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPMWbsThunk(sessionStorage.getItem(USER_ID)))
    populate_assignees();
    if (location.state?.from == "login") {
      enqueueSnackbar("Welcome ", { variant: "success" });
    }
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, { variant: "warning" });
    }
  }, []);
  
  React.useEffect(()=>{
    if(selectedAssignee?.value != undefined){
      setWbsList(pm_wbs_list.filter((element) => element.assignee.id == selectedAssignee.value))
    }
  },[pm_wbs_list.length>0,selectedAssignee])
  useEffect(()=>{
    console.log("LINE 453",wbsList)
    console.log("LINE 454",selectedAssignee)
    if(wbsList!==null && selectedAssignee?.value!=undefined){
      populate_data(wbsList)
      let emp_projects = wbsList.filter(item=>item.assignee.id == selectedAssignee.value).map(item=>item.project)
      setProjectsList(emp_projects)
      setDataLoaded(true)
    }
  },[wbsList,selectedAssignee])
  const custom_progress_style = {
    height: 5,
    borderRadius: 3,
  };
  const cardStyle = { backgroundColor: "red" };
  
  return (
    <>
      <CContainer>
        {/* <h4 className="pl-2">Filter WBS board</h4> */}
        <CRow>
          {has_permission("projects.add_projects") && (
            <CCol lg="3" className="mb-3 pl-4">
              <Select
                value={selectedAssignee}
                components={animatedComponents}
                placeholder="Filter by assignee"
                options={wbsAssigneeList.length>0?wbsAssigneeList:[]}
                onChange={filterWbs}
              />
            </CCol>
          )}
          {!has_permission("projects.add_projects") && (
            <CCol lg="3" className="mb-3 pl-4">
              <Select
                value={selectedAssignee}
                components={animatedComponents}
                placeholder="Filter by assignee"
                options={wbsAssigneeList.length>0?wbsAssigneeList:[]}
                onChange={filterWbs}
                isDisabled={true}
              />
            </CCol>
          )}
          <CCol lg="3" className="mb-3 pl-4">
            <Select
              className="custom-forminput-6"
              placeholder="Filter by project"
              searchable={true}
              options={projects}
              components={animatedComponents}
              isMulti
              onChange={handleProjectChange}
              value={selectedProjects}
            />
          </CCol>
          <CCol lg="3" md="6" sm="6" className="mb-3">
            <CButton
              type="button"
              className="clear-filter-wbs"
              onClick={() => clearFilter()}
            >
              clear filter
            </CButton>
          </CCol>
          <CCol lg="3" md="6" sm="6" className="mb-3">
            <CButton
              className="export-project-list"
              style={{ float: "right" }}
              onClick={() => exportToCSV()}
            >
              <CIcon name="cil-spreadsheet" className="mr-2" />
              Export to excel
            </CButton>
          </CCol>
        </CRow>
        {/* */}
        <CRow>
          {data_loaded === false ? (
            <CCol
              lg="8"
              md="8"
              sm="8"
              className="mt-4 offset-md-2 offset-lg-2 offset-sm-2"
            >
              <LinearProgress sx={custom_progress_style} />
            </CCol>
          ) : (
            <CRow>
              <CCol  className={""}>
                <Board
                  data={boardData}
                  hideCardDeleteIcon
                  handleDragEnd={updateStatus}
                  onCardClick={editWbs}
                  style={boardStyle}
                  laneStyle={laneStyle}
                  //cardStyle={cardStyle}
                />
              </CCol>
            </CRow>
          )}
        </CRow>
      </CContainer>
      {modalData != null && (
        <WbsModal
          show={modal}
          onClose={onWbsUpdate}
          toggle={toggle}
          data={modalData}
          timeCardList={timeCardListData}
        />
      )}
    </>
  );
};
export default WbsBoard;
