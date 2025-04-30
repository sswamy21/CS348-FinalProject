import React, { useEffect, useState } from "react";
import "../App.css"

export function Stats({ applications }) {

    const [stats, setStats] = useState({});

    function computeStats() {
        console.log(applications)
        const totalApplications = applications.length;
        if (totalApplications == 0) {
            return {};
        }
        var salarySum = 0;
        var ipSum = 0;
        var interviewSum = 0;
        var offerSum = 0;
        var rejectSum = 0;
        applications.forEach(application => {
            salarySum += application.salary;
            var status = application.status;
            switch (status) {
                case "In Progress":
                    ipSum++;
                    break;
                case "Interview":
                    interviewSum++;
                    break;
                case "Offer":
                    offerSum++;
                    break;
                default:
                    rejectSum++;
            }
        });
        const avgSalary = (salarySum / totalApplications).toFixed(2);
        const ipPercent = ((ipSum / totalApplications) * 100.0).toFixed(2);
        const interviewPercent = ((interviewSum / totalApplications) * 100.0).toFixed(2);
        const offerPercent = ((offerSum / totalApplications) * 100.0).toFixed(2);
        const rejectPercent = ((rejectSum / totalApplications) * 100.0).toFixed(2);
        return {
            "totalApplications" : totalApplications,
            "avgSalary" : avgSalary,
            "ipPercent" : ipPercent,
            "interviewPercent" : interviewPercent,
            "offerPercent" : offerPercent,
            "rejectPercent" : rejectPercent
        }
    }

    useEffect(() => {
        const result = computeStats();
        setStats(result);
    }, [applications])

    return (
        <div>
            {applications.length == 0 ?
                <p>No stats to display</p>
                :
                <table>
                    <thead>
                        <tr>
                            <th>Stats</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Applications:</td>
                            <td>{stats.totalApplications}</td>
                        </tr>
                        <tr>
                            <td>Average Salary:</td>
                            <td>${stats.avgSalary}/hr</td>
                        </tr>
                        <tr>
                            <td>Percentage of "In Progress":</td>
                            <td>{stats.ipPercent}%</td>
                        </tr>
                        <tr>
                            <td>Percentage of "Interview":</td>
                            <td>{stats.interviewPercent}%</td>
                        </tr>
                        <tr>
                            <td>Percentage of "Offer":</td>
                            <td>{stats.offerPercent}%</td>
                        </tr>
                        <tr>
                            <td>Percentage of "Rejected":</td>
                            <td>{stats.rejectPercent}%</td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    )
}