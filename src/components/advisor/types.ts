export interface ForgetPasswordProps {
    toggleModal: () => void;
}

export interface otpProps {
    email: string
    purpose: string
    role: 'user' | 'advisor'
}

export interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

