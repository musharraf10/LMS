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
    validate: {
      validator: function (value) {
        const year = value.getFullYear();
        return year > 1400 && year < 2100;
      },
      message: "Please enter a realistic publication date.",
    },
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

const Book = mongoose.model("Book", bookSchema);
export default Book;
