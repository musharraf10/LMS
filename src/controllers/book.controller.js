import Book from "../models/Book.model.js";
import Author from "../models/Author.model.js";
import User from "../models/User.model.js";
import BorrowingRecord from "../models/borrowingRecord.model.js";

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

export const borrowBook = async (req, res) => {
  const { isbn, dueDate } = req.body;
  const userId = req.userId;

  if (!isbn || !dueDate || !userId) {
    return res.status(400).json({
      message: "ISBN, due date, or user authentication missing",
    });
  }

  try {
    // Find book
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        message: "Book is currently out of stock",
      });
    }
    // Checking exsting Barrow
    const existingBorrow = await BorrowingRecord.findOne({
      book: book._id,
      member: userId,
      isReturned: false,
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "You have already borrowed this book and not returned it yet",
      });
    }

    // Create borrowing record
    const borrowingRecord = await BorrowingRecord.create({
      book: book._id,
      member: userId,
      dueDate,
    });

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Update user borrowed books
    await User.findByIdAndUpdate(userId, {
      $push: { borrowedBooks: borrowingRecord._id },
    });

    return res.status(200).json({
      message: "Book borrowed successfully",
      borrowingRecord,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while borrowing book",
      error: error.message,
    });
  }
};

export const returnBook = async (req, res) => {
  const { borrowingRecordId } = req.body;
  const userId = req.userId;

  if (!borrowingRecordId || !userId) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    // Find borrowing record
    const record = await BorrowingRecord.findOne({
      _id: borrowingRecordId,
      member: userId,
      isReturned: false,
    }).populate("book");

    if (!record) {
      return res.status(404).json({
        message: "Active borrowing record not found",
      });
    }

    // Fine calculation
    const today = new Date();
    let fine = 0;

    if (today > record.dueDate) {
      const diffTime = today - record.dueDate;
      const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = lateDays * 10; // ₹10 per day
    }

    // Update borrowing record
    record.isReturned = true;
    record.returnDate = today;
    record.fineAmount = fine;
    await record.save();

    // Increase book availability
    record.book.availableCopies += 1;
    await record.book.save();

    return res.status(200).json({
      message: "Book returned successfully",
      fineAmount: fine,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while returning book",
      error: error.message,
    });
  }
};
