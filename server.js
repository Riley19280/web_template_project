require('dotenv').config()

const fs = require('fs-extra')
let http = require('http');
let https = require('https');

const path = require('path')

// Check for .env file
// if(!fs.readdirSync('.').includes('.env')) {
//     console.error(`.env file not found`)
//     return
// }

const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

const database = require('./database')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ limits: { fileSize: 3 * 1024 * 1024 },} ));

app.use("/assets", express.static(`${__dirname}/assets`));
app.use("/public", express.static(`${__dirname}/public`));

app.listen(process.env.PORT, () => {
    console.log(`[${(new Date()).toISOString()}] Application running on port ${process.env.PORT}`)
})

fs.readdirSync('./public/root/').forEach(function (file) {
    if (file[0] === '.') return
    app.get(`/${file}`, (req, res) => res.sendFile(`./public/root/${file}`, {root: '.'}));
})

console.log(`[${(new Date()).toISOString()}] Registering path /`)
app.get('/', (req, res) => {
    res.render('index', {})
})


register_ejs_paths('./views')

function register_ejs_paths(dir) {
    let path_blacklst = ['index.ejs', 'sections']
    fs.readdirSync(dir).forEach(function (file) {
        if (file[0] === '.') return
        if (path_blacklst.includes(file)) return

        let file_path = path.join(dir, file)

        if(fs.lstatSync(file_path).isDirectory()) {
            register_ejs_paths(file_path)
            return
        }

        if(file.indexOf('.ejs') === -1) return

        // let name  = file.replace('.ejs', '')

        let p = file_path.replace('views', '').replace('.ejs', '')

        console.log(`[${(new Date()).toISOString()}] Registering path ${p}`)
        app.get(p, (req, res) => res.render('index', {}) );
    })
}
