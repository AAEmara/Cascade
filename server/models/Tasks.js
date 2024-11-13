import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const taskSchema = Schema({
  objectiveId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  taskRubric: [{
    requirementTitle: {
      type:String,
      required: true
    },
    requirementDescription: {
      type: String,
      required: false
    },
    requirementWeight: {
      type: mongoose.Decimal128,
      required: true
    },
    default: []
  }],
  status: {
    type: String,
    enum: ['TO_DO', 'IN_PROGRESS', 'DONE', 'CANCELED', 'DRAFTED', 'ON_HOLD'],
    required: true,
    default: 'DRAFTED'
  },
  startDate: {
    type: Date,
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  },
  ownerRoleId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  assignedRolesIds: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  priority: {
    type: String,
    enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'],
    default: 'MEDIUM'
  },
  recentComments: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  commentsCount: {
    type: Number,
    required: true,
    default: 0
  },
  feedbacks: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  taskResources: [{
    type: String,
    required: false,
    default: []
  }],
  taskOutputs: [{
    type: String,
    required: false,
    default: []
  }]
}, { timestamps: true });

const Task = model('Task', taskSchema);

export default Task;
