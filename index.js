import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import path from "path";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "post123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    res.render("index", {
      listTitle: "Today",
      listItems: result.rows,
    });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error fetching items from database");
  }
});

app.post("/add", async (req, res) => {
  const newItem = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    res.redirect("/");
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error adding item to database");
  }
});

app.post("/edit", async (req, res) => {
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId]);
    res.redirect("/");
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error updating item in database");
  }
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [deleteItemId]);
    res.redirect("/");
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error deleting item from database");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
