const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./database/dbConfig.js");
const Users = require("./users/users.js");
const protected = require("./auth/protected-middleware.js");

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "super secret string",
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: false
  },
  resave: false,
  saveUninitialized: true
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send(
    "There are three kinds of people in this world, those who can count and those who can not."
  );
});

server.post("/api/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome Back ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/auth/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: "Error logging out." });
      } else {
        res.status(200).json({ message: "You have successfully logged out." });
      }
    });
  } else {
    res.end();
  }
});

const port = 5678;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
