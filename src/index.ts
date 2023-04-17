import express from 'express'

const app  = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/samurais', (req, res) => {
    const a = 4;
    if (a > 5) {
        res.send('OK!')
    } else {
        res.send('Hello samurais, Max!!')
    }

})

app.post('/samurais', (req, res) => {
    res.send('We have created samurai')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})