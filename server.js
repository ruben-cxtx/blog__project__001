import express from "express";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "node:url";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT ?? 3000;
const app = express();

let posts = new Map();

app.use(helmet());
app.use(urlencoded({ extended: true, limit: "10kb"}));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({windowsMs: 15 * 60 * 1000, max: 100}));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index", {posts: [...posts.values()] });
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/form", (req, res) => {
    res.render("form")
})


app.post("/submit", (req, res) => {
    const { title, text } = req.body;
    const id = uuidv4();
    posts.push({ id, title, text });
    res.redirect("/");
})

app.use((req, res) => res.status(404).render("404"));

app.use((err, req, res, _next) => {
    console.log(err);
    res.status(404).render("error", { message: err.message ?? "Bad Request" });
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})
