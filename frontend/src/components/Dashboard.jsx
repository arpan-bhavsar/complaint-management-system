import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlayCircle, CheckCircle, Trash2, Search, Plus, History } from 'lucide-react';
import Layout from './Layout';
import { io } from 'socket.io-client';

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser?.role === 'admin';

  const [historyLog, setHistoryLog] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTicketTitle, setSelectedTicketTitle] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // NEW: WebSocket Connection with Security Bouncer (JWT)
  useEffect(() => {
    // 1. Grab the token from local storage
    const token = localStorage.getItem('token');

    // 2. Pass the token in the 'auth' object when connecting
    const socket = io('http://localhost:5000', {
      auth: {
        token: token
      }
    });

    socket.on('ticketStatusChanged', (updatedTicket) => {
      setComplaints((prevComplaints) => 
        prevComplaints.map(ticket => 
          ticket._id === updatedTicket._id ? updatedTicket : ticket
        )
      );
    });

    socket.on('newTicketCreated', (newTicket) => {
      setComplaints((prevComplaints) => [newTicket, ...prevComplaints]); 
    });

    socket.on('ticketDeleted', (deletedTicketId) => {
      setComplaints((prevComplaints) => 
        prevComplaints.filter(ticket => ticket._id !== deletedTicketId)
      );
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: newStatus, adminId: currentUser.id });
      setComplaints(complaints.map(ticket => 
        ticket._id === id ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, { data: { adminId: currentUser.id } });
      setComplaints(complaints.filter(ticket => ticket._id !== id));
    } catch (error) {
      alert('Failed to delete ticket.');
    }
  };

  const viewHistory = async (ticket) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/complaints/${ticket._id}/history`);
      setHistoryLog(response.data);
      setSelectedTicketTitle(ticket.title);
      setIsHistoryModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to load ticket timeline.');
    }
  };

  const filteredTickets = complaints.filter(ticket => {
    const ticketUserId = typeof ticket.user === 'object' ? ticket.user._id : ticket.user;
    
    if (!isAdmin && ticketUserId !== currentUser.id) return false;
    
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || ticket.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const statusData = isAdmin ? [
    { name: 'Pending', count: complaints.filter(c => c.status === 'Pending').length },
    { name: 'In Progress', count: complaints.filter(c => c.status === 'In Progress').length },
    { name: 'Resolved', count: complaints.filter(c => c.status === 'Resolved').length }
  ] : [];

  const categoryData = isAdmin ? [
    { name: 'Infrastructure', count: complaints.filter(c => c.category === 'Infrastructure').length },
    { name: 'Academics', count: complaints.filter(c => c.category === 'Academics').length },
    { name: 'Billing', count: complaints.filter(c => c.category === 'Billing').length },
    { name: 'IT Support', count: complaints.filter(c => c.category === 'IT Support').length },
    // NEW CATEGORIES ADDED BELOW:
    { name: 'Hostel', count: complaints.filter(c => c.category === 'Hostel').length },
    { name: 'Cafeteria', count: complaints.filter(c => c.category === 'Cafeteria').length },
    { name: 'Library', count: complaints.filter(c => c.category === 'Library').length },
    { name: 'Transportation', count: complaints.filter(c => c.category === 'Transportation').length }
  ].filter(category => category.count > 0) : []; 
  // Added a quick filter at the end so the chart only shows categories that actually have tickets!

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#EC4899', '#10B981', '#F43F5E'];

  return (
    <Layout>
      {isAdmin && (
        <div className="row mb-4 g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white fw-bold">Tickets by Status</div>
              <div className="card-body" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white fw-bold">Tickets by Category</div>
              <div className="card-body d-flex justify-content-center" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="count" label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{isAdmin ? 'PPSU Active Tickets' : 'My Service Requests'}</h4>
          <Link to="/new" className="btn btn-sm btn-primary fw-bold">
            <Plus size={18} className="me-1" /> New Ticket
          </Link>
        </div>
        
        <div className="card-body border-bottom bg-light">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input 
                  type="text" 
                  className="form-control ps-5" 
                  placeholder="Search tickets by title..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Academics">Academics</option>
                <option value="Billing">Billing</option>
                <option value="IT Support">IT Support</option>
                {/* NEW CATEGORIES */}
                <option value="Hostel">Hostel & Accommodation</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Library">Library</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Attachment</th> 
                  {isAdmin && <th className="text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, index) => (
                    <tr key={`skel-${index}`}>
                      <td><div className="skeleton sk-text"></div></td>
                      <td><div className="skeleton sk-text-short"></div></td>
                      <td><div className="skeleton sk-badge"></div></td>
                      <td><div className="skeleton sk-text-short"></div></td>
                      <td><div className="skeleton sk-avatar"></div></td>
                      {isAdmin && (
                        <td>
                          <div className="d-flex justify-content-center gap-3">
                            <div className="skeleton sk-icon"></div>
                            <div className="skeleton sk-icon"></div>
                            <div className="skeleton sk-icon"></div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-5 text-muted">
                      No tickets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="fw-bold">{ticket.title}</td>
                      <td>{ticket.category}</td>
                      <td>
                        <span className={`badge ${
                          ticket.status === 'Pending' ? 'bg-warning text-dark' : 
                          ticket.status === 'In Progress' ? 'bg-info text-dark' : 'bg-success'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      
                      <td>
                        {ticket.imageUrl ? (
                          <a href={ticket.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={ticket.imageUrl} 
                              alt="Issue" 
                              className="border border-secondary"
                              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          </a>
                        ) : (
                          <span className="text-muted small">None</span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-3">
                            <button 
                              className="btn btn-link text-info p-0 action-btn" 
                              data-tooltip="Start Progress"
                              onClick={() => updateStatus(ticket._id, 'In Progress')} 
                              disabled={ticket.status === 'In Progress' || ticket.status === 'Resolved'}
                            >
                              <PlayCircle size={20} />
                            </button>
                            
                            <button 
                              className="btn btn-link text-success p-0 action-btn" 
                              data-tooltip="Mark as Resolved"
                              onClick={() => updateStatus(ticket._id, 'Resolved')} 
                              disabled={ticket.status === 'Resolved'}
                            >
                              <CheckCircle size={20} />
                            </button>
                            
                            <button 
                              className="btn btn-link text-danger p-0 action-btn" 
                              data-tooltip="Delete Ticket"
                              onClick={() => deleteTicket(ticket._id)}
                            >
                              <Trash2 size={20} />
                            </button>

                            <button 
                              className="btn btn-link text-secondary p-0 action-btn" 
                              data-tooltip="View Timeline"
                              onClick={() => viewHistory(ticket)}
                            >
                              <History size={20} />
                            </button>
                            
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isHistoryModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
          <div className="card shadow-lg border-0" style={{ width: '90%', maxWidth: '500px', borderRadius: '16px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            
            <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Security Audit Timeline</h5>
                <small className="text-muted">Ticket: {selectedTicketTitle}</small>
              </div>
              <button className="btn-close" onClick={() => setIsHistoryModalOpen(false)}></button>
            </div>

            <div className="card-body px-4 pb-4 overflow-auto">
              {historyLog.length === 0 ? (
                <div className="text-center text-muted py-4">No security logs found.</div>
              ) : (
                <div className="position-relative ms-2 mt-2" style={{ borderLeft: '2px solid #e2e8f0' }}>
                  {historyLog.map((log) => (
                    <div key={log._id} className="position-relative mb-4 ps-4">
                      {/* Timeline Dot */}
                      <span className="position-absolute top-0 start-0 translate-middle rounded-circle bg-primary" style={{ width: '12px', height: '12px', border: '2px solid white' }}></span>
                      
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-dark fw-bold" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </small>
                      </div>
                      
                      <p className="mb-1 text-dark small" style={{ lineHeight: '1.4' }}>{log.details}</p>
                      
                      <small className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                        Authorized By: {log.changedBy?.name || 'System Auto'} ({log.changedBy?.role || 'System'})
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;