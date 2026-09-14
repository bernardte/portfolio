import { User } from "./user.interface";

export interface ProfileInformationRequest {
  highestEducationLevel: string;
  location: string;
  linkedinLink: string;
  githubLink: string;
  bio: string;
}

export interface ProfileInformationResponse extends ProfileInformationRequest {
  id: string;
  avatarUrl: string | null;
  hasResume: boolean; 
  user: User | null;
  slug: string | null;
  resumeFileName: string | null;
  resumeFileSize: number | null;
  resumeUpdatedAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

export type updateProfileInformationRequest = Partial<ProfileInformationRequest>;

export type profileCompletionSummary = {
  completionPercentage: number;
  projectsCount: number;
  skillsCount: number;
  strengthsCount: number;
};