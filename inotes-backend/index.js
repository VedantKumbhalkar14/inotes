const connectToMongo = require('./db');
const express = require("express");

connectToMongo();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(PORT, "127.0.0.1", () => {
    console.log(`listening at http://localhost:${PORT}`)
})
