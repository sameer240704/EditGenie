import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    myImage: {
        type: String,
        required: true
    },
    processedImage: {
        type: String,
        required: true
    }
}, { _id: false });

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true,
    },
    bookmarks: {
        type: bookmarkSchema
    }
});

export default mongoose.model("User", userSchema);

