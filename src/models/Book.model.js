import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  isbn: {
    // International Standard Book Number
    type: String,
    unique: true,
    required: true,
  },
  publicationDate: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  totalCopies: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default Book = mongoose.model("Book", bookSchema);
