export interface WelcomeEmailData {
  email: string;
  waitlistName: string;
  position: number;
  status: 'approved' | 'pending';
}

export interface EmailNotification {
  type: 'email';
  recipient: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
}