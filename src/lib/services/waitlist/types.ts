export interface WaitlistEntry {
  id: string;
  waitlist_id: string;
  name: string;
  email: string;
  position: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface CreateWaitlistEntryData {
  name: string;
  email: string;
}

export interface WaitlistEntryResponse extends WaitlistEntry {
  waitlists?: {
    name: string;
    user_id: string;
  };
}