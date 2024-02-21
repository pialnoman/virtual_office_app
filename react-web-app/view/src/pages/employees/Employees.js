import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CDataTable, CRow } from "@coreui/react";
import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const Employees = () => {
    let history = useHistory()
    const [employees, setEmployees] = useState([
        { '#': 1, 'Name': 'abc' }
    ])
    const columns = [
        { field: 'id', headerName: 'Employee ID', width: 130 },
        { field: 'Name', headerName: 'Name', width: 130 },
        { field: 'Email', headerName: 'Email', width: 130 },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 260,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            renderCell: (params) => {
              const onClick = (e) => {
                e.stopPropagation(); // don't select this row after clicking
        
                const api = params.api;
                const thisRow = {};
        
                api.getAllColumns().filter((c) => c.field !== "__check__" && !!c).forEach(
                    (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                );
        
                return alert(JSON.stringify(thisRow, null, 4));
              };
        
              return <Button onClick={onClick}>Click</Button>;
            }
          },
    ];
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];
    return (
        <>
            <CContainer>
                <CRow>
                    <CCol>
                        <Typography variant="h4" component="div" mb={2}>Employees</Typography>
                        <div style={{ height: 500, width: '100%' }} >
                            <DataGrid
                                disableSelectionOnClick={true}
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                // checkboxSelection
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                onRowClick={(rowData) => {console.log(rowData.row)}} 
                            />
                        </div>
                    </CCol>
                </CRow>
                {/* <CRow>
                    <CCol>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Employees
                                </Typography>
                                <CDataTable
                                    items={employees}
                                    fields={[
                                        {
                                            key: "#",
                                            _style: { width: "3%" },
                                            _classes: "font-weight-bold",
                                        },
                                        'Name',
                                        'Employee ID',
                                        'Email',
                                        'Phone',
                                        'Date Created',

                                    ]}
                                    primary
                                    hover
                                    striped
                                    border={false}
                                    outlined={false}
                                    sorter
                                    columnFilter
                                    tableFilter
                                    size="sm"
                                    itemsPerPage={10}
                                    pagination
                                    scopedSlots={{
                                        'Action':
                                            (item) => (
                                                <td>
                                                    <CBadge>
                                                        <Button disabled={true} onClick={() => { }} type="button" size="sm" color="danger">Delete</Button> <CButton onClick={() => { history.push({ pathname: '/dashboard/storages/details', state: { brand: item } }) }} size="sm" type="button" color="primary">Edit</CButton>
                                                    </CBadge>
                                                </td>
                                            )
                                    }}
                                />
                            </CardContent>
                            <CardActions>

                            </CardActions>
                        </Card>
                    </CCol>
                </CRow> */}
            </CContainer>
        </>
    )
}

export default Employees