import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    deadline: { type: Date },
    estimateTime: { type: Number },
    tags: [{ type: String }],       // Array of tags for filtering/searching
    category: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Todo', default: null },
    subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kanbanStatus: { type: String, enum: ['todo', 'pending', 'done'], default: 'todo' }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
