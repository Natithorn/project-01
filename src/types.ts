export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  file?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

export interface ChatState {
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
}

export interface MedicalRecord {
  id: string;
  date: Date;
  symptoms: string[];
  diagnosis: string;
  notes: string;
  images?: string[];
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved';
}

export interface PatientProfile {
  id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  medicalHistory: MedicalRecord[];
}

export interface SymptomCategory {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  initialTreatment: string[];
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic';
  distance: number;
  address: string;
  openHours: string;
  rating: number;
}