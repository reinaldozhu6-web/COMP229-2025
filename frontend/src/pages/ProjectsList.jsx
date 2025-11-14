import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

function createInitialFormState() {
  return {
    title: '',
    completion: '',
    description: '',
  };
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(createInitialFormState());
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await apiRequest('/projects', {
        method: 'POST',
        body: formValues,
      });

      setProjects((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
      setFormValues(createInitialFormState());
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <section>
      <h1>Projects</h1>
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
                <td>
                  {project.completion
                    ? new Date(project.completion).toLocaleDateString()
                    : '—'}
                </td>
                <td>{project.description}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(project._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: '2rem' }}>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="completion">Completion Date</label>
          <input
            id="completion"
            name="completion"
            type="date"
            value={formValues.completion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add Project'}
          </button>
        </div>
      </form>
    </section>
  );
}
