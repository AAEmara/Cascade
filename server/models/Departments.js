import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  roles: [{
    type: Schema.Types.ObjectId,
    required: true,
    default: []
  }]
}, { timestamps: true });

const Department = model('Department', departmentSchema);

export default Department;
