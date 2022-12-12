import dotenv from "dotenv";
dotenv.config();

const config = {
  port: Number(process.env["SERVER_PORT"]) || 3000,
  db: {
    url: process.env["DB_URL"] || "mongodb://root:SuperSecret@localhost:27017/",
  },
  auth: {
    hash_iterations: Number(process.env["HASH_ITERATIONS"]) || 10000,
    jwt_secret: process.env["JWT_SECRET"] || "SuperSecret",
    jwt_expire_in: process.env["JWT_EXPIRE"] || "60d",
  },
  firebase_cert: process.env["FIREBASE_CERT"] || "firebaseServiceAccount.json",
};

export default config;
