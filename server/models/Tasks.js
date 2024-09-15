import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskTitle: { type: String, required: true },
  taskDescription: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  taskResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  taskContributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }],
  taskRequirements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement'
    }],
  taskOutput: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
    }],
  taskPriority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  });

const Task = mongoose.model('Task', taskSchema);
export default Task;
