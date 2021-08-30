import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import Heading from "../../components/Heading";
import { useParams } from "react-router-dom";
import Submission from "../../components/Submission";
const userApi = require("../../apis/user.api.js");
const taskApi = require("../../apis/task.api");

const AssignmentPage = () => {

    const type = "Assignment";
    const { id } = useParams();
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [task, setTask] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const user = await userApi.checkUser();
                (user === "INVALID") && (window.location = `/`);
                setLoading(false);
                setUsername(user.username);            
                setRole(user.role);
                const response = await taskApi.getTaskById(id, user.username);
                setTask(response);
                var d = new Date(response.deadline);
                console.log(d);
                // setDate(d.)
                console.log(response);
                setSubmissions(response.submissions);
            }
            catch(err) {
                // userApi.logoutUser();
                console.log(err);
            }
        }
        check();
    },[id]);

    return (loading) ? <Loader /> :
    <div className = "text-center upper-margin">
        <Header />
        <Heading heading = "Assignment" />
        <div className = "subject mt-4 text-left pl-3 pr-3 pt-3 pb-3">
            <h3> {task.title} </h3> 
            <li> Description: {task.description} </li>
            <li> Total Marks: {task.totalMarks} </li>
            <li> Deadline: {date} </li>
        </div>
        <div className = "mt-4">
            <h3> Submissions </h3>
            {submissions.map((submission) => {
                return (
                    <Submission
                        username = {username}
                        role = {role}
                    />);
            })}
        </div>
    </div>
}

export default AssignmentPage;