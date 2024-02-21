import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CForm, CLabel, CInput, CButton, CSelect, CTextarea, CAlert } from '@coreui/react';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CChart } from '@coreui/react-chartjs';
import "./evmsDetails.css";
const EvmsDetails = () => {
    const data = [];
    const line = {
        labels: [],
        datasets: [
            {
                label: 'My First dataset',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 1,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [100, 300, 250, 300, 450, 550, 550],
            },
        ],
    };

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    function getDates(startDate, stopDate) {
        var currentDate = startDate;
        console.log(currentDate)
        while (currentDate <= stopDate) {
            var tem_data = new Date(currentDate).toISOString().slice(0, 10)
            line.labels.push(tem_data);
            console.log(data)
            currentDate = currentDate.addDays(1);
        }
        return data;
    }

    useEffect(() => {
        getDates(new Date(), new Date().addDays(7));
    });

    const options = {
        tooltips: {
            enabled: false,
            //   custom: customTooltips
        },
        maintainAspectRatio: false
    }

    return (
        <>
            <div className="mb-3">
                <CButton className="create-evms-btn">Create EVMS</CButton>
            </div>
            <CChart type="line" labels={line.labels} datasets={line.datasets} options={options} />
        </>
    )
}

export default EvmsDetails;
