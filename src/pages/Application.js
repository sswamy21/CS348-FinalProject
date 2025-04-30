import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import "../App.css"
import "../components/Form.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function Application() {
    const URL = 'http://127.0.0.1:5000'
    const[applications, setApplications] = useState([]);
    const[appId, setAppId] = useState(-1);
    const[edit, setEdit] = useState(false);
    const[position, setPosition] = useState("");
    const[company, setCompany] = useState("");
    const[location, setLocation] = useState("")
    const[status, setStatus] = useState("In Progress");
    const[salary, setSalary] = useState(0)
    const[date, setDate] = useState(new Date())
    
    async function handleSubmit(event) {
        event.preventDefault();
        if (edit) {
            await(fetch(
                `${URL}/applications/${appId}`, 
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        'position' : position,
                        'company' : company,
                        'location' :  location,
                        'status' : status,
                        'salary' : salary,
                        'date_applied' : date.toISOString().substring(0, 10)
                    })
                }
            ).then(() => {
                loadApplications();
                resetForm();
                setEdit(false);
            }).catch(() => {
                console.log("Error editing the application")
            }));          
        }
        else {
            await(fetch(
                `${URL}/applications`, 
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        'position' : position,
                        'company' : company,
                        'location' :  location,
                        'status' : status,
                        'salary' : salary,
                        'date_applied' : date.toISOString().substring(0, 10)
                    })
                }
            ).then(() => {
                loadApplications();
                resetForm();
            }).catch(() => {
                console.log("Error creating the application")
            }));
        }
        event.target.reset();
    }
    
    function resetForm() {
        setPosition("");
        setCompany("");
        setLocation("");
        setStatus("In Progress");
        setSalary(0);
        setAppId(-1);
        setDate(new Date())
    }

    async function loadApplications() {
        const response = await fetch(`${URL}/applications`);
        const data = await response.json();
        setApplications(data);
    }

    async function handleDeleteApplication(app_id) {
        const response = await fetch(`${URL}/applications/${app_id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            console.log(response.text);
        }
        loadApplications();
    }

    async function handleEditApplication(app_id) {
        setEdit(true);
        const response = await fetch(`${URL}/applications/${app_id}`, {
            method: 'GET'
        });
        const data = await response.json();
        setAppId(data.app_id);
        setPosition(data.position);
        setCompany(data.company);
        setLocation(data.location);
        setStatus(data.status);
        setSalary(data.salary);
        setDate(new Date(data.date_applied))
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
            <h1>Add Application</h1>
            <div></div>
            <div>
                <form onSubmit={handleSubmit}>
                        <label>Date Applied</label>
                        <div>
                            <DatePicker showIcon selected={date} onChange={(date) => {setDate(date)}}></DatePicker>
                        </div>
                        <label>Position</label>
                        <input onChange={(e) => setPosition(e.target.value)} type="text" name="position"
                            value={position}
                        />
                        <label>Company</label>
                        <input onChange={(e) => setCompany(e.target.value)} type="text" name="company" 
                            value={company}
                        />
                        <label>Location</label>
                        <input onChange={(e) => setLocation(e.target.value)} type="text" name="location"
                            value={location}
                        />
                    <label>Status</label>
                    <select onChange={(e) => setStatus(e.target.value)}
                            value={status}
                        >
                        <option value="In Progress">In Progress</option>
                        <option value="Offer">Offer</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <label>Salary (Hourly) </label>
                    <input onChange={(e) => setSalary(e.target.value)} type="number" name="salary"
                        value={salary}
                    />
                    <button type="submit" style={{
                        marginTop: "1rem",
                        width: "8rem"
                    }}>Add</button>
                </form>
            </div>
            <h3>Current Applications</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date Applied</th>
                        <th>Position</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Salary</th>
                        <th>Actions</th>
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
                               <td>
                                    <button onClick={() => handleDeleteApplication(application.app_id)}>Delete</button>
                                    <button onClick={() => handleEditApplication(application.app_id)}>Edit</button>
                                </td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>
            <div>
                
            </div>
        </div>
    )
}