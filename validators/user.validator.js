import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(), // Required for registration; not for OAuth
    profilePic: Joi.string().uri().optional(),
    habits: Joi.string().optional(),
    nature: Joi.string().optional(),
    googleId: Joi.string().allow('').optional(),
    isVerified: Joi.boolean().optional(),
    refreshTokens: Joi.array().items(Joi.string()).optional()
});

export const userOAuthSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    profilePic: Joi.string().uri().optional(),
    habits: Joi.string().optional(),
    nature: Joi.string().optional(),
    googleId: Joi.string().required(), // Must have googleId or similar for OAuth
    isVerified: Joi.boolean().optional(),
    refreshTokens: Joi.array().items(Joi.string()).optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required()
});

// Express middleware for validation
export function validateUser(req, res, next) {
    const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = new Error('Validation failed');
        err.statusCode = 400;
        err.errors = error.details.map(d => d.message);
        console.log('Joi Validation Error:', err.errors);
        return next(err);
    }
    next();
}

export function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = new Error('Validation failed');
        err.statusCode = 400;
        err.errors = error.details.map(d => d.message);
        return next(err);
    }
    next();
}