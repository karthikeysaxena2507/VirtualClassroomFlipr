import axios from "axios";

axios.defaults.withCredentials = true;

// const backendUrl = "###" + "/tasks";
const backendUrl = "/tasks";

/**
 * The function to add a new Task
 * @returns added Task Data
 */
const addTask = async(data) => {
    const response = await axios.post(backendUrl, data);
    return response.data;
}

/**
 * The function to delete a task by Id
 * @param {String} taskId 
 */
const deleteTask = async(taskId) => {
    await axios.delete(backendUrl + `/${taskId}`);
}

/**
 * The function to get all tasks of a subject
 * @param {String} subjectId 
 * @returns list of tasks of a subject
 */
const getTasksBySubject = async(subjectId) => {
    const response = await axios.get(backendUrl + `/${subjectId}`);
    return response.data;
}

export {
    addTask,
    deleteTask,
    getTasksBySubject
}