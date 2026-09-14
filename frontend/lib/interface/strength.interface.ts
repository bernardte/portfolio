import { ProfileInformationResponse } from "./profile.interface";

interface Strengths {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export type CreateStrengths = Strengths & {
  fileId?: string | null,
}

export type UpdateStrengths = Partial<CreateStrengths>;

export interface StrengthsResponse extends Strengths {
  id: string;
  profileId: ProfileInformationResponse["id"];
  createdAt: Date;
  updatedAt: Date;
}
