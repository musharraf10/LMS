import mongoose from "mongoose";

const borrowingRecordSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null, // Null until the book is returned
    },
    isReturned: {
      type: Boolean,
      default: false,
      required: true,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BorrowingRecord = mongoose.model(
  "BorrowingRecord",
  borrowingRecordSchema
);

export default BorrowingRecord;
