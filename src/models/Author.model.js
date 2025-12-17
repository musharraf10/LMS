import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
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
      trim: true,
      type: String,
    },
    authorId: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 1000000000 && v <= 9999999999;
        },
        message: (props) => `${props.value} is not a valid 10-digit Author ID!`,
      },
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

const Author = mongoose.model("Author", authorSchema);
export default Author;
