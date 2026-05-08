const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: ['http://localhost:5173'],
    })
);

app.use(express.json());

// route
app.get("/", (req, res) => {
    res.send("welcome to node server.");
});

app.get("/api/hello", (req, res) => {
    res.json({message: "hello from the api"});
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});