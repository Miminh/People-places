const Mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = Mongoose.Schema;

const userSchema = new Schema({
    name : { type : String, required : true},
    email : { type : String, required : true, unique: true},
    image : { type : String, required : true},
    password : { type : String, required : true, minlength : 6},
    places : [{type : Mongoose.Types.ObjectId, required : true, ref : 'Place'}]
})

userSchema.plugin(uniqueValidator);

module.exports = Mongoose.model('User', userSchema);