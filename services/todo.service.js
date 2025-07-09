import Todo from '../models/todo.model.js';


export async function createTodo(todoData) {
    const todo = new Todo(todoData);
    return await todo.save();
}

export async function getChildTodos({ parentId, userId }) {
    // Only return child todos for the authenticated user and the given parent
    return await Todo.find({ parent: parentId, user: userId }).sort({ createdAt: -1 });
}

export async function getTodosByUser(userId, parentId = null) {
    return await Todo.find({ user: userId, parent: parentId }).sort({ createdAt: -1 });
}


export async function updateTodo(todoId, updateData) {
    return await Todo.findByIdAndUpdate(todoId, updateData, { new: true });
}

export async function deleteTodo(todoId) {
    // Optionally: delete subtasks recursively
    await Todo.deleteMany({ parent: todoId });
    await Todo.findByIdAndDelete(todoId);
}

export async function getPaginatedTodos({ userId, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
        Todo.find({ user: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Todo.countDocuments({ user: userId })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        totalPages,
        totalTodos: total,
        todos
    };
}

export const markTodoAsDone = async (todoId) => {
  await Todo.findByIdAndUpdate(todoId, { status: 'done' });
};