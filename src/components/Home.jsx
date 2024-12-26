import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', facultyCount: 0, studentCount: 0 });

  // Fetch departments from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/departments')
      .then(response => setDepartments(response.data))
      .catch(err => console.log(err));
  }, []);

  const handleAdd = () => {
    const nbaRatio = (newDept.studentCount / newDept.facultyCount).toFixed(1) + ":1";
    const aufaRatio = ((newDept.studentCount * 1.2) / newDept.facultyCount).toFixed(1) + ":1";

    const updatedDept = { ...newDept, nbaRatio, aufaRatio };

    axios.post('http://localhost:3001/add-department', updatedDept)
      .then(response => {
        setDepartments([...departments, response.data]); // Update state with new department
        setNewDept({ name: '', facultyCount: 0, studentCount: 0 });
      })
      .catch(err => console.log(err));
  };

  const handleEdit = (index) => {
    const department = departments[index];
    axios.put(`http://localhost:3001/edit-department/${department._id}`, department)
      .then(response => {
        const updatedDepartments = [...departments];
        updatedDepartments[index] = response.data;
        setDepartments(updatedDepartments);
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (index) => {
    const department = departments[index];
    axios.delete(`http://localhost:3001/delete-department/${department._id}`)
      .then(() => {
        const updatedDepartments = departments.filter((_, i) => i !== index);
        setDepartments(updatedDepartments);
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))", padding: '20px', minHeight: '100vh' }} className="d-flex flex-column justify-content-center align-items-center text-center">
      <h1 className="text-white mb-4">Department Information</h1>
      
      <table className="table table-striped table-bordered table-sm w-75 my-3" style={{ maxWidth: '800px', fontSize: '0.9rem' }}>
        <thead className="table-dark">
          <tr>
            <th scope="col">Department</th>
            <th scope="col">Faculty Count</th>
            <th scope="col">Student Count</th>
            <th scope="col">NBA Ratio</th>
            <th scope="col">AUFA Ratio</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={index}>
              <td contentEditable onBlur={(e) => {
                const updatedDepartments = [...departments];
                updatedDepartments[index].name = e.target.innerText;
                setDepartments(updatedDepartments);
              }}>{dept.name}</td>
              <td contentEditable onBlur={(e) => {
                const updatedDepartments = [...departments];
                updatedDepartments[index].facultyCount = Number(e.target.innerText);
                setDepartments(updatedDepartments);
              }}>{dept.facultyCount}</td>
              <td contentEditable onBlur={(e) => {
                const updatedDepartments = [...departments];
                updatedDepartments[index].studentCount = Number(e.target.innerText);
                setDepartments(updatedDepartments);
              }}>{dept.studentCount}</td>
              <td>{dept.nbaRatio}</td>
              <td>{dept.aufaRatio}</td>
              <td>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(index)}>Save</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-4 w-50" style={{ maxWidth: '400px' }}>
        <h3 className="text-white mb-3">Add New Department</h3>
        <input type="text" className="form-control mb-2" placeholder="Department Name" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
        <input type="number" className="form-control mb-2" placeholder="Faculty Count" value={newDept.facultyCount} onChange={(e) => setNewDept({ ...newDept, facultyCount: e.target.value })} />
        <input type="number" className="form-control mb-2" placeholder="Student Count" value={newDept.studentCount} onChange={(e) => setNewDept({ ...newDept, studentCount: e.target.value })} />
        <button className="btn btn-primary w-100" onClick={handleAdd}>Add Department</button>
      </div>

      <Link to='/login' className="btn btn-light my-3">Logout</Link>
    </div>
  );
}

export default Home;
