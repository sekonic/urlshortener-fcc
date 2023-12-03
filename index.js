require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;
const URI = process.env.URI;

// DB Connection
mongoose
  .connect(URI)
  .then(() => console.log('Base de Datos Conectada'))
  .catch((err) => console.log(err));

// Impor Model
const ShortUrl = require('./models/shorturl');

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

// Url validator function
function httpUrlValidator(url) {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol.includes('http');
  } catch (err) {
    return false;
  }
}

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', async (req, res) => {
  let { id } = req.params;
  let data = await ShortUrl.find({ id: id });
  if (data.length === 0) {
    res.status(404).send(JSON.stringify({ error: 'NOT FOUND' }));
  } else {
    res.redirect(data[0].url);
  }
});

app.post('/api/shorturl', async (req, res) => {
  let { url } = await req.body;

  // Check valid url
  let validate = httpUrlValidator(url);
  if (!validate) {
    response = { error: 'Invalid URL' };
  } else {
    // Verificar si está en la base de datos
    try {
      let data = await ShortUrl.find({ url: url });
      if (data.length === 0) {
        let count = await ShortUrl.countDocuments();
        count++;
        let newShortUrl = {
          id: count,
          url: url,
        };
        let result = await ShortUrl.create(newShortUrl);
        console.log(result);
        response = {
          original_url: url,
          short_url: count,
        };
      } else {
        response = {
          original_url: data[0].url,
          short_url: data[0].id,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).send(JSON.stringify(response));
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
