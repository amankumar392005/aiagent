# 💳 Billing & Payment Microservice

The **Billing Service** handles coin package purchases, Razorpay order initialization, and cryptographically verified payment signatures.

---

## 🔒 Security & Verification Flow

1. **Order Creation (`createOrder`):** Instantiates Razorpay order (`amount` in paise) and records billing document (`status: "created"`).
2. **Signature Verification (`verifyPayment`):**
   Computes HMAC SHA-256 hash using `RAZORPAY_KEY_SECRET`:
   ```javascript
   const genSign = crypto
     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
     .digest("hex");
   ```
   If signatures match, billing record is updated to `status: "paid"`.

---

## 📁 Directory Structure

```
billing/
├── configs/
│   ├── db.js                   # Mongoose connection
│   └── razorpay.js             # Razorpay SDK initialization
├── controllers/
│   └── billing.controller.js  # Create order & verify signature handlers
├── models/
│   └── billing.model.js        # Billing transaction schema
├── routes/
│   └── billing.route.js        # Express routes (/create-order, /verify-payment)
└── index.js                    # Express Server (Port 6005)
```

---

## ⚙️ Environment Configuration

```env
PORT=6005
MONGO_URI=mongodb://localhost:27017/aiagent_billing
REDIS_URL=redis://localhost:6379
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
