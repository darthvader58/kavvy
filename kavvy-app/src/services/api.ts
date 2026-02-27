function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return import.meta.env.DEV ? 'http://localhost:5001' : '';
  }

  // Ignore localhost API targets in deployed environments where they are unreachable.
  if (typeof window !== 'undefined') {
    const isLocalBrowser = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isConfiguredLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredUrl);

    if (!isLocalBrowser && isConfiguredLocalhost) {
      return '';
    }
  }

  return configuredUrl.replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

export const api = {
  // Publishers
  async getPublishers(filters?: { genre?: string; requiresAgent?: boolean; openCalls?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.requiresAgent !== undefined) params.append('requiresAgent', String(filters.requiresAgent));
    if (filters?.openCalls !== undefined) params.append('openCalls', String(filters.openCalls));
    
    const response = await fetch(`${API_BASE_URL}/api/publishers?${params}`);
    if (!response.ok) throw new Error('Failed to fetch publishers');
    return response.json();
  },

  async getPublisher(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/publishers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch publisher');
    return response.json();
  },

  // Authors
  async getAuthors() {
    const response = await fetch(`${API_BASE_URL}/api/authors`);
    if (!response.ok) throw new Error('Failed to fetch authors');
    return response.json();
  },

  async getAuthor(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch author');
    return response.json();
  },

  async createOrUpdateAuthor(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create/update author');
    return response.json();
  },

  // Posts
  async getPosts(limit = 50, skip = 0) {
    const response = await fetch(`${API_BASE_URL}/api/posts?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async getPostsByAuthor(authorId: string) {
    const response = await fetch(`${API_BASE_URL}/api/posts/author/${authorId}`);
    if (!response.ok) throw new Error('Failed to fetch author posts');
    return response.json();
  },

  async createPost(data: { authorId: string; content: string; type: string }) {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  async likePost(postId: string, authorId: string) {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId })
    });
    if (!response.ok) throw new Error('Failed to like post');
    return response.json();
  },

  async commentOnPost(postId: string, authorId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId, content })
    });
    if (!response.ok) throw new Error('Failed to comment on post');
    return response.json();
  },

  // Manuscripts
  async getManuscripts(filters?: { authorId?: string; genre?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await fetch(`${API_BASE_URL}/api/manuscripts?${params}`);
    if (!response.ok) throw new Error('Failed to fetch manuscripts');
    return response.json();
  },

  async getManuscript(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/manuscripts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch manuscript');
    return response.json();
  },

  async getManuscriptsByAuthor(authorId: string) {
    const response = await fetch(`${API_BASE_URL}/api/manuscripts/author/${authorId}`);
    if (!response.ok) throw new Error('Failed to fetch author manuscripts');
    return response.json();
  },

  async createManuscript(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/manuscripts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create manuscript');
    return response.json();
  },

  async updateManuscript(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/api/manuscripts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update manuscript');
    return response.json();
  },

  // Waitlist
  async joinWaitlist(data: { email: string; name: string; userType: string; referralSource?: string }) {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join waitlist');
    }
    return response.json();
  },

  async getWaitlistCount() {
    const response = await fetch('/api/waitlist');
    if (!response.ok) throw new Error('Failed to fetch waitlist count');
    return response.json();
  }
};
