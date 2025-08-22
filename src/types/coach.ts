export type CoachPayload = {
  // COACHE table fields
  coachname: string; // 漢字氏名
  coachname_kana: string; // フリガナ
  email: string;
  phone_number?: string;
  birthday?: string; // 'YYYY-MM-DD'
  Sex?: 'male' | 'female' | 'other';
  line_user_id?: string;
  profile_picture_url?: string;
  bio?: string;
  hourly_rate?: number;
  location_id: string; // 主拠点
  golf_exp?: number;
  certification?: string;
  setting_1?: string; // 'online:true' 等
  setting_2?: string;
  setting_3?: string;
  Lesson_rank?: 'beginner' | 'intermediate' | 'advanced';
  supports_competitive?: boolean;
  SNS_handle_instagram?: string;
  SNS_handle_X?: string;
  SNS_handle_youtube?: string;
  SNS_handle_facebook?: string;
  SNS_handle_tiktok?: string;
};

export type CoachLocationPayload = {
  coach_id: string;
  location_id: string;
  notes?: string;
};

export type CoachSignupFormData = {
  // Step 1: Basic
  coachname: string;
  coachname_kana: string;
  email: string;
  phone_number: string;
  birthday: string;
  Sex: 'male' | 'female' | 'other' | '';
  line_user_id: string;

  // Step 2: Career
  golf_exp: number;
  hourly_rate: number;
  certification: string;
  Lesson_rank: 'high' | 'low' | '';
  bio: string;
  supports_competitive: boolean;

  // Step 3: Social
  profile_picture?: File;
  profile_picture_url?: string;
  SNS_handle_instagram: string;
  SNS_handle_X: string;
  SNS_handle_youtube: string;
  SNS_handle_facebook: string;
  SNS_handle_tiktok: string;

  // Step 4: Location
  location_id: string;
  coach_locations: Array<{
    location_id: string;
    notes: string;
  }>;
  online_support: boolean;
};

export type Location = {
  id: string;
  name: string;
  prefecture: string;
  city: string;
};