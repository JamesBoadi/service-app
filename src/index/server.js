var express = require('express');
const https = require('https');
const readline = require("readline");
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var pbkdf2 = require('pbkdf2');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

let urlencodedParser = bodyParser.urlencoded({ extended: true });



var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

let server = app.listen(3001, function () {
    console.log("This confirms the server is running \r\n")
});


var array = [];

function pushToArray(record) {
    array.push(record);
}

function getArray() {
    return array;
}

/*
    
let request_ = "";

function setReqUrl(req) {
    request_ = req;
}

function getReqUrl() {
    
    return request_;
}


let bool = false;

function setBool(bool_) {
    bool = bool_;
}

function getBool() {
    return bool;
}


let json = {}

function setJson(email, password) {
    json = { email: email, password: password }
}

function getJson() { return json; }


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function validateEmail(email) {
    const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return re.test(String(email).toLowerCase());
}

var recursiveAsyncReadLine = function () {
    rl.question("Do you wish to login or register? (1 for login, 2 for register)",
        function (res) {
            if (res == '1')
                rl.question("What is your email? ", function (email) {
                    if (validateEmail(email.trim()))
                        rl.question("What is your password?", function (password) {
                            if (password !== '' && password.length > 6) {
                                setReqUrl('users/login');
                                setJson(email, password);
                            }
                            else {
                                console.log("Come on buddy, give me a password with more than 6 characters")
                                recursiveAsyncReadLine();
                            }
                            rl.close();
                        });
                    else {
                        console.log("Invalid Email, try again");
                        recursiveAsyncReadLine();
                    }
                });
            else
                recursiveAsyncReadLine();

        });
}

rl.on("close", function () {
    console.log("\n Checking details...");
    userReqUrl();
});*/

/*
var whitelist = ['http://localhost:3000','http://localhost:3001','http://localhost:3000/logo192.png']; // Whitelist requests from other ports to this domain
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));*/



// Registration
app.post('users/register', async function (req, res) { // callback
    try {
        const name = new String(req.query.name);
        const email = new String(req.query.email);
        const password = new String(req.query.password);

        // Complete registration
        let result = registerAccount(name, email, password);
        let obj = JSON.stringify(result);

        if (obj)
            res.status(200).send({ user: "You are logged in!" });
        else
            res.sendStatus(500);
    }
    catch (ex) {
        res.sendStatus(500);
        console.log('Failed registration ' + ex);
    }
});


// Log In
app.post('users/login', async function (req, res) { // callback
    try {
        const email = req.query.email;
        const password = req.query.password;

        var result = authLogin(email, password);
        var obj = JSON.stringify(result);
        console.log(obj);

        if (obj)
            res.sendStatus(200).send({ user: "You are logged in!" });
        else {
            console.log("Failed to login")
            res.sendStatus(500);
        }
    }

    catch (ex) {
        res.sendStatus(500);
        console.log('invalid login' + ex);
    }
});

app.get('users/review?', async function (req, res) { // callback
    try {
        const name = req.body.name;
        getSellerReview(name);
        res.sendStatus(200);
    }

    catch (ex) {
        res.sendStatus(500);
        console.log('invalid login' + ex);
    }
});

app.post('/getSellerReviews', function (req, res) { // callback
    try {
        const name = req.body.name;
        getSellerReview(name);
        res.sendStatus(200);
    }

    catch (ex) {
        res.sendStatus(500);
        console.log('invalid login' + ex);
    }
});

/************************** Utility Functions **************************/

/**
 * @param {key} Key Randomly generated key
 * @param {salt} Salt  String
 */
function hashPassword(key, salt) {
    key = new String(key).toString().trim();
    var res = pbkdf2.pbkdf2Sync(key, salt, 2048, 8, 'sha512');
    res = res.toString('hex');
    return res;
}

/************************************************************************/

// Create a new account
function registerAccount() {
    console.log(this.name + " " + this.email + " " + this.password);
    /*
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });*/

    // read json file array and generate a place

    return storeCredentials(this.name, this.email, this.password);
}

function storeCredentials(name, email, key) {
    fs.readFile((process.cwd() + "/src/index/id.json"), 'utf8', function (err, hash) {
        if (err) throw err;
        let objArr = JSON.parse(hash);

        // Store information
        let info =
        {
            Name: name,
            Email: email,
            Key: key
        }

        objArr.push(info);

        fs.writeFile((process.cwd() + "/src/index/id.json"), JSON.stringify(objArr), function (err) {
            if (err) return false;
        });
    });

    return true;
}


function getSellerReview(info) {
    fs.readFile((process.cwd() + "/src/index/id.json"), 'utf8', function (err, records) {
        if (err) throw err;
        
        let objArr = JSON.parse(records);
        let bool = false;
        
        for (var count = 0; count < objArr.length; count++) {
            var name = objArr[count].name;
            console.log("name " + name);
            if (name == info) {
              
                var review = objArr[count].sellerReview;
              
                if(review !== "" || review !== undefined)
                    bool = true;

                console.log("rev " + review)
                pushToArray(name.concat("     review" + review));
              
            }
        }
        
        if(!bool)
            console.log("There are no reviews");

    });
}


function authLogin(email, password) {
    /*  var name = '';
      // Validate hash
      fs.readFile((process.cwd() + "service-app/index/id.json"), 'utf8', function (err, hash) {
          if (err) throw err;
          let objArr = JSON.parse(hash);
 
          for (var count = 0; count < objArr.length; count++) {
              var key = objArr[count].Key;
              if (Trader.verfifyHash(Buffer.from(key, 'utf8'), password, email.toString().trim())) {
                  
                  name = objArr[count].Name;
                
                
                
                  Trader.setName(name);
                  Trader.setBool(true);
                  break;
              }
          }
      });
 
      let Credentials = { Name: Trader.getName(), ValidCredentials: Trader.getBool() };
      return Credentials;*/
}


/************************ Utility Functions *************************

/**
 * @param {words} Key Mneumonic words that make up the key (this is stored)
 * @param {password} Password The password (this remains secret and is not stored in any capacity)
 * @param {email} WalletID Wallet identification */

function verfifyHash(key, password, email, salt) {
    let hardSalt = salt.concat(password.toString()).trim();
    key = new String(key).toString().trim();
    hardSalt = new String(hardSalt).toString().trim();

    var res = pbkdf2.pbkdf2Sync(key, hardSalt, 2048, 8, 'sha512');
    res = res.toString('hex');
    let isValid = (res === email) ? true : false;

    return isValid;
}

/************************************************************************/




