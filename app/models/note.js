var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NoteSchema   = new Schema({
    title:{
        type:String,
    },
     text:  {
        type:String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true        
    },

    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }
    ],
    createdDateTime: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Note', NoteSchema,'note');