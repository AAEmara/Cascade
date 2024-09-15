import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  requirementName: { type: String, required: true },
  requirementDescription: { type: String, required: true },
  weight: { type: Number, required: true }
  });

const Requirement = mongoose.model('Requirement', requirementSchema);
export default Requirement;
