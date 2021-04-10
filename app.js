const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser');
const { json } = require('body-parser');

require('dotenv').config()

const app = express();



app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.set('view engine', 'ejs')

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.render('home')
})


app.get('/dashboard', (req, res) => {

    res.render('dashboard')

})


app.get('/diagnose', (req, res) => {
    res.render('diagnose')
})

app.post('/diagnose', async (req, res) => {

    const temp_ID = req.body.IDs.split(',');
    let int_ID = [];
    for (let index = 0; index < temp_ID.length; index++) {
        int_ID.push(parseInt(temp_ID[index]));
    }
    const final_ID = JSON.stringify(int_ID)
    const fetch_URL = `https://healthservice.priaid.ch/diagnosis?symptoms=${final_ID}&gender=${req.body.gender}&year_of_birth=${req.body.Age}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZiOTgyMjQ0NTkzN0BnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjYyNjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIxMDkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiMTAwIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiQmFzaWMiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xhbmd1YWdlIjoiZW4tZ2IiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIyMDk5LTEyLTMxIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwc3RhcnQiOiIyMDIxLTA0LTA5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNjE4MDU2MzAxLCJuYmYiOjE2MTgwNDkxMDF9.91DjnffKLuglEYwB_VulR1g-1OZSGxI4-nx7eyZPU34&format=json&language=en-gb`
    const response = await fetch(fetch_URL);
    const data = await response.json();
    res.json(data);

})




app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})