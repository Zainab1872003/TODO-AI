
export function sendSuccess(res, statusCode, message, data = null) {
    res.status(statusCode).json({
        success: true,
        result: {
            message,
        },
        data
    });
}

export function sendError(res, statusCode, message, errors = []) {
    res.status(statusCode).json({
        success: false,
        result: {
            message,
            errors
        },
        data: null
    });
}