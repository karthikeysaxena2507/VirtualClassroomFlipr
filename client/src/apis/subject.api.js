import axios from "axios";

axios.defaults.withCredentials = true;

// const backendUrl = "###" + "/subjects";
const backendUrl = "/subjects";

/**
 * The function to fetch all subjects of the user
 * @param {String} username 
 * @returns list of subjects of a user
 */
const getSubjectsByUser = async(username) => {
    const response = await axios.get(backendUrl + `/${username}`);
    return response.data;
}

/**
 * The function to add a new course
 * @param {Object} data 
 * @returns the created subject
 */
const createSubject = async(data) => {
    const response = await axios.post(backendUrl, data);
    return response.data;
}

/**
 * The function to delete a course
 * @param {String} subjectId
 */
 const deleteSubject = async(subjectId) => {
    await axios.delete(backendUrl + `/${subjectId}`);
}

export {
    getSubjectsByUser,
    createSubject,
    deleteSubject
}
