const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseCode: {
        type: String,
        default: '', 
        trim: true,
        required: 'Course Code cannot be blank'
    },
    courseName: {
        type: String, default: '',
        trim: true
    },
    section: {
        type: String, default: '',
        trim: true
    },
    semester: {
        type: String, default: '',
        trim: true
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
mongoose.model('Course', CourseSchema);
