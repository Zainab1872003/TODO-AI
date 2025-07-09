const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for a single message within a conversation.
 * This will be an array of sub-documents in the Conversation model.
 */
const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'model'], // 'user' is the human, 'model' is the AI
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // You can store the URL of a generated image here.
    imageUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Each message gets its own timestamp.
});

const ConversationSchema = new Schema({
    // A reference to the user who this conversation belongs to.
    // `unique: true` ensures one user can only have one conversation document.
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // An array of messages, using the schema defined above.
    messages: [MessageSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);