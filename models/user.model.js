
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const HabitAnalysisSchema = new Schema({
    summary: {
        type: String,
        default: "No analysis performed yet. Complete some tasks to see your habits!"
    },
    strengths: [String],
    areasForImprovement: [String],
    interestingObservations: [String],
    categoryBreakdown: [{
        category: String,
        total: Number,
        completed: Number,
        completionRate: Number,
    }],
    lastUpdated: { type: Date }
}, { _id: false });

const UserSchema = new Schema({
    // You can expand this with more fields like name, etc.
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    refreshTokens: [{ type: String }],
    // Store a hashed password, not the plain text password.
    password: {
        type: String,
        required: true
    },
    // Embed the habit analysis directly into the user's document.
    habitAnalysis: {
        type: HabitAnalysisSchema,
        default: () => ({}) // Ensures the default values are set on creation
    }
}, {
    // Automatically add `createdAt` and `updatedAt` timestamps.
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const hashed = await bcrypt.hash(this.password, 10);
            this.password = hashed;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
