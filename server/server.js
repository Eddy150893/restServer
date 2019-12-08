const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }))

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
})

app.post('/usuario', function(req, res) {
    let body = req.body
    console.log(req.body);
    res.json({ body });
})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({ id });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
})
app.listen(3000, () => {
    console.log('Escuchando puerto: ', 3000)
});