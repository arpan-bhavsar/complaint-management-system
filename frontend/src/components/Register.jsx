import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student', // Default role
    adminSecret: ''  // Blank by default
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://complaint-management-system-backend-caok.onrender.com/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">Create an Account</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input type="text" name="name" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email address</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required />
              </div>

              {/* NEW: Role Selection Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-bold">Account Type</label>
                <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                  <option value="student">Student / Applicant</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {/* NEW: Hidden Admin Secret Field (Only shows if Admin is selected) */}
              {formData.role === 'admin' && (
                <div className="mb-4 p-3 bg-light border rounded">
                  <label className="form-label fw-bold text-danger">Enter Admin Secret Key</label>
                  <input 
                    type="password" 
                    name="adminSecret" 
                    className="form-control border-danger" 
                    placeholder="Required for Admin accounts"
                    onChange={handleChange} 
                    required 
                  />
                  <small className="text-muted">You must have authorization to create an admin account.</small>
                </div>
              )}

              <button type="submit" className="btn btn-success w-100 fw-bold">Register</button>
            </form>
            <div className="mt-3 text-center">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;