import mongoose from "mongoose";
import Schema from "mongoose";

const authorSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    bio: {
      type: String,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default Author = mongoose.model("Author", authorSchema);
