module.exports = {


    list: function (req, res, next) {

        Note.find({user :{_id:req.decoded.id}}).populate('tags user').exec(function (err, notes) {
            if (err) {
                next(err);
            }
            else
                res.status(200).json(notes);
        });

    },

    create: function (req, res, next) {

        var note = new Note();

        if(req.body._id)
        note._id=req.body._id;

        note.title = req.body.title;
        note.text = req.body.text;
        note.user = {_id: req.decoded.id};

        var tagList = [];

        async.each(req.body.tags, function (tag, callback) {
            if (tag._id) {
                Tag.findOne({_id: tag._id}, function (err, result) {
                    if (err)
                        callback(err);
                    else {
                        tagList.push(result);
                        callback();
                    }
                });
            } else {
                var newTag = new Tag();
                newTag.name = tag.name;
                newTag.user = {_id: req.decoded.id};
                newTag.save(function (err) {
                    if (err)
                        callback(err);
                    else {
                        tagList.push(newTag);
                        callback();
                    }
                });
            }

        }, function (err) {
            if (!err) {
                note.tags = tagList;

                Note.findOne({user:note.user,_id:note._id},function(err,noteDB){
                    if(err)
                        res.json({err:err});


                    if(!noteDB){
                        note.save(function (err) {
                            if (err)
                                next(err);
                            else {
                                req.app.io.emit('newNote',note);
                                res.json({message: 'Inserted.'});
                            }
                        });
                    }else if(noteDB){
                        noteDB.user=note.user;
                        noteDB.text=note.text;
                        noteDB.title=note.title;
                        noteDB.tags=tagList;
                        noteDB.save(function (err) {
                            if (err)
                                next(err);
                            else {
                                req.app.io.emit('updatedNote',noteDB);
                                res.json({message: 'Updated.'});
                            }
                        });
                    }

                });


            }
        });
    }

};