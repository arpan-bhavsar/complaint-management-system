import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Layout from './Layout';

function NewComplaint() {
  const [formData, setFormData] = useState({ title: '', category: 'Infrastructure', description: '' });
  const [image, setImage] = useState(null); 
  
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true); 

    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      const submitData = new FormData();
      submitData.append('user', currentUser.id);
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (image) {
        submitData.append('image', image);
      }

      await axios.post('https://complaint-management-system-backend-caok.onrender.com/api/complaints', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint.');
      
      setIsSubmitting(false); 
    }
  };

  return (
    <Layout>
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">PPSU Service Request</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Issue Title</label>
            <input type="text" name="title" className="form-control" onChange={handleChange} required />
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            {/* FIXED: Mapped to formData.category and added name="category" */}
            <select 
              className="form-select" 
              name="category"
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Select a category...</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Academics">Academics</option>
              <option value="Billing">Billing</option>
              <option value="IT Support">IT Support</option>
              <option value="Hostel">Hostel & Accommodation</option>
              <option value="Cafeteria">Cafeteria</option>
              <option value="Library">Library</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea name="description" className="form-control" rows="4" onChange={handleChange} required></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Attach an Image (Optional)</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <small className="text-muted">Upload a photo of the issue to help our team.</small>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold"
            disabled={isSubmitting} 
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading Image & Submitting...
              </>
            ) : (
              'Submit Ticket'
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default NewComplaint;