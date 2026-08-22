export const mockUsers = [
  {
    id: "user_hr_1",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "hr@company.com",
    password: "password123",
    role: "HR",
    department: "HR",
    designation: "HR Director & Manager",
    avatar: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80"
  },
  {
    id: "user_emp_1",
    firstName: "David",
    lastName: "Lee",
    email: "employee@company.com",
    password: "password123",
    role: "EMPLOYEE",
    department: "Engineering",
    designation: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  }
];

export function createMockToken(payload: any) {
  if (typeof window === 'undefined') {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
  return btoa(JSON.stringify(payload));
}

export function decodeMockToken(token: string) {
  try {
    if (typeof window === 'undefined') {
      return JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    }
    return JSON.parse(atob(token));
  } catch (e) {
    return null;
  }
}
