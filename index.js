const express = require('express');
const app = express();
const path = require('node:path');
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'api.html'));
});
app.get('/commands', (req, res) => {
    res.sendFile(path.join(__dirname, 'commands.html'));
});

app.listen(port, () => {
    console.log(`essentialskt-site listening on port ${port}`);
})