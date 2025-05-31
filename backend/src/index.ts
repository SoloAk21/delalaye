import express, { Request, Response } from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandlers";
import cors from "cors";

dotenv.config();
import authRoute from "./routes/auth";
import usersRoute from "./routes/user";
import adminRoutes from "./routes/admin";
import brokerRoute from "./routes/broker";
import brandingRoute from "./routes/branding";
import paymentRoutes from "./routes/payment";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/broker", brokerRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/branding", brandingRoute);
app.use("/api/payment", paymentRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
