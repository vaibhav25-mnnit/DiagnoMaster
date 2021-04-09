const express = require('express')
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs')

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.render('home')
})

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})