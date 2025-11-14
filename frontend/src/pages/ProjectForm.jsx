import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProject, getProject, updateProject } from '../api/index.js';

const initialState = {
  title: '',
  completion: '',
  description: '',
};

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function fetchProject() {
      try {
        const data = await getProject(id);
        setValues({
          title: data.title || '',
          completion: data.completion ? data.completion.split('T')[0] : '',
          description: data.description || '',
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateProject(id, values);
      } else {
        await createProject(values);
      }
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading project...</p>;
  }

  return (
    <section>
      <h1>{isEdit ? 'Edit Project' : 'New Project'}</h1>
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
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
            value={values.completion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>{' '}
          <button type="button" onClick={() => navigate('/projects')} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
