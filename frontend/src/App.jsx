import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import UsersPage from './pages/UsersPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';

const navigation = [
  { to: '/users', label: 'Users' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/contacts', label: 'Contacts' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Dashboard</h1>
            <p className="sidebar-subtitle">Manage your site data</p>
          </div>
          <nav className="nav">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
