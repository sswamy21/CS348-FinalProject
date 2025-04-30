import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import DatePicker from "react-datepicker";
import { useSearchParams } from "react-router-dom";
import "../App.css"
import { Stats } from "../components/Stats";

function Report() {
    const URL = 'http://127.0.0.1:5000'
    const [applications, setApplications] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [status, setStatus] = useState("All")

    async function handleSubmit(event) {
        event.preventDefault();
        if (fromDate > toDate) {
            alert("Start date cannot be after end date.");
            return;
        }          
        const params = new URLSearchParams();
        if (fromDate) {
          params.set("from", fromDate.toISOString().substring(0, 10));
        }
        if (toDate) {
          params.set("to", toDate.toISOString().substring(0, 10));
        }
        params.set("status", status);
        setSearchParams(params);
        const queryFilters = new URLSearchParams(params).toString();
        const response = await fetch(`${URL}/report?${queryFilters}`, 
            {
                method: 'GET'
            }
        );
        if (!response.ok) {
            loadApplications();
            return;
        }
        const data = await response.json();
        setApplications(data);
    }

    async function loadApplications() {
        const response = await fetch(`${URL}/applications`);
        const data = await response.json();
        setApplications(data);
    }

    function handleClear() {
        setFromDate(new Date());
        setToDate(new Date());
        setStatus("All");
        loadApplications();
    }

    function statusColor(status) {
        var color = "black";
        if (status === "Offer") {
            color = "green";
        }
        else if (status === "Rejected") {
            color = "red";
        }
        else if (status === "Interview") {
            color = "orange"
        }
        return color;
    }

    useEffect(() => {
        loadApplications();
    }, [])

    return (
        <div>
            <Header></Header>
            <h1>
                Filter Applications
            </h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>From</label>
                    <div
                        style={{
                            display: "flex",
                            gap: "3rem"
                        }}
                    >
                        <DatePicker showIcon selected={fromDate} onChange={(date) => {setFromDate(date)}}></DatePicker>
                        <button type="button" onClick={() => setFromDate(null)}
                            style={{
                                width: "2rem"
                            }}
                        >
                        ×
                        </button>
                    </div>
                    <label>To</label>
                    <div
                        style={{
                            display: "flex",
                            gap: "3rem"
                        }}
                    >
                        <DatePicker showIcon selected={toDate} onChange={(date) => {setToDate(date)}}></DatePicker>
                        <button type="button" onClick={() => setToDate(null)}
                            style={{
                                width: "2rem"
                            }}
                        >
                        ×
                        </button>
                    </div>
                    <label>Status</label>
                    <select onChange={(e) => setStatus(e.target.value)}
                            value={status}
                    >
                        <option value="All">All</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Offer">Offer</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <div
                        style={{
                            display: "flex",
                            gap: "2rem"
                        }}
                    >
                        <button type="submit" style={{
                            marginTop: "1rem",
                            width: "8rem"
                        }}>Submit</button>
                        <button type="button" onClick={handleClear}
                            style={{
                                marginTop: "1rem",
                                width: "8rem"
                            }}
                        >Clear</button>
                    </div>
                </form>
            </div>
            <div>
            <h3>Current Applications</h3>
            <div
                style={{
                    display: "flex",
                    gap: "2rem",
                    alignItems: "flex-start",
                    marginTop: "2rem"
                }}
            >
                <div style={{ flex: 2 }}>
                <table>
                    <thead>
                        <tr>
                            <th>Date Applied</th>
                            <th>Position</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        applications.map(
                            application => (
                                <tr key={application.id}>
                                    <td>{(new Date(application.date_applied)).toISOString().substring(0, 10)}</td>
                                    <td>{application.position}</td> 
                                    <td>{application.company}</td> 
                                    <td>{application.location}</td>
                                    <td style={{
                                        color: statusColor(application.status)
                                    }}>{application.status}</td>
                                    <td>${application.salary}/hr</td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
                </div>
                <div style={{ flex: 1}}>
                    {console.log(applications)}
                    <Stats applications={applications}></Stats>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Report;