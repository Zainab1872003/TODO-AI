const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sender: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  imageUrl: { type: String }, // for image messages
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });



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