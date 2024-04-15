//Import Required Modules
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const nodeMailer = require('nodemailer');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const verify = require('./middleware/verify');
const {
  payprocess,
  paySuccess,
  payCancel,
} = require('./payment/paymentBackend');

const jwt = require('jsonwebtoken');
var cors = require('cors');

// Set up CORS, cookies middleware
app.use(cors());
app.use(cookieParser());
// Set up body parser middleware
app.use(bodyParser.json());

app.post('/pay', payprocess);

app.get('/success', paySuccess);
app.get('/cancel', payCancel);

app.get('/new', (req, res) => {
  res.send('new mw');
});
// Create HTTP server using Express
const server = require('http').createServer(app);
// Import socket.io and configure it to work with the HTTP server
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// Import Mongoose models
const { Documents, Users } = require('./Model');
// Connect to MongoDB
main().catch((err) => console.log(err));
console.log('start');
async function main() {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
//try payemnt

// Define default value for documents

const defaultValue = '';

// Handle socket.io connections
io.on('connection', (socket) => {
  // When a client requests a document, find or create it and emit it to the client
  socket.on('get-document', async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data);

    // When a client sends changes to a document, broadcast those changes to other clients

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    // When a client saves a document, update it in the database
    socket.on('save-document', async (data) => {
      await Documents.findByIdAndUpdate(documentId, { data });
    });
  });
});
// Function to find or create a document based on its ID
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Documents.findById(id);
  if (document) return document;
  return await Documents.create({ _id: id, data: defaultValue });
}

//SENDING MAIL TO CUSTOMERS
var nodeObject = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: process.env.EMAILPORT,
  secure: true,
  auth: {
    user: process.env.OWNEREMAIL,
    pass: process.env.OWNERPASS,
  },
};
var trans = nodeMailer.createTransport(nodeObject, { debug: true });

