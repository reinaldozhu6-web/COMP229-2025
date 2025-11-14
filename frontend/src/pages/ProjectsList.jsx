import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await apiRequest('/projects');
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        alert('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Projects</h1>
        <button type="button" onClick={() => navigate('/projects/new')}>
          New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Completion</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.completion ? new Date(project.completion).toLocaleDateString() : '—'}</td>
                <td>{project.description}</td>
                <td>
                  <button type="button" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                    Edit
                  </button>{' '}
                  <button type="button" onClick={() => handleDelete(project._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
