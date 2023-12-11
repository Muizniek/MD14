const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "par212121",
  database: "userlist",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/create", (req, res) => {
  const { name, age, country, hobby, image } = req.body;

  db.execute(
    "INSERT INTO users (name, age, country, hobby, image) VALUES (?, ?, ?, ?, ?)",
    [name, age, country, hobby, image],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send("User Created");
      }
    }
  );
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(result);
    }
  });
});

app.put("/update/:id", (req, res) => {
  const { name, age, country, hobby, image } = req.body;
  const userId = req.params.id;

  db.execute(
    "UPDATE users SET name = ?, age = ?, country = ?, hobby = ?, image = ? WHERE id = ?",
    [name, age, country, hobby, image, userId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send("User Updated");
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const userId = req.params.id;

  db.execute("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send("User Deleted");
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
