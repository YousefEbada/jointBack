export class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
            traceId: res.req.traceId
        };
        res.status(statusCode).json(response);
    }
    static error(res, error, statusCode) {
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
        }
        else if (typeof error === 'string') {
            message = error;
        }
        const response = {
            success: false,
            error: message,
            timestamp: new Date().toISOString(),
            traceId: res.req.traceId
        };
        // Log error for debugging (you might want to use your logger here)
        console.error('API Error:', {
            message,
            code,
            error: error instanceof Error ? error.stack : error,
            traceId: res.req.traceId
        });
        res.status(code).json(response);
    }
    static paginated(res, data, totalCount, page, limit, message = 'Success') {
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
            traceId: res.req.traceId
        };
        res.json(response);
    }
}
