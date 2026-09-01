export type UserRole =
  | 'school_admin'
  | 'headmaster'
  | 'academic_master'
  | 'admission_officer'
  | 'teacher'
  | 'accountant'
  | 'parent'
  | 'student'
  | 'librarian'
  | 'hostel_master'
  | 'security';

export interface User {
  id: number;
  school_id: number | null;
  name: string;
  email: string;
  phone?: string;
  user_type: UserRole;
  is_active: boolean;
  school?: School;
}

export interface School {
  id: number;
  name: string;
  registration_number: string;
  school_type: 'day' | 'boarding' | 'mixed';
  ownership: 'private' | 'public' | 'faith_based' | 'ngo';
  region?: string;
  district?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  students_count?: number;
  staff_count?: number;
}

export interface Student {
  id: number;
  school_id: number;
  admission_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female';
  class_name: string;
  stream_name: string;
  boarding_status: 'day' | 'boarding';
  status: 'active' | 'transferred' | 'graduated' | 'suspended' | 'inactive';
  guardian_name?: string;
  guardian_phone?: string;
  fee_balance?: number;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  admission_number: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'sick';
  remarks?: string;
}

export interface MarkRecord {
  id: number;
  student_id: number;
  student_name: string;
  subject_name: string;
  score: number;
  max_score: number;
  grade: string;
  points: number;
  remarks?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  student_name: string;
  class_name: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  due_date: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
}

export interface Payment {
  id: number;
  receipt_number: string;
  student_name: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'mobile_money' | 'card';
  reference_number?: string;
  payment_date: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  audience: string;
  created_at: string;
  author_name: string;
}
