import { sendError } from '../utils/response.js';

export default (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    sendError(res, statusCode, message, errors);
}