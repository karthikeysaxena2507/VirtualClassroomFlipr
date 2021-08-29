const Subject = require("../models/subject.model");
const Task = require("../models/task.model");
const dateHelper = require("../utils/date");
const helper = require("../helper/data");

const addTask = async(req, res, next) => {
    try 
    {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            const data = req.body;
            console.log(data.date + " " + data.time);
            const dateString = data.date + " " + data.time;
            const deadline = dateHelper.convertDateStringToMilliseconds(dateString);
            // const task = new Task({
            //     title: data.title,
            //     description: data.description,
            //     type: data.type,
            //     subjectId: data.subjectId,
            //     deadline,
            //     creator: data.username,
            //     totalMarks: data.totalMarks,
            //     submissions: []
            // });
            // const subject = await Subject.findOne({_id: data.subjectId});
            // subject.tasks.push(task);
            // const user = await User.findOne({username: data.username});
            // user.pendingTasks.push(task);
            // await user.save()
            // await subject.save()
            // task.save()
            // .then((task) => {
            //     res.json(task);
            // })
            // .catch((error) => {
            //     res.json(next(error));
            // });
            res.json("Added");
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const getTaskById = async(req, res, next) => {
    try 
    {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.params.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            const task = await Task.findOne({_id: req.params.id});
            res.json(task);
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const submitTask = async(req, res, next) => {
    try 
    {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            const data = req.body;
            const task = await Task.findOne({_id: data.taskId});
            const submission = {
                studentName: data.studentName,
                submissionLink: data.submissionLink,
                subjectName: data.subjectName,
                taskId: data.taskId,
                marksObtained: 0
            }
            task.submissions.push(submission);
            const taskIds = [];
            taskIds.push(data.taskId);
            await helper.refreshUser(req.body.username, taskIds);
            task.save()
            .then((task) => {
                res.json(task);
            })
            .catch((err) => {
                res.json(next(err));
            })
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const updateMarks = async(req, res, next) => {
    try 
    {
        if(req.user === null) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else if(req.user.username !== req.body.username) {
            res.status(401).json({Error: "You are not authenticated"});
        }
        else {
            const data = req.body;
            const task = await Task.findOne({_id: data.taskId});
            const studentIndex = task.submissions.findIndex((submission) => (
                JSON.stringify(submission.studentName) === JSON.stringify(data.studentName)
            ));
            if (studentIndex !== (-1)) {
                task.submissions[studentIndex].marksObtained = data.marksObtained;
            }
            task.save()
            .then((task) => {
                res.json(task);
            })
            .catch((err) => {
                res.json(next(err));
            });
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

module.exports = {
    addTask,
    getTaskById,
    updateMarks,
    submitTask
}