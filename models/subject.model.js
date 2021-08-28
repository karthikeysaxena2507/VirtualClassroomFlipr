const mongoose = require("mongoose");
const Task = require("./task.model");
const User = require("./user.model");
const { Schema } = mongoose

const commentSchema = new Schema(
    {
        author: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const subjectSchema = new Schema(
    {
        teacherName: {
            type: String,
            required: true
        },
        subjectName: {
            type: String,
            required: true
        },
        schedule: {
            type: String,
            required: true
        },
        subjectLink: {
            type: String,
            required: true
        },
        subjectCode: {
            type: String,
            required: true
        },
        comments: [commentSchema],
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: User
            }
        ],
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: Task
            }
        ]
    },
    {
        timestamps: true
    }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;