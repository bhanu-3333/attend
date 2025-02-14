import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for marking attendance (for staff)
  const [markDate, setMarkDate] = useState('');
  // Updated state: using rollNo instead of studentId
  const [students, setStudents] = useState([{ rollNo: '', status: 'Present' }]);
  const [markSuccess, setMarkSuccess] = useState('');
  const [markError, setMarkError] = useState('');

  // States for HOD updating attendance
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Determine user role from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
     console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.roles); // Ensure this matches your token payload
        // For students and HOD, fetch attendance records
        if (decoded.roles === 'student' || decoded.roles === 'hod') {
          fetchAttendance();
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  // Fetch attendance records (for students and HOD)
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/getAttendance',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            client: 'not browser',
          },
          withCredentials: true, // Include cookies if needed
        }
      );
      if (res.data.success) {
        setAttendanceRecords(res.data.data);
      } else {
        setError('Failed to fetch attendance records');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching attendance records');
    }
    setLoading(false);
  };

  // ----- Staff: Mark Multiple Attendance -----
  // Update a specific student's field (rollNo or status)
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  // Add a new student row
  const addStudentField = () => {
    setStudents([...students, { rollNo: '', status: 'Present' }]);
  };

  // Remove a student row by index
  const removeStudentField = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  // Handle form submission to mark attendance for multiple students at once
  const handleMultipleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarkError('');
    setMarkSuccess('');
  
    // Validate that each student entry has a roll number
    for (const student of students) {
      if (!student.rollNo) {
        setMarkError('All student entries must have a roll number.');
        return;
      }
    }
  
    try {
      const token = localStorage.getItem('token');
      // Correct order: payload as second argument, config as third argument.
      const res = await axios.post(
        'http://localhost:5000/api/markAttendance',
        {
          date: markDate,
          // Map each student object to the expected structure using rollNo and status
          students: students.map(({ rollNo, status }) => ({
            rollNo,
            status,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            client: 'not browser',
          },
          withCredentials: true, // Include cookies if needed
        }
      );
  
      if (res.data.success) {
        setMarkSuccess('Attendance marked successfully');
        // Optionally reset the form
        setMarkDate('');
        setStudents([{ rollNo: '', status: 'Present' }]);
      } else {
        setMarkError('Failed to mark attendance.');
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      setMarkError('Error marking attendance.');
    }
  };
  

  // ----- HOD: Update Attendance -----
  const handleUpdateAttendance = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/updateAttendance/${id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        alert('Attendance updated successfully');
        fetchAttendance();
        setEditingRecordId(null);
      } else {
        alert('Failed to update attendance');
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Error updating attendance');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {userRole}</p>

      {/* For students and HOD: Show attendance records */}
      {(userRole === 'student' || userRole === 'hod') && (
        <div>
          <h2>Attendance Records</h2>
          {loading ? (
            <p>Loading attendance...</p>
          ) : attendanceRecords.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  {userRole === 'hod' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                    <td>
                      {editingRecordId === record._id ? (
                        <input
                          type="text"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        />
                      ) : (
                        record.status
                      )}
                    </td>
                    {userRole === 'hod' && (
                      <td>
                        {editingRecordId === record._id ? (
                          <button onClick={() => handleUpdateAttendance(record._id)}>
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingRecordId(record._id);
                              setNewStatus(record.status);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* For staff: Multiple-student form to mark attendance */}
      {userRole === 'staff' && (
        <div>
          <h2>Mark Attendance</h2>
          {markError && <div style={{ color: 'red' }}>{markError}</div>}
          {markSuccess && <div style={{ color: 'green' }}>{markSuccess}</div>}
          <form onSubmit={handleMultipleMarkAttendance}>
            <div>
              <label>Date: </label>
              <input
                type="date"
                value={markDate}
                onChange={(e) => setMarkDate(e.target.value)}
                required
              />
            </div>
            <div>
              <h3>Students</h3>
              {students.map((student, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Roll No"
                    value={student.rollNo}
                    onChange={(e) =>
                      handleStudentChange(index, 'rollNo', e.target.value)
                    }
                    required
                  />
                  <select
                    value={student.status}
                    onChange={(e) =>
                      handleStudentChange(index, 'status', e.target.value)
                    }
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                  {students.length > 1 && (
                    <button type="button" onClick={() => removeStudentField(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addStudentField}>
                Add Another Student
              </button>
            </div>
            <button type="submit">Mark Attendance</button>
          </form>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
