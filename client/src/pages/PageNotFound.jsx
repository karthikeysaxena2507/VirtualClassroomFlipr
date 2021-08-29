/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import error from "../images/Error404.png";

const PageNotFound = () => {
    return (
    <div className = "text-center upper-margin">
        <h1 className = "mt-5"> ERROR 404: PAGE NOT FOUND </h1>
        <img src = {error} style = {{width: "20%"}}/>
    </div>);
}

export default PageNotFound;