// Handle POST requests to create a new user
app.post('/post', async (req, res) => {
  var { id, username, email, password } = req.body;
  var idI = req.body.id;
  var usernameI = req.body.username;
  var passwordI = req.body.password;
  let findIdUser = await Users.findOne({ id: idI });
  if (findIdUser) {
    return res.status(500).json({
      message: 'PLEASE SELECT DIFFERENT USER ID',
    });
  }
  //sending Mail to respective Customer
  const details = {
    from: process.env.OWNERMAIL,
    to: email,
    subject: 'SUCCESSFUL REGISTRATION TO KP-DOCS',
    text: `${username} ! You are successfully Registered to KP-DOCS`,
    html: `<h3><h1>Welcome ${username}</h1> Thank You for trusting Us! Please Provide Feedback to Us!!!</h3>`,
  };

  trans.sendMail(details, (err) => {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      console.log('Email is sent successfully!!!');
    }
  });
  // Regestiration of Users
  var Initial = {
    id: id,
    username: usernameI,
    email: email,
    password: passwordI,
  };
  salt = await bcrypt.genSalt(10);
  hash = await bcrypt.hash(password, salt);
  try {
    jwt.sign(
      Initial,
      process.env.ACCESS_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          // Handle error if JWT signing fails

          res.status(500).json({ error: 'Failed to sign JWT token' });
        } else {
          // Set the token as a cookie named 'token'
          // res.cookie('Accesstoken', token, {
          //   maxAge: 86400000,
          //   httpOnly: true,
          //   secure: true,
          // }); // maxAge is in milliseconds, 1 day = 24 * 60 * 60 * 1000 = 86400000
          // Send response
          res.json({
            Token: token,
            admitted,
          });
        }
      }
    );

    jwt.sign(
      Initial,
      process.env.REFRESH_SECRET,
      { expiresIn: '3d' },
      async (err, rtoken) => {
        if (err) {
          // Handle error if JWT signing fails

          res.status(500).json({ error: 'Failed to sign JWT token' });
        } else {
          const final = Users({
            id: id,
            username: usernameI,
            email: email,
            password: hash,
            refreshToken: rtoken,
          });

          const admitted = await final.save();

          console.log('user is saved');

          res.status(201).json({
            RefreshToken: rtoken,
            Message: 'Refresh Token Is sent! and USER DATA IS ALSO SAVED',
          });
        }
      }
    );

    // const final = Users({
    //   id: id,
    //   username: usernameI,
    //   email: email,
    //   password: hash,
    // });

    // const admitted = await final.save();

    // console.log('user is saved');
  } catch (e) {
    return res.send('Invalid Data is Entered !!!');
  }
  // jwt.sign(
  //   Initial,
  //   process.env.ACCESS_SECRET,
  //   { expiresIn: '1d' },
  //   (err, token) => {
  //     if (err) {
  //       // Handle error if JWT signing fails

  //       res.status(500).json({ error: 'Failed to sign JWT token' });
  //     } else {
  //       // Set the token as a cookie named 'token'
  //       // res.cookie('Accesstoken', token, {
  //       //   maxAge: 86400000,
  //       //   httpOnly: true,
  //       //   secure: true,
  //       // }); // maxAge is in milliseconds, 1 day = 24 * 60 * 60 * 1000 = 86400000
  //       // Send response
  //       res.json({
  //         Token: token,
  //         admitted,
  //       });
  //     }
  //   }
  // );

  // jwt.sign(
  //   Initial,
  //   process.env.REFRESH_SECRET,
  //   { expiresIn: '3d' },
  //   (err, rtoken) => {
  //     if (err) {
  //       // Handle error if JWT signing fails

  //       res.status(500).json({ error: 'Failed to sign JWT token' });
  //     } else {
  //       // Set the token as a cookie named 'token'
  //       // res.cookie('Refreshtoken', rtoken, {
  //       //   maxAge: 86400000,
  //       //   httpOnly: true,
  //       //   secure: true,
  //       // });
  //       // maxAge is in milliseconds, 1 day = 24 * 60 * 60 * 1000 = 86400000

  //       res.status(201).json({
  //         RefreshToken: rtoken,
  //         Message: 'Refresh Token Is sent!',
  //       });

  //       // Send response
  //       // res.json({
  //       //   admitted,
  //       // });
  //     }
  //   }
  // );

  // res.send(admitted);
});

//login method
app.post('/login', verify, async (req, res) => {
  var id = req.body.id;
  var usernameTest = req.body.username;
  var password = req.body.password;
  // Verification of  Data Credentials
  const test = await Users.findOne({ id: req.body.id });
  if (!test) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const test2 = await bcrypt.compare(password, test.password);
  if (!test2) {
    console.log('wrong password');
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (test2) {
    const loggedInUser = {
      id: req.body.id,
      usernameTest: req.body.username,
      password: req.body.password,
    };
    // }

    jwt.verify(req.token, process.env.REFRESH_SECRET, async (err, data) => {
      var VerifyingUser = await Users.findOne({ id: req.body.id });
      if (err) {
        if (req.token !== VerifyingUser.refreshToken) {
          //regenerate The new Token

          jwt.sign(
            loggedInUser,
            process.env.REFRESH_SECRET,
            { expiresIn: '3d' },
            async (err, rtoken) => {
              var ModifiedUser = await Users.findOneAndUpdate(
                { id: req.body.id },
                {
                  refreshToken: rtoken,
                },
                { new: true }
              );
              await ModifiedUser.save();

              return res.status(201).json({
                RefreshToken: rtoken,
                Message: 'Refresh Token Is sent!',
              });
            }
          );
        } else {
          return res.status(500).json({
            message: 'Error in verification',
          });
        }
      } else {
        return res.status(201).json({
          message: 'Successful',
          data,
        });
      }
    });
  } else {
    return res.status(500).json({
      message: 'Please enter Valid Data',
    });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { id: req.body.id },
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );
    res.status(201).send('You are logged Out ');
  } catch (e) {
    console.log('error at logout is', e);
  }
});

// Start the server listening on port 3001
server.listen(3001, () => {
  console.log(' end of backend');
});
