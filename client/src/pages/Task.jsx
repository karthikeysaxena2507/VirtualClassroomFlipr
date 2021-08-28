import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
const userApi = require("../apis/user.api.js");

const Task = () => {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const user = await userApi.checkUser();
                (user === "INVALID") && (window.location = `/`);
                setLoading(false);
                setUsername(user.username);            
                setRole(user.role);
            }
            catch(err) {
                console.log(err);
            }
        }
        check();
    },[]);

    const logout = async() => {
        await userApi.logoutUser();
        window.location = "/";
    }

    return (loading) ? <Loader /> :
    <div className = "text-center upper-margin">
        Task Page 
        <br />
        username: {username} 
        <br />
        role: {role}
        <br />
        <button className = "btn btn-lg expand" onClick = {logout}> Logout </button>
    </div>
}

export default Task;