import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CLabel,
  CInput,
  CButton,
  CDataTable,
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CTextarea,
} from "@coreui/react";
import Select from "react-select";
import { API } from "../../Config";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import moment from "moment";
const EditTimeCard = (props) => {
  const types = [
    { label: "RHR", value: "RHR" },
    { label: "SIC", value: "SIC" },
    { label: "VAC", value: "VAC" },
    { label: "OTS", value: "OTS" },
    { label: "OTO", value: "OTO" },
    { label: "HOL", value: "HOL" },
    { label: "WFH", value: "WFH" },
    { label: "COM", value: "COM" },
    { label: "PB1", value: "PB1" },
    { label: "PB2", value: "PB2" },
  ];
  const worktypes = useSelector((state) => {
    let temp = [];
    Array.from(state.worktypes.data).forEach((item, idx) => {
      temp.push({
        label: item.title,
        value: item.title,
        description: item.description,
        data: item,
      });
    });
    return temp;
  });
  const edit_time_card = (values, { setSubmitting }) => {
    console.log(values);
    API.put("wbs/time-card/update/" + props.data.id + "/", values)
      .then((res) => {
        console.log(res.data);
        if (res.status == 200 && res.statusText == "OK") {
          formEditTimeCard.resetForm();
          props.onClose();
          swal("Well Done!", "Your timecard is updated", "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formEditTimeCard = useFormik({
    initialValues: {
      actual_work_done: "",
      time_type: "",
      hours_today: "",
      date_updated: "",
    },
    onSubmit: edit_time_card,
  });
  const handleSelectChange = (value, actionMeta) => {
    console.log(value);
    formEditTimeCard.setFieldValue("time_type", value.value);
  };
  useEffect(() => {
    if (props.data) {
      formEditTimeCard.setValues({
        actual_work_done: props.data.actual_work_done,
        time_type: props.data.time_type,
        hours_today: props.data.hours_today,
        date_updated: props.data.date_updated,
      });
    }
  }, [props.data]);

  const oncancel = () => {
    formEditTimeCard.setValues({
      actual_work_done: props.data.actual_work_done,
      time_type: props.data.time_type,
      hours_today: props.data.hours_today,
      date_updated: props.data.date_updated,
    });
  };

  // Calculate the start date as 7 days before today
const startDate = moment().subtract(7, 'days');

// Calculate the end date as tomorrow
const endDate = moment().add(1, 'days');

// Format the dates in "YYYY-MM-DD" format
const formattedStartDate = startDate.format("YYYY-MM-DD");
const formattedEndDate = endDate.format("YYYY-MM-DD");

  return (
    <>
      <CModal
        //show={showModal}
        show={props.show}
        onClose={() => props.onClose()}
        toggle={props.toggle}
        size="lg"
      >
        <CModalHeader closeButton>
          {" "}
          Project Name (Work Package) :{" "}
          {props.data?.project != null
            ? props.data.project.sub_task +
              "(" +
              props.data?.project.work_package_number +
              ")"
            : "N/A"}
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol className="col-md-12 mb-3">
              {/*Type : {props.data?.time_type}*/}
              <CLabel
                className="custom-label-5"
                htmlFor="assigneeSelectPM"
                loseMenuOnSelect={true}
                isClearable={false}
                isMulti={false}
              >
                Type :
              </CLabel>
              <Select
                options={worktypes}
                onChange={handleSelectChange}
                defaultValue={types.filter(
                  (t) => t.value === props.data?.time_type
                )}
              />
            </CCol>
            <CCol className="col-md-12 mb-3">
              <CLabel class="form-label"> Hour(s):</CLabel>

              <CInput
                className="custom-forminput-5"
                type="number"
                aria-label="default input example"
                id="hours_today"
                name="hours_today"
                placeholder="0.00"
                min="0.00"
                value={formEditTimeCard.values.hours_today}
                onChange={formEditTimeCard.handleChange}
              ></CInput>
              {/*{sethour(props.data?.sethour)}*/}
            </CCol>
            <CCol className="col-md-12 mb-3">
              <CLabel class="form-label"> Date:</CLabel>

              <CInput
                className="custom-forminput-5"
                type="date"
                aria-label="default input example"
                id="date_updated"
                name="date_updated"
                min={formattedStartDate}
                max={formattedEndDate}
                value={formEditTimeCard.values.date_updated}
                onChange={formEditTimeCard.handleChange}
              ></CInput>
              {/*{sethour(props.data?.sethour)}*/}
            </CCol>
            <CCol className="col-md-12 mb-3">
              <CLabel class="form-label"> Task Title : </CLabel>
              <CInput
                value={
                  props.data?.project != null
                    ? props.data.project.task_title
                    : "N/A"
                }
                disabled
              ></CInput>
            </CCol>
            <CCol className="col-md-12 mb-3">
              <CLabel class="form-label">Actual Work :</CLabel>
              <CTextarea
                class="form-control"
                id="actual_work_done"
                name="actual_work_done"
                rows="3"
                value={formEditTimeCard.values.actual_work_done}
                onChange={formEditTimeCard.handleChange}
              >
                {" "}
              </CTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={formEditTimeCard.handleSubmit}>
            save
          </CButton>{" "}
          <CButton
            color="secondary"
            onClick={() => {
              props.onClose();
              oncancel();
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default EditTimeCard;
