import express from 'express';
const app = express();
const port = 3000;
import sql from './config/db.js';
import cookieParser from 'cookie-parser';
import shortid from 'shortid';
import QRCode from 'qrcode';

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/login', (req, res) => {
  res.render('login', { username: null, errorMessage: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await sql`
      SELECT * FROM "user" WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.render('login', { username: null, errorMessage: 'Username or password is incorrect.' });
    }

    res.cookie('username', username);
    res.cookie('username', username, {maxAge:3600 * 1000})

    return res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/register', (req, res) => {
  res.render('register', { username: null, errorMessage: null });
});

app.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  try {
    const checkUser = await sql`
      SELECT * FROM "user" WHERE username = ${username} AND password = ${password}
    `;

    if (checkUser.length > 0) {
      return res.render('register', { errorMessage: 'Username or email already exists' });
    }

    if (password !== password2) {
      return res.render('register', { errorMessage: 'Password not match' });
    }

    await sql`
      INSERT INTO "user" (username, email, password, create_at)
      VALUES (${username}, ${email}, ${password}, ${new Date()})
    `;

    res.render('login', { username: null, errorMessage: null });
  } catch (error) {
    res.send(error);
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  return res.render('login', { username: null, errorMessage: null });
});

app.get('/', async (req, res) => {
  const username = req.cookies.username;
  const { short_url, qr_code } = req.query;

  res.render('home', { username, short_url, qr_code });
});

app.get('/list', async (req, res) => {
  const username = req.cookies.username;
  try {
    const login = await sql`
      SELECT * FROM "user" WHERE username = ${username}`;

    if (login.length > 0) {
      const click = await sql`
        SELECT u.original_url, u.short_url, u.qr_code, COUNT(c.short_url) AS click_count
        FROM url u
        JOIN clicks c ON u.short_url = c.short_url
        GROUP BY u.short_url, u.original_url, u.qr_code`;
      return res.render('lists', { username, click }); 
    
    } else {
      return res.redirect('/login');
    }

  } catch (error) {
    console.error(error);
  }
});

app.post('/url', async (req, res) => {
  const username = req.cookies.username;
  const { original_url } = req.body;

  try {
    const login = await sql`
      SELECT * FROM "user" WHERE username = ${username}`;

    if (login.length > 0) {
      const checkURL = await sql`
        SELECT * FROM url WHERE original_url = ${original_url}`;

      let short_url, qr_code;
      if (checkURL.length === 0) {
        short_url = shortid.generate();
        const fullShort_url = `http://example/${short_url}`;
        qr_code = await QRCode.toDataURL(fullShort_url);

        await sql`
          INSERT INTO url (original_url, short_url, qr_code) 
          VALUES (${original_url}, ${short_url}, ${qr_code})`;

      } else {
        short_url = checkURL[0].short_url;
        qr_code = checkURL[0].qr_code;
      }

      await sql`
        INSERT INTO clicks (short_url, clicked_at, username) VALUES (${short_url}, ${new Date()}, ${username})`

      const fullShort_url = `http://example/${short_url}`;
      return res.render('home', { username, short_url: fullShort_url, qr_code });
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    res.send(error);
  }
});

app.get('/:short_url', async (req, res) => {
  const short_url = req.params.short_url;

  try {
    const result = await sql`
      SELECT * FROM url WHERE short_url = ${short_url}`

    if (result.length > 0) {
      const original_url = result[0].original_url;
      return res.redirect(original_url);
    } else {
      return res.send('Short URL not found');
    }
  } catch (error) {
    res.send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
