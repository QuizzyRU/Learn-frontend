const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
    
    // Bind the request method to this instance
    this.request = this.request.bind(this);
    
    // Bind auth methods
    this.auth = {
      login: this.login.bind(this),
      register: this.register.bind(this)
    };
    
    // Bind user methods
    this.user = {
      getCurrentUser: this.getCurrentUser.bind(this),
      updateProfile: this.updateProfile.bind(this),
      uploadAvatar: this.uploadAvatar.bind(this),
      getProgress: this.getProgress.bind(this),
      getUserProfile: this.getUserProfile.bind(this),
      getUserProgress: this.getUserProgress.bind(this)
    };
    
    // Bind task methods
    this.task = {
      getAll: this.getAll.bind(this),
      getById: this.getById.bind(this),
      startTask: this.startTask.bind(this),
      solve: this.solve.bind(this),
      executeQuery: this.executeQuery.bind(this),
      visualizeDb: this.visualizeDb.bind(this),
      getTop: this.getTop.bind(this),
      uploadTask: this.uploadTask.bind(this)
    };
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Something went wrong');
    }

    return data;
  }

  // Auth methods
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to login');
    }

    this.setToken(data.access_token);
    return data;
  }

  async register(username, password, name) {
    const response = await fetch(
      `${API_URL}/auth/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}`,
      {
        method: 'POST',
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to register');
    }

    return data;
  }

  // User methods
  async getCurrentUser() {
    return this.request('/user/me');
  }

  async updateProfile(data) {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/user/avatar`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to upload avatar');
    }

    return data;
  }

  async getProgress() {
    return this.request('/task/user/progress');
  }

  async getUserProfile(username) {
    return this.request(`/user/${username}`);
  }

  // Task methods
  async getAll() {
    return this.request('/task/all');
  }

  async getById(taskId) {
    return this.request(`/task/${taskId}`);
  }

  async startTask(taskId) {
    return this.request(`/task/start/${taskId}`, {
      method: 'POST',
    });
  }

  async solve(taskId, answer) {
    return this.request(`/task/solve/${taskId}?answer=${encodeURIComponent(answer)}`, {
      method: 'POST',
    });
  }

  async executeQuery(taskId, query) {
    return this.request(`/task/${taskId}/execute?query=${encodeURIComponent(query)}`, {
      method: 'POST',
    });
  }

  async visualizeDb(taskId) {
    return this.request(`/task/${taskId}/visualize`);
  }

  async getTop() {
    return this.request('/user/top');
  }

  async getUserProgress(username) {
    return this.request(`/user/progress/${username}`);
  }

  async uploadTask({ name, description, level, answer, price, file }) {
    const formData = new FormData();
    formData.append('file', file);

    const queryParams = new URLSearchParams({
      name,
      description,
      level,
      answer,
      price
    }).toString();

    const response = await fetch(`${API_URL}/admin/upload-task/?${queryParams}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to upload task');
    }

    return data;
  }
}

export default new ApiClient();