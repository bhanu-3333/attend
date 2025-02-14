const AttendanceModel = require("../Models/AttendanceModel");

exports.markAttendance = async (req, res) => {
    // Destructure before checking
    const { date, students } = req.body;

    if (!date || !students) {
        return res.json({ success: false, message: "Date and students are required" });
    }

    try {
        const records = students.map((student) => ({
            studentId: student._id,
            attendanceDate: date,
            status: student.status,
            department: req.user.department,
            markedBy: req.user._id
        }));
        await AttendanceModel.insertMany(records);
        res.json({ success: true, message: "Attendance marked successfully" });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.json({ success: false, message: "Error marking attendance" });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        // If you intend to fetch for the logged in user, no need for :userid param.
        const records = await AttendanceModel.find({ studentId: req.user._id }).populate('studentId');

        if (!records || records.length === 0) {
            return res.status(404).json({ success: false, message: "No attendance records found" });
        }

        res.json({ success: true, data: records });
    } catch (error) {
        console.error("Error getting attendance:", error);
        res.json({ success: false, message: "Error getting attendance" });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        // Make sure the route includes an :id parameter
        const record = await AttendanceModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!record) {
            return res.status(404).json({ success: false, message: "No attendance record found" });
        }

        res.json({ success: true, message: "Attendance updated successfully", data: record });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.json({ success: false, message: "Error updating attendance", data: error });
    }
};
