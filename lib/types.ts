export type UserRole = "coach" | "admin";
export type AthleteStatus = "active" | "injured" | "resting";
export type SessionType = "strength" | "cardio" | "technical" | "recovery";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface ITeam {
  _id: string;
  name: string;
  sport: string;
  coach: string | IUser;
  athletes: string[] | IAthlete[];
  createdAt: string;
}

export interface IAthlete {
  _id: string;
  name: string;
  sport: string;
  status: AthleteStatus;
  team?: string | ITeam;
  coach: string | IUser;
  dateOfBirth?: string;
  sessions?: ISession[];
  createdAt: string;
}

export interface ISession {
  _id: string;
  athlete: string | IAthlete;
  title: string;
  type: SessionType;
  duration: number;
  intensity: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
