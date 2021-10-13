import express from "express";
import cors from "cors";

import router from "./routes/posts.js";

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/posts", router);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
