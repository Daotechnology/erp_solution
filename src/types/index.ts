export interface User {
    id: string;
    password: string;
    roles?: ('admin' | 'editor')[];
    email?: string;
    resetPasswordToken?: string;
    resetPasswordExpiration?: string;
    loginAttempts?: number;
    lockUntil?: string;
    createdAt: string;
    updatedAt: string;
  }