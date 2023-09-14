const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
   

});

userSchema.pre('save', function (next) {
    if (!this.isModified("password")) return next();
    let hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
    return next();
  })
  
  
  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  }

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

const Users = mongoose.model('User', userSchema);
// exports.userSchema = userSchema;
module.exports = Users;
