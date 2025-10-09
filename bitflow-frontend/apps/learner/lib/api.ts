import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string, remember: boolean = false) {
    const response = await this.client.post('/auth/login', { email, password, remember });
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.post('/auth/change-password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return response.data;
  }

  // Learner Profile
  async getProfile() {
    const response = await this.client.get('/learner/profile');
    return response.data;
  }

  async updateProfile(data: Record<string, any>) {
    const response = await this.client.patch('/learner/profile', data);
    return response.data;
  }

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await this.client.post('/learner/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getAttendanceData(params?: Record<string, any>) {
    const response = await this.client.get('/learner/profile/attendance', { params });
    return response.data;
  }

  async getFeeStatus() {
    const response = await this.client.get('/learner/profile/fees');
    return response.data;
  }

  async getPerformance() {
    const response = await this.client.get('/learner/profile/performance');
    return response.data;
  }

  async getTimetable() {
    const response = await this.client.get('/learner/profile/timetable');
    return response.data;
  }

  async getLibraryResources() {
    const response = await this.client.get('/learner/profile/library');
    return response.data;
  }

  // Dashboard
  async getDashboard() {
    const response = await this.client.get('/learner/dashboard');
    return response.data;
  }

  // Library
  async getLibraryResourcesList(params?: Record<string, any>) {
    const response = await this.client.get('/learner/library/resources', { params });
    return response.data;
  }

  async getLibraryResourceDetails(id: string) {
    const response = await this.client.get(`/learner/library/resources/${id}`);
    return response.data;
  }

  async toggleBookmark(id: string) {
    const response = await this.client.post(`/learner/library/resources/${id}/bookmark`);
    return response.data;
  }

  async getBookmarks() {
    const response = await this.client.get('/learner/library/bookmarks');
    return response.data;
  }

  // Assessments
  async getAssessments(params?: Record<string, any>) {
    const response = await this.client.get('/learner/assessments', { params });
    return response.data;
  }

  async getAssessmentDetails(id: string) {
    const response = await this.client.get(`/learner/assessments/${id}`);
    return response.data;
  }

  async submitAssessment(id: string, answers: any[]) {
    const response = await this.client.post(`/learner/assessments/${id}/submit`, { answers });
    return response.data;
  }

  // Announcements
  async getAnnouncements(params?: Record<string, any>) {
    const response = await this.client.get('/learner/announcements', { params });
    return response.data;
  }

  async getAnnouncementDetails(id: string) {
    const response = await this.client.get(`/learner/announcements/${id}`);
    return response.data;
  }

  async markAnnouncementAsRead(id: string) {
    const response = await this.client.post(`/learner/announcements/${id}/read`);
    return response.data;
  }

  // Notifications
  async getNotifications(params?: Record<string, any>) {
    const response = await this.client.get('/learner/notifications', { params });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.client.get('/learner/notifications/unread-count');
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    const response = await this.client.post(`/learner/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.client.post('/learner/notifications/mark-all-read');
    return response.data;
  }

  // Documents
  async getDocumentFolders() {
    const response = await this.client.get('/learner/documents/folders');
    return response.data;
  }

  async uploadDocument(folderId: string, file: File) {
    const formData = new FormData();
    formData.append('document', file);
    const response = await this.client.post(`/learner/documents/folders/${folderId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Fees
  async getFeeInvoices() {
    const response = await this.client.get('/learner/fees/invoices');
    return response.data;
  }

  async getFeeInvoiceDetails(id: string) {
    const response = await this.client.get(`/learner/fees/invoices/${id}`);
    return response.data;
  }
}

const api = new ApiClient();
export default api;
