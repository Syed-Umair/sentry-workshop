const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, './dist')));


app.listen(3001, () => console.log('Server listening on port 3001'));
