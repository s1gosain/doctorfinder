const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const controller = require('./controller.js');

app.use(bodyParser.json());

app.post('/doctors', controller.makeDr, (req,res) => res.send('done making a doctor'));

app.post('/doctors/:id/reviews', controller.makeRev, (req, res) => res.send('made review'));

app.get('/doctors', controller.getDrs);

app.get('/doctors/:id', controller.getDr);

app.get('/doctors/:id/reviews', controller.getRevs);

app.get('/doctors/:id/reviews/:rev_id', controller.getRev);

app.delete('/doctors/:id/reviews/:rev_id', controller.deleteRev, (req, res) => res.send('deleted review'));

app.delete('/doctors/:id', controller.alterReviews, controller.addCascade, controller.deleteDr, (req, res) => res.send('deleted dr'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening on ', PORT));