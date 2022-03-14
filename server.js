const express = require('express');
const cors = require('cors')
const app = express();
const port = 5000;
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
app.use(express.json());

app.post('/signup',(req,res)=>{
    console.log(req.body);
    res.send(true)
});

app.post('/login',(req,res)=>{
    console.log(req.body);
    res.send(true)
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 