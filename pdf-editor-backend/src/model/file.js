import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true,
        unique: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileOriginalName: {
        type: String,
        required: true
    }
})

export default mongoose.model("File", FileSchema);