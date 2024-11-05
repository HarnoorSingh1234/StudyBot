import mongoose from 'mongoose';
import Counter from './counter.model.js';

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true }, // Incrementing userId
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Pre-save hook to set the userId
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Find the counter document and increment it by 1
      const counter = await Counter.findOneAndUpdate(
        { name: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create if not exists
      );

      this.userId = counter.seq; // Set userId to the updated sequence value
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);
export default User;
