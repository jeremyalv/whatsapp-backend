import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,

  first_name: String,
  last_name: String,

  avatar_url: String,
  token: String
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function(next) {
  if (this.password !== '' && this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, res) => {
        this.password = res;
        next();
      });
    });
  } else {
    next();
  }
});

// Export model
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

export default User;