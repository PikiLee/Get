type Stage = 0 | 1 | 2 | 3 | 4;

export interface NewChapter {
  name: string;
  stage: Stage;
  lastDate: number;
}

export interface Chapter extends NewChapter {
  id: string;
  createdAt: Date;
  order: number;
}
