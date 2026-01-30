export interface ExerciseRepoPort {
  create(data: {title: string | any, description: string | any, videoBlobName: string | any}): any;
  find(id: string): any;
  getAll(): any;
  delete(id: string): any;
}