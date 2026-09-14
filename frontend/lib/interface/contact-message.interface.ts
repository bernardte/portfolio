export interface ContactMessage {
  name: string;
  subject: string;
  email: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessage {
  id: string;
  createdAt: Date;
}