var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TagSchema   = new Schema({
    name:  {
        type:String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    ,

    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
    ],

    createdDateTime: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Tag', TagSchema,'tag');