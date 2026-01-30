import { Response } from 'express';

export type ApiResponseData<T> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp: string;
    traceId?: string;
};

export class ApiResponse {
    static success<T>(
        res: Response,
        data?: T,
        message: string = 'Success',
        statusCode: number = 200
    ): void {
        const response: ApiResponseData<T> = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
            traceId: (res.req as any).traceId
        };
        
        res.status(statusCode).json(response);
    }

    static error(
        res: Response,
        error: any,
        statusCode?: number
    ): void {
        // Handle different error types
        let message = 'Internal server error';
        let code = statusCode || 500;

        if (error && typeof error === 'object') {
            if (error.statusCode) {
                code = error.statusCode;
            }
            if (error.message) {
                message = error.message;
            }
            if (error.name === 'ZodError') {
                message = 'Validation error';
                code = 400;
            }
            if (error.name === 'ValidationError') {
                message = 'Validation error';
                code = 400;
            }
        } else if (typeof error === 'string') {
            message = error;
        }

        const response: ApiResponseData<null> = {
            success: false,
            error: message,
            timestamp: new Date().toISOString(),
            traceId: (res.req as any).traceId
        };

        // Log error for debugging (you might want to use your logger here)
        console.error('API Error:', {
            message,
            code,
            error: error instanceof Error ? error.stack : error,
            traceId: (res.req as any).traceId
        });

        res.status(code).json(response);
    }

    static paginated<T>(
        res: Response,
        data: T[],
        totalCount: number,
        page: number,
        limit: number,
        message: string = 'Success'
    ): void {
        const totalPages = Math.ceil(totalCount / limit);
        const hasMore = page < totalPages;

        const response = {
            success: true,
            message,
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasMore,
                hasPrev: page > 1
            },
            timestamp: new Date().toISOString(),
            traceId: (res.req as any).traceId
        };

        res.json(response);
    }
}
