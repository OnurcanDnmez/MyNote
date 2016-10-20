module.exports = function (router) {


    var noteController = require('../controllers/note.controller');

    /* GET home page. */
    router.route('/notes')
        .get(noteController.list)
        .post(noteController.create);


    router.route('/tags').get(function (req, res) {

        res.status(200).json([{name: "Work"}, {name: "Personal"}, {name: "Remember"}]);
    });

}