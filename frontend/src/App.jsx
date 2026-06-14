// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import NewComplaint from './components/NewComplaint';
// import Dashboard from './components/Dashboard';
// import Login from './components/Login';       // <-- NEW
// import Register from './components/Register'; // <-- NEW

// function App() {
//   // Check if the user has a VIP Pass stored in their browser
//   const token = localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/login'; // Redirect to login page
//   };

//   return (
//     <Router>
//       <div className="container mt-4">
//         {/* Navigation Bar */}
//         {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3 rounded d-flex justify-content-between">
//           <Link className="navbar-brand fw-bold" to="/">Complaint System</Link>
          
//           <div className="navbar-nav">
//             {token ? (
//               // What a LOGGED IN user sees
//               <>
//                 <Link className="nav-link text-white" to="/">Dashboard</Link>
//                 <Link className="nav-link text-white" to="/new">New Complaint</Link>
//                 <button className="btn btn-sm btn-danger ms-3 fw-bold" onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               // What a LOGGED OUT user sees
//               <>
//                 <Link className="nav-link text-white" to="/login">Login</Link>
//                 <Link className="nav-link text-white" to="/register">Register</Link>
//               </>
//             )}
//           </div>
//         </nav> */}

//         {/* Page Routing */}
//         <Routes>
//           <Route path="/" element={token ? <Dashboard /> : <Login />} />
//           <Route path="/new" element={token ? <NewComplaint /> : <Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewComplaint from './components/NewComplaint';
import Dashboard from './components/Dashboard';
import Login from './components/Login';       
import Register from './components/Register'; 

function App() {
  // Check if the user has a VIP Pass stored in their browser
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* We removed the <div className="container mt-4"> so the layout can stretch to the absolute edges! */}
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Login />} />
        <Route path="/new" element={token ? <NewComplaint /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;