module.exports = function (router) {
    /* GET home page. */
    router.route('/').get(function (req, res) {
        //var token=req.get('Authorization');
        var token = req.cookies.token;
        if (token) {

            try {
                var decoded = jwt.verify(token, app.get('superSecret'));
                if (decoded) {
                    res.render('main', {title: 'Express', error: null});
                } else {
                    res.render('index', {title: 'Express', error: null});
                }
            } catch (err) {
                res.cookie('message', 'invalid info');
                res.render('index', {title: 'Express', error: null});
            }
        } else {
            res.cookie('message', 'invalid info');
            res.cookie('token', 'eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im9udXJjYW5kb25tZXpAZ21haWwuY29tIiwiYWRtaW4iOnRydWV9.g_FpngRFu8qI0vdMdaAIRfY9ZG5olqWXuZuEPDvMKMk');
            res.render('index', {title: 'Express', error: null});
        }

    });


    router.route('/login').post(function (req, res) {

        if (!req.body.inputEmail || !req.body.inputPassword) {
            res.render('login', {title: 'Express', error: 'missing fields'});
        } else {
            User.findOne({$and: [{email: req.body.inputEmail}, {password: req.body.inputPassword}]}, function (err, dbUser) {
                if (dbUser) {

                    var token = jwt.sign({id:dbUser._id}, app.get('superSecret'), {
                        expiresIn: 144000//expires in 24 hours,
                    });

                    // return the information including token as JSON
                    res.cookie('token', token);
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            });
        }
    });

}