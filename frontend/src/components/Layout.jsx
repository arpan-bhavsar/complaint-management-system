import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    // Added Bootstrap flex classes to force a full-height row layout
    <div className="app-layout d-flex min-vh-100 bg-light">
      
      <Sidebar />
      
      {/* flex-grow-1 allows this side to expand, while overflow handles the scrolling */}
      <div className="main-content flex-grow-1 p-4 w-100" style={{ overflowX: 'hidden' }}>
        {children}
      </div>
      
    </div>
  );
}

export default Layout;