type Stage = 0 | 1 | 2 | 3 | 4;

export interface Chapter {
  id: number;
  name: string;
  stage: Stage;
  lastDate: number;
}
