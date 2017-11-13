var express = require('express');
var router = express.Router();
var multer = require('multer');


var path = "";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        path=req.headers.userid;
        cb(null, '../kafka-back-end/public/uploads'+'/'+path);
    },
    filename: function (req, file, cb) {
        path = file.originalname;
        cb(null, file.originalname);
    }
});

var upload = multer({storage:storage});

router.post('/file', upload.single('mypic'), function (req, res, next) {

    console.log("in upload files : " +req);
    res.status(201).json({status:'201'});

});



module.exports = router;
