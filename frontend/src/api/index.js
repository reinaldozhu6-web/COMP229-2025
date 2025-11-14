const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const { headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getUsers() {
  return request('/api/users/');
}

export function getUser(id) {
  return request(`/api/users/${id}`);
}

export function createUser(data) {
  return request('/api/users/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(id, data) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export function deleteAllUsers() {
  return request('/api/users/', {
    method: 'DELETE',
  });
}

export function getProjects() {
  return request('/api/projects/');
}

export function getProject(id) {
  return request(`/api/projects/${id}`);
}

export function createProject(data) {
  return request('/api/projects/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProject(id, data) {
  return request(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

export function deleteAllProjects() {
  return request('/api/projects/', {
    method: 'DELETE',
  });
}

export function getServices() {
  return request('/api/services/');
}

export function getService(id) {
  return request(`/api/services/${id}`);
}

export function createService(data) {
  return request('/api/services/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateService(id, data) {
  return request(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteService(id) {
  return request(`/api/services/${id}`, {
    method: 'DELETE',
  });
}

export function deleteAllServices() {
  return request('/api/services/', {
    method: 'DELETE',
  });
}

export function getContacts() {
  return request('/api/contacts/');
}

export function getContact(id) {
  return request(`/api/contacts/${id}`);
}

export function createContact(data) {
  return request('/api/contacts/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateContact(id, data) {
  return request(`/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteContact(id) {
  return request(`/api/contacts/${id}`, {
    method: 'DELETE',
  });
}

export function deleteAllContacts() {
  return request('/api/contacts/', {
    method: 'DELETE',
  });
}
