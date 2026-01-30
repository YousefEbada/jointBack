export class HttpError extends Error {
  public statusCode: number; // For compatibility with ApiResponse error handling
  
  constructor(public status: number, message: string) {
    super(message);
    this.statusCode = status; // Set both status and statusCode for compatibility
    this.name = 'HttpError';
  }
}
