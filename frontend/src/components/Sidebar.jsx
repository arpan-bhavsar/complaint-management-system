import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, Building2 } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div 
      className="sidebar bg-dark text-white d-flex flex-column"
      style={{ 
        width: '260px', 
        height: '100vh',       /* Forces exact screen height */
        position: 'sticky',    /* Locks it in place */
        top: 0                 /* Glues it to the top edge */
      }}
    >
      <div className="sidebar-header flex-column align-items-start gap-1 py-4 px-3">
        <div className="d-flex align-items-center gap-2 w-100">
          <Building2 size={24} className="text-primary" />
          <span style={{ fontSize: '1.1rem', letterSpacing: '0px' }}>Complaint System</span>
        </div>
        <span className="text-muted small fw-normal mt-1" style={{ fontSize: '0.8rem' }}>
          IT & Infrastructure Desk
        </span>
      </div>
      
      <div className="sidebar-nav px-2">
        <div className="text-small fw-bold px-3 mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Menu</div>
        
        <Link 
          to="/" 
          className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        
        <Link 
          to="/new" 
          className={`sidebar-link ${location.pathname === '/new' ? 'active' : ''}`}
        >
          <PlusCircle size={20} />
          New Ticket
        </Link>
      </div>

      {/* The mt-auto class here is the magic trick that pushes this to the bottom! */}
      <div className="sidebar-footer mt-auto p-3 border-top border-secondary">
        <div className="d-flex align-items-center gap-3 mb-4 px-2">
          <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <div className="fw-bold text-white" style={{ fontSize: '14px' }}>{currentUser?.name || 'User'}</div>
            <div className="text-muted" style={{ fontSize: '12px', textTransform: 'capitalize' }}>{currentUser?.role || 'Student'}</div>
          </div>
        </div>
        
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 border-0 bg-opacity-10">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;