import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const roleSchema = new Schema({
  departmentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Department'
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  hierarchyLevel: {
    type: String,
    enum: ['COMPANY_ADMIN', 'TOP_LEVEL_MANAGER', 'MANAGER', 'EMPLOYEE'],
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  supervisedBy: [{
    type: Schema.Types.ObjectId,
    required: false,
    default: [],
    role: 'Role'
  }],
  supervises: [{
    type: Schema.Types.ObjectId,
    required: false,
    default: [],
    ref: 'Role'
  }],
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission'
  }]
});

const Role = model('Role', roleSchema);

export default Role;
