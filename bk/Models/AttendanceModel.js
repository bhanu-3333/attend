const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    attendanceDate: { type: Date, default: Date.now, required: true },
    status: { type: String, enum: ['Present', 'absent'], default: 'Present' },
    department: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
});

module.exports = mongoose.model("AttendanceModel", AttendanceSchema);
