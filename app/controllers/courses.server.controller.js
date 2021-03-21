const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const User = require('mongoose').model('User');
var ObjectId = require('mongodb').ObjectID;

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const course = new Course();
    course.courseCode = req.body.courseCode;
    course.courseName = req.body.courseName;
    course.section = req.body.section;
    course.semester = req.body.semester;

    //course.creator = req.body.username;
    console.log("req.body:" + req.body);
    console.log("req.req.body.:" + req.body.creator);
    //
    //
    User.findOne({studentnumber: req.body.creator}, (err, user) => {

        if (err) { return getErrorMessage(err); }
        //
        req.id = user._id;
        console.log('user studentNumber: ',req.studentnumber);
        console.log('user id: ',req.id);


	
    }).then( function () 
    {
        id = mongoose.Types.ObjectId (req.id);
        course.creator = id;
        console.log('req.user.studentnumber',req.studentnumber);

        course.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                //res.status(200).json(course);
                res.json(course);
            }
        });
    
    });
};
//
exports.list = function (req, res) {
    console.log('in list req.body.id: ' + req.params.user_id);
    Course.find({creator: req.body.id}).populate('creator', 'firstName lastName fullName').exec((err, courses) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        console.log('found courses?');
        res.status(200).json(courses);
    }
});
};
//
exports.articleByID = function (req, res, next, id) {
    //id = mongoose.Types.ObjectId (req.params.id);
    //console.log('course code: ' + Course.findOne({courseCode: courseCode}, (err, course));
    //Course.findById(id).populate('creator', 'firstName lastName fullName').exec((err, course) => {if (err) return next(err);
    Course.findOne({courseCode: id}, (err, course) => {if (err) return next(err);
    if (!course) return next(new Error('Failed to load course '
            + id));
        req.course = course;
        console.log('in articleById:', req.course)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.course);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.course)
    const course = req.course;
    course.title = req.body.title;
    course.content = req.body.content;
    course.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};
//
exports.delete = function (req, res) {
    console.log("in delete!!!!");


    Course.findByIdAndRemove(req.course.id, req.body, function (err, course) {
        if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                console.log("deleting: " + course.courseCode);
                res.status(200).json(course);
            }
        
      });
    //const course = req.course;
    //course.remove((err) => {
    //    if (err) {
    //        return res.status(400).send({
    //            message: getErrorMessage(err)
    //        });
    //    } else {
    //        console.log("deleting: " + course.courseCode);
    //        res.status(200).json(course);
    //    }
    //});
};
//The hasAuthorization() middleware uses the req.course and req.user objects
//to verify that the current user is the creator of the current course
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - creator: ',req.course.creator)
    console.log('in hasAuthorization - user: ',req.id)
    //console.log('in hasAuthorization - user: ',req.user._id)


    //if (req.course.creator.id !== req.id) {
    //    return res.status(403).send({
    //        message: 'User is not authorized'
    //    });
    //}
    console.log('going next from authoerization');
    next();
};
