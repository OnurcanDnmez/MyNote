var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {
        type: String,

    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password:{
        type:String,
        require:true
    },
    dtCreate: {
        type: Date,
        default: Date.now
    },
    dtUpdate: {
        type: Date,
        default: Date.now
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]

});
UserSchema.pre('save', function (next) {
    dtUpdate = Date.now();
    next();
});

module.exports = mongoose.model('User', UserSchema,'user');