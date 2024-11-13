import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const kpiSchema = Schema({
  kpiName: {
    type: String,
    required: true
  },
  kpiDescription: {
    type: String,
    required: false
  },
  target: {
    type: mongoose.Decimal128,
    required: false
  },
  actual: {
    type: mongoose.Decimal128,
    required: false
  }
});

const milestoneSchema = Schema({
  name: {
    type: String,
    required: true
  },
  target: {
    type: mongoose.Decimal128,
    required: false
  },
  actual: {
    type: mongoose.Decimal128,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  }
});

const objectiveSchema = Schema({
  name: {
    type: String,
    required: true
  },
  objectiveKPIs: [kpiSchema],
  milestones: [milestoneSchema],
  goalProgress: [{
    goalId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    progressDescription: {
      type: String,
      required: false
    },
    progressDate: {
      type: Date,
      required: true
    }
  }],
  objectiveStartDate: {
    type: Date,
    required: false
  },
  objectiveDueDate: {
    type: Date,
    required: false
  },
  ownerRoleId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  assignedRoleIds: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  accountableDepartments: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  priority: {
    type: String,
    enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'],
    required: true,
    default: 'MEDIUM'
  },
  objectiveResources: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  objectiveDocuments: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  recentComments: [{
    commentId: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    },
    updatedAt: {
      type: Date,
      required: true
    }
  }],
  feedbacks: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }]
}, { timestamps: true });

const Objective = model('Objective', objectiveSchema);

export default Objective;
