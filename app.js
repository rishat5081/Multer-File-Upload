const express = require('express'),
    app = express(),
    multer = require('multer'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('file-system'),
    fss = require('fs'),
    bcrypt = require('bcrypt')

var port = process.env.PORT || 1111

app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('./public'))


const upload_it = multer({
    storage: multer.diskStorage({
        destination: './public/pic/',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 3000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).any()


function checkFileType(file, cb) {

    const types = /jpeg|jpg|png|gif/
    const extnames = types.test(path.extname(file.originalname).toLowerCase())
    const mimetype = types.test(file.mimetype)
    console.log(extnames, mimetype);

    if (extnames && mimetype)
        return cb(null, true)
    else
        cb('Wrong File Type')
}


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/picUpload', (req, res) => {
    upload_it(req, res, (error) => {
        if (error)
            res.render('index', {
                message: error
            })
        else {
            console.log(req.files)
            fss.renameSync(req.files[0].path, req.files[0].destination + req.body.user + path.extname(req.files[0].originalname))
            console.log(req.body.user + path.extname(req.files[0].originalname))
            res.status(200).render('uploaded', {
                file: req.body.user + path.extname(req.files[0].originalname)
            })
        }
    })
})

app.listen(port, (req, res) => {
    console.log('Server Started at port' + port)
})