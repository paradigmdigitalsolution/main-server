import mongoose from "mongoose";

const bookRequestSchema = new mongoose.Schema({
  bookType: { type: String, required: true },
  pageCount: { type: String, required: true },
  coverType: { type: String, required: true },
  designPreference: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true },
  additionalInfo: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

export const BookRequest = mongoose.model("BookRequest", bookRequestSchema);
