import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Heading from "../components/Heading";
import { useParams } from "react-router-dom";
import Assignment from "../components/Assignment";
import Test from "../components/Test";
const subjectApi = require("../apis/subject.api");

const Subjects = () => {

    const { id } = useParams();
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [subject, setSubject] = useState({});
    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [previousAssignments, setPreviousAssignments] = useState([]);
    const [upcomingTests, setUpcomingTests] = useState([]);
    const [previousTests, setPreviousTests] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const response = await subjectApi.getSubjectById(id);
                (response === "INVALID") && (window.location = `/`);
                console.log(response);
                setRole(response.role);
                setUsername(response.username);
                setSubject(response.subject);
                const assignments = response.subject.tasks;
                const tests = response.subject.tasks;
                tests.filter((task) => {
                    return (task.type === "Test")
                });
                assignments.filter((task) => {
                    return (task.type === "Assignment")
                });

                setStudents(response.subject.students);
                setLoading(false);
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[id]);

    const add = (e) => {
        let type;
        (e.target.innerText === "New Test") ? type = 'Test' : type = 'Assignment';
        window.location = `/create/${type}/${subject._id}`;
    }

    return (loading) ? <Loader /> :
    <div className = "text-center upper-margin container">
        <Header />
        <Heading heading = {subject.subjectName} />
        <div className = "subject text-left pl-3 pr-3 pt-3 pb-3">
            <li> Subject: <b> {subject.subjectName} </b></li>
            <li> Teacher: <b> {subject.teacherName} </b> </li>
            <li> Schedule: <i> {subject.schedule}</i> </li>
            <li> Subject Code: <b> {subject.subjectCode} </b> </li>
            <li> No. of Students: {students.length}</li>
            <li> 
                No. of Assignments: {previousAssignments.length + currentAssignments.length} 
            </li>
            <li> 
                No. of Tests Conducted: {upcomingTests.length + previousTests.length} 
            </li>
        </div>
        <div style = {role === "Student" ? {display: "none"} : null}>
            <button 
                className = "btn expand" 
                onClick = {add}> New Assignment
            </button>
            <button 
                className = "btn expand" 
                onClick = {add}> New Test
            </button>
        </div>
        <div className = "row mt-3 task">
            <div className = "col-md-6 mt-2 card">
                Assignments
                <div>
                    {currentAssignments.map((assignment) => {
                        return (
                            <Assignment 
                                username = {username}

                            />
                        )
                    })}
                </div>
                <div>
                    {previousAssignments.map((assignment) => {
                        return (
                            <Assignment 
                                username = {username}
                            />
                        )
                    })}
                </div>
            </div>
            <div className = "col-md-6 mt-2 card ">
                Tests
                <div>
                    {upcomingTests.map((test) => {
                        return (
                            <Test 
                                username = {username}
                            />
                        );
                    })}
                </div>
                <div>
                    {previousTests.map((test) => {
                        return (
                            <Test 
                                username = {username}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
}

export default Subjects;