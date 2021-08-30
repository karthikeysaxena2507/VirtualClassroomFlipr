import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import Heading from "../../components/Heading";
const userApi = require("../../apis/user.api.js");

const TestPage = () => {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async() => {
            try {
                const user = await userApi.checkUser();
                (user === "INVALID") && (window.location = `/`);
                console.log(user);
                setLoading(false);
                setUsername(user.username);            
                setRole(user.role);
            }
            catch(err) {
                userApi.logoutUser();
                console.log(err);
            }
        }
        check();
    },[]);

    return (loading) ? <Loader /> :
    <div className = "text-center upper-margin">
        <Header />
        <Heading heading = "Subject" />
        <div className = "mt-3">
            Test Page
        </div>
    </div>
}

export default TestPage;