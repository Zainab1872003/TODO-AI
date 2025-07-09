import * as todoService from '../services/todo.service.js';
import { sendSuccess } from '../utils/response.js';

export async function createTodo(req, res, next) {
    try {
        const todo = await todoService.createTodo({ ...req.body, user: req.user.id });
        sendSuccess(res, 201, 'Todo created successfully', todo);
    } catch (err) {
        next(err);
    }
}

export async function getTodos(req, res, next) {
    try {
        const parentId = req.query.parent || null;
        const todos = await todoService.getTodosByUser(req.user.id, parentId);
        const now = new Date();
        todos = await Promise.all(todos.map(async todo => {
            if (todo.status !== 'done' && todo.deadline < now) {
                todo.status = 'pending';
                // Optionally, update in DB:
                await Todo.findByIdAndUpdate(todo._id, { status: 'pending' });
            }
            return todo;
        }));

        sendSuccess(res, 200, 'Todos fetched successfully', todos);
    } catch (err) {
        next(err);
    }
}


export async function markDone(req, res, next) {
    try {
        await todoService.markTodoAsDone(req.params.id);
        sendSuccess(res, 200, 'Todo marked as done successfully', null);
    } catch (err) {
        next(err);
    }
}


export async function updateTodo(req, res, next) {
    try {
        const updatedTodo = await todoService.updateTodo(req.params.id, req.body);
        sendSuccess(res, 200, 'Todo updated successfully', updatedTodo);
    } catch (err) {
        next(err);
    }
}

export async function deleteTodo(req, res, next) {
    try {
        await todoService.deleteTodo(req.params.id);
        sendSuccess(res, 200, 'Todo deleted successfully', null);
    } catch (err) {
        next(err);
    }
}

export async function getPaginatedTodos(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await todoService.getPaginatedTodos({
            userId: req.user.id,
            page,
            limit
        });

        sendSuccess(res, 200, 'Todos fetched successfully', result);
    } catch (err) {
        next(err);
    }
}
// export async function getChildTodos(req, res, next) {
//     try {
//         const parentId = req.params.parentId;
//         const userId = req.user.id;
//         const todos = await todoService.getChildTodos({ parentId, userId });
//         sendSuccess(res, 200, 'Child todos fetched successfully', { todos });
//     } catch (err) {
//         next(err);
//     }
// }