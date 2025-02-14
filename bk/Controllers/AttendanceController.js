const AttendanceModel = require("../Models/AttendanceModel");

exports.markAttendance = async (req, res) => {
  // Destructure before checking
  const { date, students } = req.body;

  if (!date || !students) {
    return res.json({ success: false, message: "Date and students are required" });
  }

  try {
    // Use rollNo instead of _id
    const records = students.map((student) => ({
      rollNo: student.rollNo, // updated from student._id
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
    // Fetch attendance records based on the student's roll number
    const records = await AttendanceModel.find({ rollNo: req.user.rollNo });
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
    // Update remains unchanged since it uses the record ID
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
