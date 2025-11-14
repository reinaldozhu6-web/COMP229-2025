import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import UsersList from './pages/UsersList.jsx';
import UserForm from './pages/UserForm.jsx';
import ProjectsList from './pages/ProjectsList.jsx';
import ProjectForm from './pages/ProjectForm.jsx';
import ServicesList from './pages/ServicesList.jsx';
import ServiceForm from './pages/ServiceForm.jsx';
import ContactsList from './pages/ContactsList.jsx';
import ContactForm from './pages/ContactForm.jsx';

const navLinks = [
  { to: '/users', label: 'Users' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/contacts', label: 'Contacts' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav
          style={{
            width: '200px',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #ddd',
          }}
        >
          <h2>Dashboard</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navLinks.map((link) => (
              <li key={link.to} style={{ marginBottom: '0.5rem' }}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <Routes>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />

            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />

            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/new" element={<ServiceForm />} />
            <Route path="/services/:id/edit" element={<ServiceForm />} />

            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/contacts/new" element={<ContactForm />} />
            <Route path="/contacts/:id/edit" element={<ContactForm />} />

            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
