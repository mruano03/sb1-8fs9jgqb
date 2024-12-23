export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Notification extends CreateNotificationData {
  id: string;
  created_at: string;
  read: boolean;
}