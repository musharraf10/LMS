import Book from "../models/Book.model.js";
import Author from "../models/Author.model.js";

export const addBook = async (req, res) => {
  const { title, isbn, publicationDate, author, totalCopies } = req.body;

  if (!title || !isbn || !author || !totalCopies || !publicationDate) {
    return res.status(404).json({ message: "Fill all the fields" });
  }
  try {
    const parsedDate = new Date(publicationDate);
    //console.log(parsedDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "The provided date is invalid." });
    }

    let checkBook = await Book.findOne({ isbn });

    if (checkBook) {
      return res.status(409).json({ message: "Book already registered" });
    }

    const newBook = new Book({
      title,
      isbn,
      author,
      publicationDate: parsedDate,
      totalCopies,
      availableCopies: totalCopies, // Initially Using same count for available.
    });

    await newBook.save();

    await Author.findByIdAndUpdate(author, {
      $push: { books: newBook._id },
    });

    res.status(201).json({ success: true, data: newBook });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
