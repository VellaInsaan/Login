require('dotenv').config();
//
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSID, authToken);
const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const OTP_AUTH_KEY = process.env.OTP_AUTH_KEY;
const cors = require('cors');
let refreshTokens = [];
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.post('/sendOTP', (req, res) => {
  const phoneNo = req.body.phoneNo;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const ttl = 2 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${phoneNo}.${otp}.${expires}`;
  const hash = crypto
    .createHmac('sha256', OTP_AUTH_KEY)
    .update(data)
    .digest('hex');
  const fullhash = `${hash}.${expires}`;
  client.messages
    .create({
      body: `Your OTP for Daves' Brother Technologies login is ${otp}`,
      from: +19706140094,
      to: phoneNo,
    })
    .then((messages) => console.log(messages))
    .catch((err) => console.error(err));
  res.status(200).send({ phoneNo, hash: fullhash });
});

app.post('/verifyOTP', (req, res) => {
  const phoneNo = req.body.phoneNo;
  const hash = req.body.hash;
  const otp = req.body.otp;
  let [hashValue, expires] = hash.split('.');
  let now = Date.now();
  if (now > parseInt(expires)) {
    return res.status(504).send({ msg: `Expired. Try Again` });
  }
  const data = `${phoneNo}.${otp}.${expires}`;
  const newHash = crypto
    .createHmac('sha256', OTP_AUTH_KEY)
    .update(data)
    .digest('hex');

  if (newHash === hashValue) {
    const accessToken = jwt.sign({ data: phoneNo }, JWT_AUTH_TOKEN, {
      expiresIn: '30s',
    });

    const refreshToken = jwt.sign({ data: phoneNo }, JWT_AUTH_TOKEN, {
      expiresIn: '1y',
    });
    refreshTokens.push(refreshToken);
    res
      .status(202)
      .cookie('accessToken', accessToken, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'strict',
        httpOnly: true,
      })
      .cookie('authSession', true, {
        expires: new Date(new Date().getTime() + 30 * 1000),
      })
      .cookie('refreshToken', refreshToken, {
        expires: new Date(new Date().getTime() + 3557600000),
        sameSite: 'strict',
        httpOnly: true,
      })

      .cookie('refreshTokenID', true, {
        expires: new Date(new Date().getTime() + 3557600000),
      })
      .send({ msg: `User Verified` });
  } else {
    return res.status(400).send({ verification: false, msg: `Invalid OTP` });
  }
});

const authenticateUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, phoneNo) => {
    if (phoneNo) {
      req.phoneNo = phoneNo;
      next();
    } else if (err.message === 'TokenExpiredError') {
      return res
        .status(403)
        .send({ success: false, msg: `Access Token Expired` });
    } else {
      console.error(err);
      res.status(403).send({ err, msg: `User Not Authenticated ` });
    }
  });
};

app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(403)
      .send({ msg: `Refresh Token Invalid. Please Login Again !` });

  if (!refreshTokens.includes(refreshToken))
    return res.status(403).send({ msg: `Refresh Token Blocked` });

  jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phoneNo) => {
    if (!err) {
      const accessToken = jwt.sign({ data: phoneNo }, JWT_AUTH_TOKEN, {
        expiresIn: '30s',
      });
      res
        .status(202)
        .cookie('accessToken', accessToken, {
          expires: new Date(new Date().getTime() + 30 * 1000),
          sameSite: 'strict',
          httpOnly: true,
        })
        .cookie('authSession', true, {
          expires: new Date(new Date().getTime() + 30 * 1000),
        })
        .send({ previousSessionExpiry: true, success: true });
    } else {
      return res
        .status(403)
        .send({ success: false, msg: `Invalid Refresh Token` });
    }
  });
});

app.get('/logout', (req, res) => {
  res
    .clearCookie('refreshToken')
    .clearCookie('accessToken')
    .clearCookie('authSession')
    .clearCookie('refreshTokenID')
    .send('Logged Out');
});
app.listen(5000);
