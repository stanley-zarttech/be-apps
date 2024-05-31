const express = require("express");
const { StatusCodes } = require("http-status-codes");
const app = express();

const bodyParser = require("body-parser");

app.use(express.json());

const users = [
  {
    username: "admin@bms.com",
    password: "@admin,123#",
    userType: "admin",
    dateCreated: new Date(),
    id: Date.now(),
  },
];
const books = []; //{name:String, author:String,pages:Number,yearPublished:number}
const requests = [];

const authorizeAdmin = (req, res) => {
  const userType = req.headers?.usertype;
  console.log("user type: ", userType);
  if (!userType || userType.toLowerCase() !== "admin") {
    return res.json({
      message: "UnAuthorized",
      code: StatusCodes.UNAUTHORIZED,
      data: null,
    });
  }
  // next
};
const authorize = (req, res, next) => {
  const userType = req.headers.usertype;
  if (!userType) {
    return res.json({
      message: "UnAuthorized",
      code: StatusCodes.UNAUTHORIZED,
      data: null,
    });
  }
};

app.get("/users/get-all-users", (req, res) => {
  // console.log('header: ',req.headers)
  authorizeAdmin(req, res);
  res.json(users);
});

app.get("/users/get-user/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      message: "User id is required to get a user",
      code: StatusCodes.BAD_REQUEST,
    });
  }

  const user = users.find((user) => user.id == id);
  if (!user) {
    return res.json({
      message: "User not found!",
      code: StatusCodes.NOT_FOUND,
    });
  }
  return res.json(user);
});

app.post("/books/create", (req, res, next) => {
  authorizeAdmin(req, res, next);
  let book = req.body;
  console.log("book: ", book);

  if (!book?.name || !book?.author || !book?.pages || !book?.yearPublished) {
    return res.json({
      message: "one or more fieds is missing",
      code: StatusCodes.BAD_REQUEST,
      data: null,
    });
  }
  book = { ...book, id: Date.now() };
  books.push(book);
  return res
    .status(StatusCodes.CREATED)
    .json({ data: book, message: "successful", code: StatusCodes.CREATED });
});

app.get("/books/get-all-books", (req, res, next) => {
  authorize(req, res, next);
  return res
    .status(StatusCodes.OK)
    .json({ data: books, message: "successful", code: StatusCodes.OK });
});
app.get("/books/get-book/:id", (req, res, next) => {
  authorize(req, res, next);
  const id = req.params.id;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "id is required to get a book by id",
        data: null,
        code: StatusCodes.BAD_REQUEST,
      });
  }
  const book = books.find((book) => book.id == id);
  if (!book)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({
        message: "book not found!",
        data: null,
        code: StatusCodes.NOT_FOUND,
      });
  return res
    .status(StatusCodes.OK)
    .json({ message: "successful", data: book, code: StatusCodes.OK });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("app is running on : ", port);
});
