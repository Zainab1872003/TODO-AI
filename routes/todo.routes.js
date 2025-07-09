import { Router } from 'express';
import {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} from '../controllers/todo.controller.js';
import { validateTodo } from '../validators/todo.validator.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, validateTodo, createTodo);
router.get('/', authenticateToken, getTodos);
router.get('/paginated', authenticateToken, getPaginatedTodos); 
router.put('/:id', authenticateToken, validateTodo, updateTodo);
router.delete('/:id', authenticateToken, deleteTodo);
// router.get('/parent/:parentId/children', authenticateToken, getChildTodos);

export default router;