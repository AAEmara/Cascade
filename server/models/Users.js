import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const companyRoleSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: false,
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
});

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  webAppRole: {
    type: String,
    enum: ['WEB_APP_ADMIN', 'CUSTOMER_SUPPORT', 'USER'],
    required: false,
    default: 'USER'
  },
  companyRoles: {
    type: [companyRoleSchema],
    default: []
  },
  image: {
    type: String,
    required: false,
    default: 'default_user_image.png'
  },
  refreshToken: {
    type: String
  },
  refreshTokenExpiresAt: {
    type: Date
  }
}, { timestamps: true });

const User = model('User', userSchema);

export default User;
