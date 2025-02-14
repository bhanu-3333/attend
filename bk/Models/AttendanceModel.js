const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    rollNo : { type: mongoose.Schema.Types.Number, ref: "UserModel", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel"  },
    attendanceDate: { type: Date, default: Date.now, required: true },
    status: { type: String, enum: ['Present', 'absent'], default: 'Present' },
    department: { type: String },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", },
});

module.exports = mongoose.model("AttendanceModel", AttendanceSchema);
