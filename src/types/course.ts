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
}
