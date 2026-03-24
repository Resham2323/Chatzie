import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is required']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
    },
    password:{
        type:String,
        minLength:0,
        unique:true,
        required:[true, 'Password must be at least 6 charachter long']
    },
    threads: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread"
  }
]
}, {
    timestamps:true
});

userSchema.pre('save', async function(){
if(!this.isModified('password')) return;
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt)
});

userSchema.methods.matchPassword = async function(enteredPassowrd) {
 const isPasswordCorrect = await bcrypt.compare(enteredPassowrd, this.password);
 return isPasswordCorrect
}

const User = mongoose.model('User', userSchema);
export default User;