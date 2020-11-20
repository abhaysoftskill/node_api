// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })


require('rootpath')();

const express = require('express');
const session = require('express-session');
const router = express.Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const options = {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Headers": 'Content-Type,x-xsrf-token',
    "Access-Control-Expose-Headers": true,
    "Access-Control-Allow-Methods": 'POST, GET, PUT, DELETE, OPTIONS'
};

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use(cors(options));

let sess; 
function validateUser(req, res, next) {
    if (req.session.email !== undefined) {
      console.log("User is verified to access");
      next();
    } else {
      console.log("Failed: User not verified, redirect to 404");
    //   return res.redirect("/404.html");
           res.write('<h3>Please login first.</h3>');
        res.end('<a href='+'/'+'>Login</a>');
    }
  }

router.get('/',(req,res) => {
    sess = req.session;
    if(sess.email) {
        return res.redirect('/api/');
    }
    res.sendFile('index.html');
});


router.post('/login',(req,res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
});

router.get('/api/*', validateUser, (req,res, next) => {
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    next();
});
router.get('/pub/*', validateUser, (req,res, next) => {
    res.write(`<h1>Hello ${sess.email} </h1><br>`);
    res.end('<a href='+'/logout'+'>Logout</a>');
next();
});
router.get('/data*', (req,res, next) => {
    res.write(`<h1>Your are accessing  ${req.url} route</h1><br>`);

});

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.use('/', router);

app.listen(process.env.PORT || 3000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
