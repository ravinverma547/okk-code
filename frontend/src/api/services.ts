import api from './client';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },
};

export const studentService = {
  getStudents: async (params = {}) => {
    const response = await api.get('/students', { params });
    return response.data.data;
  },
  enrollInCourse: async (courseId: string) => {
    const response = await api.post('/students/enroll', { courseId });
    return response.data.data;
  },
  registerStudent: async (data: any) => {
    const response = await api.post('/students/register', data);
    return response.data.data;
  },
  getStudentById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },
};

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    const responseData = response.data.data;

    // Backend se direct data nikal kar frontend ke format me set karna
    const userData = {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
      studentProfile: responseData.studentProfile
    };

    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return {
      token: responseData.token,
      user: userData
    };
  },

  registerStudent: async (studentData: any) => {
    const response = await api.post('/auth/register/student', studentData);
    const responseData = response.data.data;

    const userData = {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role
    };

    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return {
      token: responseData.token,
      user: userData
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  getAllAdmins: async () => {
    const response = await api.get('/auth/admins');
    return response.data;
  },

  createAdmin: async (adminData: any) => {
    const response = await api.post('/auth/admins', adminData);
    return response.data;
  },

  promoteUserToAdmin: async (userId: string) => {
    const response = await api.put(`/auth/promote/${userId}`);
    return response.data;
  }
};

export const feeService = {
  getAllFees: async () => {
    const response = await api.get('/fees/all');
    return response.data.data;
  },
  getStudentFees: async (studentId: string) => {
    const response = await api.get(`/fees/student/${studentId}`);
    return response.data.data;
  },
  createFee: async (data: any) => {
    const response = await api.post('/fees', data);
    return response.data.data;
  },
  payFee: async (id: string, amount: number, transactionId: string) => {
    const response = await api.put(`/fees/${id}/pay`, { amount, transactionId });
    return response.data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/fees/${id}/status`, { status });
    return response.data.data;
  },
};

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data.data;
  },
  createCourse: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data.data;
  },
  updateCourse: async (id: string, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data.data;
  },
  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data.data;
  },
};

export const attendanceService = {
  markAttendance: async (data: { studentId: string; date: string; status: string }) => {
    const response = await api.post('/attendance', data);
    return response.data.data;
  },
  getHistory: async (studentId: string) => {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data.data;
  },
};

export const performanceService = {
  getStudentPerformance: async (studentId: string) => {
    const response = await api.get(`/performance/student/${studentId}`);
    return response.data.data;
  },
  getAllPerformance: async () => {
    const response = await api.get('/performance');
    return response.data.data;
  },
  addPerformance: async (data: any) => {
    const response = await api.post('/performance', data);
    return response.data.data;
  },
};

export const noticeService = {
  getNotices: async () => {
    const response = await api.get('/notices');
    return response.data;
  },
  getNoticeById: async (id: string) => {
    const response = await api.get(`/notices/${id}`);
    return response.data;
  },
  createNotice: async (data: any) => {
    const response = await api.post('/notices', data);
    return response.data;
  },
  updateNotice: async (id: string, data: any) => {
    const response = await api.put(`/notices/${id}`, data);
    return response.data;
  },
  deleteNotice: async (id: string) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
};

export const courseRequestService = {
  createRequest: async (courseId: string) => {
    const response = await api.post('/course-requests', { courseId });
    return response.data.data;
  },
  getAllRequests: async () => {
    const response = await api.get('/course-requests');
    return response.data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/course-requests/${id}/status`, { status });
    return response.data.data;
  }
};