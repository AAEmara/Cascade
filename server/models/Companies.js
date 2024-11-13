import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const relatedDepartmentSchema = new Schema({
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  departmentName: {
    type: String,
    required: true
  }
});
const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['FREE', 'MONTHLY', 'YEARLY'],
    required: true,
    default: 'FREE'
  },
  companyDepartments: {
    type: [relatedDepartmentSchema],
    default: []
  }
}, { timestamps: true });

const Company = model('Company', companySchema);

export default Company;
