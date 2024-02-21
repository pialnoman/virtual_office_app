import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CRow, CCol, CAlert } from '@coreui/react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';

import { Card, CardContent, CardHeader, Divider, List, ListItem, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
function ProjectAccordion(props) {
    React.useEffect(()=>{
        console.log(props.projects.length)
    },[])
    return (
        <CRow>
            <Typography sx={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }} color="#000000" >
                        Projects
                    </Typography>
            {props.projects.length>0 ? (Array.from(props.projects).map((item,idx)=>(
                <CCol md="6" key={idx} className="mt-3">
                <Accordion> 
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                    <Typography sx={{ width: '63%', flexShrink: 0 }}>
                        {item.sub_task}
                    </Typography>
                    
                    </AccordionSummary>
                    <AccordionDetails>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {item.wbs_list.length>0 ? (Array.from(item.wbs_list).map((wbs,idx)=>(
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={wbs.title} secondary={'Planned End Date '+wbs.end_date} />
                                </ListItem>
                            ))):(<CAlert>No WBS</CAlert>)}
                        </List>
                    </AccordionDetails>
                </Accordion>
                </CCol>
            ))):(<CAlert>No Project</CAlert>)}
            
        </CRow>
    )
}
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function DraggableSearchResult(props) {
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    React.useEffect(()=>{
        console.log('search result',props.result)
    },[])
    return (
        <>
        <div>

            <Dialog
                maxWidth={"lg"}
                fullWidth={true}
                open={props.open}
                onClose={props.handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                TransitionComponent={Transition}
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Search Result
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', marginBottom: 3 }} color="#000000" >
                        You searched for '{props.searchText}'
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 'bold', marginTop: 5,marginBottom: 3 }} color="#000000" >
                        Employees
                    </Typography>
                    <CRow>
                    {props.result.length>0 && Array.from(props.result).map((item,idx)=>(
                        <Accordion key={idx}>  
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '63%', flexShrink: 0, fontWeight: 'bold' }}>
                                    {item.employee.first_name+' '+item.employee.last_name}
                                </Typography>
                                {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                <ProjectAccordion projects={item.projects}/>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    </CRow>

                    {/* <CRow className="mt-2">
                        <Card>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight:'bold' }} color="#000000" >
                                    Employees
                                </Typography>
                            </CardContent>
                        </Card>
                    </CRow> */}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={props.handleClose}>
                        Close
                    </Button>
                    {/* <Button onClick={props.handleClose}>Subscribe</Button> */}
                </DialogActions>
            </Dialog>
        </div>
        </>
    );
}
