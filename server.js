require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const commentRoutes = require("./routes/comments/comment");
const postRoutes = require("./routes/posts/posts");
const userRoutes = require("./routes/users/users");
const app = express();

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

app.use(session({
    secret: "djsnfsf",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl: 24 * 60 * 60 * 60
    }),
}))
app.use(globalErrorHandler)
require("./config/dbConnect");

// parse the incoming data
app.use(express.json())

//middlewares
//-------
//users route
// app.use("/api/v1/", HomeRoutes)
app.use("/api/v1/users", userRoutes);
//posts route
app.use("/api/v1/posts", postRoutes);
//comments
app.use("/api/v1/comments", commentRoutes);

//Error handler middlewares
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Servver is running on PORT ${PORT}`));
