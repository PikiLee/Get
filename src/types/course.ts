import { Chapter } from './chapter';

type Status = 0 | 1 | 2;

export interface NewCourse {
  name: string;
  status: Status;
  chapters?: Chapter[];
}

export interface Course extends NewCourse {
  id: string;
  createdAt: Date;
  coverId: number;
}

export interface CourseFieldsToChange {
  status?: number;
  name?: string;
  coverId?: number;
}
