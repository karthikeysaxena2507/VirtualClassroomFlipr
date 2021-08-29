const Subject = require("../models/subject.model");
const Task = require("../models/task.model");

/**
 * Function to fetch subjects data from their IDs
 * @param {Array} subjectIds 
 * @returns list of subjects
 */
const getSubjectsFromSubjectIds = async(subjectIds) => {
    const subjects = [];
    for (let id of subjectIds) {
        const subject = await Subject.findOne({_id: id});
        subjects.push(subject);
    }
    return subjects;
}

/**
 * Function to fetch tasks data from their IDs
 * @param {Array} taskIds 
 * @returns list of tasks
 */
const getTasksFromTaskIds = async(taskIds) => {
    const tasks = [];
    for (let id of taskIds) {
        const task = await Task.findOne({_id: id});
        tasks.push(task);
    }
    return tasks;
}

/**
 * Function to fetch task data from its ID
 * @param {String} taskId 
 * @returns task details
 */
const getTaskFromTaskId = async(taskId) => {
    const task = await Task.findOne({_id: taskId});
    return task;
}

/**
 * Function to update status of tasks of the user
 * @param {String} username 
 */
const refreshTasksByUser = async(username) => {
    const user = await User.findOne({username});
    const taskIds = user.pendingTasks;
    const tasks = getTasksFromTaskIds(taskIds);
    var date = new Date();
    var currentTime = date.getMilliseconds();
    const ids = [];
    for (let task of tasks) {
        if (task.deadline < currentTime) {
            ids.push(task._id);
        }
    }
    refreshUser(username, ids);
}

/**
 * Function to update status of pending tasks of the user
 * @param {String} username
 * @param {Array} taskIds 
 */
const refreshUser = async(username, taskIds) => {
    const user = await User.findOne({username});
    const ids = user.pendingTasks;
    for (let id of taskIds) {
        let taskIndex = ids.findIndex((taskId) => JSON.stringify(taskId) === JSON.stringify(id));
        if (taskIndex !== (-1)) {
            taskIds.splice(taskIndex, 1);
            user.completedTasks.push(getTaskFromTaskId(id));
        }
    }
    user.pendingTasks = taskIds;
    user.save();
}

module.exports = {
    getSubjectsFromSubjectIds,
    refreshTasksByUser,
    getTasksFromTaskIds,
    getTaskFromTaskId,
    refreshUser
}