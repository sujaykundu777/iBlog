// User model
import mongoose from 'mongoose';
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const User = mongoose.model("User", UserSchema);
export default User;



