import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Heading from "../components/Heading";
const subjectApi = require("../apis/subject.api");

const userApi = require("../apis/user.api");

const CreateSubject = () => {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [subjectName, setSubjectName] = useState("");
    const [schedule, setSchedule] = useState("");

    useEffect(() => {
        const check = async() => {
            try {
                const data = await userApi.checkUser();
                (data === "INVALID") && (window.location = `/`);
                setLoading(false);
                setUsername(data.username);            
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    const create = async() => {
        try {
            const data = {
                username,
                subjectName,
                schedule
            };
            const response = await subjectApi.createSubject(data);
            window.location = `/subject/${response._id}`;
        }
        catch(error) {
            console.log(error);
        }
    }

    return (loading) ? <Loader /> :
    <div className = "container text-center">
        <Header />
        <Heading heading = "Create your Course" />
        <div className = "mt-3">
            <input 
                type = "text" 
                name = "code" 
                value = {subjectName}
                className = "mt-3 width pt-1 pb-1 pl-2 pr-2" 
                onChange = {(e) => setSubjectName(e.target.value)}
                placeholder = "Name of the Course" 
                autoComplete = "off" 
                required 
            />
        </div>
        <div className = "mt-3">
            <input 
                type = "text" 
                name = "code" 
                value = {schedule}
                className = "mt-3 width pt-1 pb-1 pl-2 pr-2" 
                onChange = {(e) => setSchedule(e.target.value)}
                placeholder = "Class Weekly Schedule" 
                autoComplete = "off" 
                required 
            />
        </div>
        <div className = "mt-3">
            <button 
                className = "btn expand" 
                onClick = {create}> Create
            </button>
        </div>
    </div>;
}

export default CreateSubject;