const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var multer = require('multer')
var forms = multer();
const path = __dirname + '/react-web-app/view/build/';
const app = express();
app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

// set port, listen for requests
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var enStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path+'/locales/en')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname )
    }
})
var enUpload = multer({ storage: enStorage }).single('file')
app.post('/upload/en',function(req, res) {
    enUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});
app.get('/download/en',(req,res)=>{  
    var down_path= path+'/locales/en/translate.json';  
    res.download(down_path);
}) 


var arStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path+'/locales/ar')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname )
    }
})
var arUpload = multer({ storage: arStorage }).single('file')
app.post('/upload/ar',function(req, res) {
    arUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});
app.get('/download/ar',(req,res)=>{  
    var down_path= path+'/locales/ar/translate.json';  
    res.download(down_path);
}) 

var itStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path+'/locales/it')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname )
    }
})
var itUpload = multer({ storage: itStorage }).single('file')
app.post('/upload/it',function(req, res) {
    itUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});
app.get('/download/it',(req,res)=>{  
    var down_path= path+'/locales/it/translate.json';  
    res.download(down_path);
}) 

var deStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path+'/locales/de')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname )
    }
})
var deUpload = multer({ storage: deStorage }).single('file')
app.post('/upload/de',function(req, res) {
    deUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});
app.get('/download/de',(req,res)=>{  
    var down_path= path+'/locales/de/translate.json';  
    res.download(down_path);
}) 

var esStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path+'/locales/es')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname )
    }
})
var esUpload = multer({ storage: esStorage }).single('file')
app.post('/upload/es',function(req, res) {
    esUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});
app.get('/download/es',(req,res)=>{  
    var down_path= path+'/locales/es/translate.json';  
    res.download(down_path);
})

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});