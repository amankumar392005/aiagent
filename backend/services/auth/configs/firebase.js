import { initializeApp, cert } from "firebase-admin/app";
import { createRequire } from "module";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production: load from environment variable (JSON string)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development: load from file
  const require = createRequire(import.meta.url);
  serviceAccount = require("../serviceAccountKey.json");
}

export const app = initializeApp({
  credential: cert(serviceAccount),
});