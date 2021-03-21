const users = require('../controllers/users.server.controller');
const courses = require('../controllers/courses.server.controller');
//
module.exports = function (app) {
        app.route('/api/articles')
            .get(courses.list) 
            .post(users.requiresLogin, courses.create);
        //
        app.route('/api/articles/:articleId')
            .get(courses.read)
            .put(users.requiresLogin, courses.hasAuthorization, courses.update)
            .delete(users.requiresLogin, courses.hasAuthorization, courses.delete);
        //
        app.param('articleId', courses.articleByID);
};
