/**
 * Hand-written types matching supabase/migrations/*.sql.
 * Once a real Supabase project is connected, this can be regenerated with:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type QuestionType = "vocabulary" | "grammar" | "reading" | "listening";
export type TestSessionStatus = "in_progress" | "completed" | "expired";

export interface QuestionOptionJson {
  id: string;
  label: string;
}

export interface SectionScoreJson {
  section: QuestionType;
  correct: number;
  total: number;
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      reading_passages: {
        Row: {
          id: string;
          title: string;
          body: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reading_passages"]["Insert"]>;
        Relationships: [];
      };
      listening_audios: {
        Row: {
          id: string;
          title: string;
          audio_url: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          audio_url: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listening_audios"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          type: QuestionType;
          prompt: string;
          options: QuestionOptionJson[];
          correct_option_id: string;
          order_index: number;
          passage_id: string | null;
          audio_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: QuestionType;
          prompt: string;
          options: QuestionOptionJson[];
          correct_option_id: string;
          order_index?: number;
          passage_id?: string | null;
          audio_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      test_sessions: {
        Row: {
          id: string;
          status: TestSessionStatus;
          current_question_index: number;
          answers: Record<string, string>;
          listening_plays: Record<string, number>;
          started_at: string;
          finished_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          status?: TestSessionStatus;
          current_question_index?: number;
          answers?: Record<string, string>;
          listening_plays?: Record<string, number>;
          started_at?: string;
          finished_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["test_sessions"]["Insert"]>;
        Relationships: [];
      };
      test_results: {
        Row: {
          id: string;
          session_id: string;
          overall_score: number;
          total_questions: number;
          cefr_level: string;
          recommended_course: string;
          section_scores: SectionScoreJson[];
          started_at: string;
          finished_at: string;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          overall_score: number;
          total_questions?: number;
          cefr_level: string;
          recommended_course: string;
          section_scores: SectionScoreJson[];
          started_at: string;
          finished_at: string;
          duration_seconds: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["test_results"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
