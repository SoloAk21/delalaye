// encrypt.js
const bcrypt = require("bcrypt");

const password = process.argv[2]; // Get password from command line
const saltRounds = 10;

if (!password) {
  console.log("⚠️ Please provide a password: node encrypt.js yourPassword");
  process.exit(1);
}

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("❌ Error:", err);
  } else {
    console.log("🔐 Encrypted password:\n", hash);
  }
});
