const express = require('express');
const Attendance = require("../Controllers/attendanceController");
const router = express.Router();
const { identifer } = require("../MidlleWare/identification");

// For marking attendance (accessible by staff)
router.post("/markAttendance", identifer(['staff']), Attendance.markAttendance);

// For fetching attendance (if only logged in students fetch their own records, no need for :userid param)
router.get("/getAttendance", identifer(['student']), Attendance.getAttendance);

// For updating attendance (accessible by hod)
// Note: The route now includes an :id parameter to update a specific record
router.put("/updateAttendance/:id", identifer(['hod']), Attendance.updateAttendance);

module.exports = router;
