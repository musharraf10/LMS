import Author from "../models/Author.model.js";
import status from "http-status";

export const addAuthor = async (req, res) => {
  const { firstName, lastName, bio, authorId } = req.body;

  if (!firstName || !lastName || !authorId) {
    return res
      .status(status.NOT_ACCEPTABLE)
      .json({ message: "Fill all the details" });
  }

  try {
    const existingAuthor = await Author.findOne({ authorId });
    if (existingAuthor) {
      return res
        .status(status.FOUND)
        .json({ message: "Author already existing" });
    }

    const newAuthor = new Author({
      firstName,
      lastName,
      bio,
      authorId,
    });

    await newAuthor.save();

    return res
      .status(status.OK)
      .json({ message: "Author added successfully", newAuthor });
  } catch (e) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ success: false, messgae: "Error occured, check issues" });
  }
};
