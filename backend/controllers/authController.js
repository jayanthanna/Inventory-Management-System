const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_EXPIRES_IN = "7d";

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const now = new Date().toISOString();

  db.get(
    "SELECT id FROM users WHERE email = ?",
    [normalizedEmail],
    (err, existing) => {
      if (err) return next(err);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = bcrypt.hashSync(password, 10);

      db.run(
        `INSERT INTO users (email, password_hash, created_at)
         VALUES (?, ?, ?)`,
        [normalizedEmail, passwordHash, now],
        function (err2) {
          if (err2) return next(err2);

          const user = { id: this.lastID, email: normalizedEmail };
          // Optionally issue token on register
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          res.status(201).json({ user, token });
        }
      );
    }
  );
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [normalizedEmail],
    (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        user: { id: user.id, email: user.email },
        token,
      });
    }
  );
};
