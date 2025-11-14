import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

const initialFormState = {
  title: '',
  completion: '',
  description: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load projects when the component mounts
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

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingProjectId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      completion: project.completion ? project.completion.slice(0, 10) : '',
      description: project.description || '',
    });
    setEditingProjectId(project._id);
  };

  const buildPayload = () => ({
    title: formData.title,
    completion: formData.completion
      ? new Date(formData.completion).toISOString()
      : '',
    description: formData.description,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = buildPayload();

    try {
      if (editingProjectId) {
        const updatedProject = await apiRequest(`/projects/${editingProjectId}`, {
          method: 'PUT',
          body: payload,
        });

        setProjects((prev) =>
          prev.map((project) => (project._id === editingProjectId ? updatedProject : project)),
        );
      } else {
        const createdProject = await apiRequest('/projects', {
          method: 'POST',
          body: payload,
        });

        setProjects((prev) => [...prev, createdProject]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((project) => project._id !== id));

      if (editingProjectId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete project');
    }
  };

  return (
    <main className="main">
      <div className="page-header">
        <h1>Projects</h1>
        <p>Track ongoing work and upcoming deadlines.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>{editingProjectId ? 'Edit Project' : 'Add Project'}</h2>
          {editingProjectId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
        <form className="card-body form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="form-input"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="completion">
              Completion Date
            </label>
            <input
              id="completion"
              name="completion"
              className="form-input"
              type="date"
              value={formData.completion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingProjectId ? 'Save changes' : 'Add project'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Project List</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading projects…</p>
          ) : projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
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
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(project._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
