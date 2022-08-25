const express = require('express');
const app = express();

app.listen(3031, () => {
    console.log('Server Oppend On Port 3031');
});

app.get('/pet', (req, res) => {
    res.send('펫 용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', (req, res) => {
    res.send('화장품을 쇼핑할 수 있는 페이지입니다.');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});