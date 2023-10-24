const express = require("express")
const cors = require("cors")
const openaiRouter = require("./routes/openai")
const PORT=process.env.PORT;
const app = express()
app.use(express.json())
app.use(cors());


app.use("/openai",openaiRouter)
app.get("/", (req, res) => {
    res.send("Welcome To Custom Content Generater")
})

app.listen(PORT, () => {
    try {
        console.log("Server Is Online")
    } catch (error) {
        console.log(error)
    }
})