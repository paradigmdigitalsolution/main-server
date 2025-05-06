import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true, match: /^[0-9]{10,15}$/ },
  message: { type: String },
  websiteName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },

  // 🔁 Make readBy accept numbers (userId from Prisma)
  readBy: [{ type: Number }],
});

const FormModel = mongoose.model("FormSubmission", FormSchema);

export default FormModel;

