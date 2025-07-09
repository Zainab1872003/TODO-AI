import Joi from 'joi';

export const todoValidationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    deadline: Joi.date().optional(),
    estimateTime: Joi.number().positive().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().optional(),
    nature: Joi.string().optional(),
    parent: Joi.string().optional(),
    kanbanStatus: Joi.string().valid('todo', 'in_progress', 'done').default('todo')
});


export function validateTodo(req, res, next) {
    const { error } = todoValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const err = new Error('Validation failed');
        err.statusCode = 400;
        err.errors = error.details.map(d => d.message);
        return next(err);
    }
    next();
}