export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  _id: string;
  title: string;
  description?: string;
  musclesTargeted: string[];
  equipmentNeeded: string[];
  difficultyLevel: DifficultyLevel;
  videoBlobName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExerciseRequest {
  title: string;
  description?: string;
  musclesTargeted: string[];
  equipmentNeeded?: string[];
  difficultyLevel?: DifficultyLevel;
  videoBlobName: string;
}

export interface UpdateExerciseRequest {
  title?: string;
  description?: string;
  musclesTargeted?: string[];
  equipmentNeeded?: string[];
  difficultyLevel?: DifficultyLevel;
  videoBlobName?: string;
}