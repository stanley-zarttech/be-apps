const express = require("express");
const fs =require('fs');

const app = express();

const bodyParse = require("body-parser");

app.use(express.json());

const port = process.env.PORT || 3500;

/**
 * {
 * id: string,
 * title: string
 * autthor: string
 * Date: Date
 * status: Pending|In-Progress|Completed
 * }
 */

const todos = [];

app.get("/", (req, res) => {
  const todos= fs.readFileSync('todo.txt','utf-8')
  res.send(todos);
});

app.get('/:id',(req,res)=>{
  const id = req.params.id;
  console.log('todo id: ',id);
  const todo = todos.find(todo =>todo.id ==id);
  const parsed =JSON.parse(todo)
  if(parsed)
 return res.json({toods:parsed,message:'your todo list'})

return res.send({message:'No todo with the specified id'})
})
app.post("/create-todo", (req, res) => {
  const data = req.body;
  console.log("data: ", data);
  const id = Date.now();
  const todo = { ...data, id } ;
  // todos.push(todo);

  fs.writeFileSync('todo.txt',JSON.stringify(todo.toString(),null,2))
  res.send(todo);
});

app.put("/:id", (req, res) => {
  const id = req.params.id;
  console.log("id: ", id);
  const body = req.body;
  const todo = todos.find((todo) => todo.id == id);
  console.log("found: ", todo);
  const todoIndex = todos.findIndex((todo) => todo.id == id);
  if (body.title) {
    todo.title = body.title;
  }
  if (body.author) {
    todo.author = body.author;
  }
  if (body.status) {
    todo.status = body.status;
  }
  if (body.date) {
    todo.date = body.date;
  }

  todos[todoIndex] = todo;

  res.send(todos[todoIndex]);
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id == id);
  if(todoIndex <1) return res.end('No todo with the specified id')
  const deleted = todos.splice(todoIndex,1);
console.log('deleted: ',deleted)
  if (deleted.length) {
    console.log('todos left: ',todos)
    return res.json({
      message: "Todo with the id: " + id + " is deleted successfully",
    });
  }
  return res.json({
    message: "Sorry we could not delete the todo at the moment. Try again",
  });
});

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.listen(port, () => {
  console.log("App is running with nodemon on port: ", port);
});

// Request types
// get --- request a resource from the serve
// post -- used to create a new resource in the server
// put -- to update resource in the source
// patch -- to partially update a resource
// delete --- to delete a resource from the server
// options
// header
