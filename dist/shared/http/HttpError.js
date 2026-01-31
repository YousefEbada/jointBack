export class HttpError extends Error {
    status;
    statusCode; // For compatibility with ApiResponse error handling
    constructor(status, message) {
        super(message);
        this.status = status;
        this.statusCode = status; // Set both status and statusCode for compatibility
        this.name = 'HttpError';
    }
}
