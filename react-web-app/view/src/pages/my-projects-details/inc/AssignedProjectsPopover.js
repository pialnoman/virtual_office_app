import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { CButton, CCard, CCardBody, CCardHeader, CRow } from '@coreui/react';
import { API } from '../../../Config';

export default function AssignedProjectsPopover(props) {
  const [projects, setProjects] = React.useState([])
  const assigned_project_names = (user_id) => {
    API.get('project/assigned/all/' + user_id + '/').then(res => {
      
      let temp = []
      Array.from(res.data.data).forEach((item, idx) => {
        //console.log(idx, item)
        temp.push(item.sub_task)
      })
      setProjects(temp)
    })
  }
  React.useEffect(() => {
    console.log('modal data',props.data)
    assigned_project_names(props.data.assignee.data?props.data.assignee.data?.id:props.data.assignee.id)
  }, [props.data])
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <a className='font-weight-bold' type='button' variant="contained" {...bindTrigger(popupState)}>
            {props.text1}
          </a>
          <label>
            {props.text2}
          </label>
          <img onClick={() => props.remove(props.data)} style={{cursor:'pointer'}} src={"assets/icons/icons8-close-64-blue.svg"} className="ml-3 close-icon-size" />
          {/* <CRow>
          
          <CButton size='sm' type="button" onClick={() => props.remove(props.data)} className="remove-file-ongoing"></CButton>
          </CRow> */}
          
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <CCard>
              <CCardHeader className="text-center">
                <h5>Currently Assigned</h5>
              </CCardHeader>
              <CCardBody>
                {Array.from(projects).map((item, idx) => (
                  <Typography key={idx}>{(idx + 1) + ' . ' + item}</Typography>
                ))}

                {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
              </CCardBody>
            </CCard>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}