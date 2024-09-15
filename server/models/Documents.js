import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  attachment: {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    version: { type: Number, required: true, default: 1 }
    },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
  });

const Document = mongoose.model('Document', documentSchema);
export default Document;
