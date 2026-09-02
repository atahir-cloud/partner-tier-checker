// This is our Node.js server. Node.js has a built-in "http" tool
// that lets us create a server without installing anything extra.
const http = require('http');

// This is the webpage (HTML) that we will show when someone visits our site.
// It's just a title, an input box, and a button.
const formPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Cloudways Partner Tier Checker</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2d1b69 0%, #6b2d8c 50%, #d94f3d 100%);
    }
    .card {
      background: white;
      padding: 48px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.25);
      max-width: 420px;
      width: 90%;
      text-align: center;
    }
    .badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #6b2d8c;
      background: #f3ecfa;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    h1 { margin: 0 0 8px; font-size: 26px; color: #1a1a2e; }
    p { color: #666; font-size: 14px; margin-bottom: 28px; }
    input {
      padding: 14px;
      font-size: 16px;
      width: 100%;
      border: 2px solid #e5e0f0;
      border-radius: 8px;
      text-align: center;
    }
    input:focus { outline: none; border-color: #ff7a59; }
    button {
      margin-top: 16px;
      padding: 14px;
      font-size: 16px;
      font-weight: 600;
      width: 100%;
      background: #ff7a59;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.1s;
    }
    button:hover { background: #f0673f; }
    .top-logo {
      position: fixed;
      top: 24px;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .top-logo .logo-text-block { display: flex; flex-direction: column; line-height: 1.1; }
    .top-logo .logo-main { font-size: 17px; font-weight: 800; color: white; letter-spacing: 0.5px; }
    .top-logo .logo-sub { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.75); letter-spacing: 0.3px; }
  </style>
</head>
<body>
  <div class="top-logo">
    <svg width="26" height="19" viewBox="0 0 28 20"><path d="M7 16C3.5 16 1 13.5 1 10.5C1 7.8 3 5.6 5.6 5.2C6.4 2.5 8.9 0.7 11.8 0.7C14.9 0.7 17.5 2.8 18.1 5.7C21 6 23.3 8.4 23.3 11.3C23.3 14 21 16 18.3 16H7Z" fill="white"/></svg>
    <div class="logo-text-block">
      <span class="logo-main">CLOUDWAYS</span>
      <span class="logo-sub">by DigitalOcean</span>
    </div>
  </div>
  <div class="card">
    <span class="badge">CLOUDWAYS AGENCY PARTNERS</span>
    <h1>Partner Tier Checker</h1>
    <p>Enter your monthly hosting spend to see your partner tier &amp; benefits</p>
    <form method="POST" action="/check">
      <input type="number" name="spend" placeholder="e.g. 250" required />
      <button type="submit">Check My Tier</button>
    </form>
  </div>
</body>
</html>
`;

// This function contains our tier rules -- taken from the real
// Cloudways Agency Partner Program Guide.
function getTier(spend) {
  if (spend > 2500) {
    return {
      tier: 'Platinum',
      color: '#8e44ad',
      benefits: [
        'Premium technical support (senior engineers)',
        'Unlimited free website migrations',
        'Dedicated Partner Success Manager',
        '10% onboarding discount for 12 months',
        '$1500 hosting credits growth bonus',
        'Spotlight feature in Partner Directory',
        'Co-sponsored community events',
        'Referral commissions: 10% lifetime + $50/referral'
      ]
    };
  } else if (spend >= 500) {
    return {
      tier: 'Gold',
      color: '#f1c40f',
      benefits: [
        'Advanced technical support',
        'Unlimited free website migrations',
        'Dedicated Partner Success Manager',
        '10% onboarding discount for 6 months',
        '$500 hosting credits growth bonus',
        'Early access to beta features',
        'Expanded co-marketing opportunities'
      ]
    };
  } else if (spend >= 100) {
    return {
      tier: 'Silver',
      color: '#95a5a6',
      benefits: [
        'Advanced technical support',
        'Free WP Plugin migrations',
        'Dedicated Partner Success Manager',
        '$250 hosting credits growth bonus',
        'Featured in Agency Partner Directory'
      ]
    };
  } else {
    return {
      tier: 'Bronze',
      color: '#cd7f32',
      benefits: [
        'Standard technical support',
        'Free WP Plugin migrations',
        'Support from Success Team',
        'Access to $15,000+ worth of learning resources',
        'Free trial of Agency Tools'
      ]
    };
  }
}

// createServer() sets up our server, and tells it what to do
// every time a request comes in.
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Someone just opened the page normally -> show the form.
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(formPage);
  } else if (req.method === 'POST' && req.url === '/check') {
    // The form was submitted. The browser sends the data in small
    // pieces ("chunks") -- we collect them all before reading it.
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      // body looks like "spend=250" -- we pull the number out of it.
      const spend = Number(new URLSearchParams(body).get('spend')) || 0;
      const result = getTier(spend);

      const resultPage = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Your Partner Tier</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #2d1b69 0%, #6b2d8c 50%, #d94f3d 100%);
            }
            .card {
              background: white;
              padding: 44px 40px;
              border-radius: 16px;
              box-shadow: 0 20px 50px rgba(0,0,0,0.25);
              max-width: 440px;
              width: 90%;
              text-align: center;
            }
            .spend { color: #888; font-size: 14px; margin-bottom: 6px; }
            .tier-badge {
              display: inline-block;
              font-size: 28px;
              font-weight: 800;
              color: white;
              background: ${result.color};
              padding: 10px 28px;
              border-radius: 30px;
              margin-bottom: 28px;
            }
            ul { text-align: left; list-style: none; padding: 0; margin: 0; }
            li {
              padding: 10px 0;
              border-bottom: 1px solid #f0f0f0;
              color: #333;
              font-size: 15px;
            }
            li:last-child { border-bottom: none; }
            li::before { content: "✓ "; color: ${result.color}; font-weight: 700; }
            .connect-btn {
              display: block;
              margin-top: 28px;
              padding: 14px;
              background: #ff7a59;
              color: white !important;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              text-decoration: none;
            }
            .connect-btn:hover { background: #f0673f; }
            a {
              display: inline-block;
              margin-top: 24px;
              color: #ff7a59;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
            }
            a:hover { text-decoration: underline; }
            .top-logo {
              position: fixed;
              top: 24px;
              left: 24px;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .top-logo .logo-text-block { display: flex; flex-direction: column; line-height: 1.1; }
            .top-logo .logo-main { font-size: 17px; font-weight: 800; color: white; letter-spacing: 0.5px; }
            .top-logo .logo-sub { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.75); letter-spacing: 0.3px; }
          </style>
        </head>
        <body>
          <div class="top-logo">
            <svg width="26" height="19" viewBox="0 0 28 20"><path d="M7 16C3.5 16 1 13.5 1 10.5C1 7.8 3 5.6 5.6 5.2C6.4 2.5 8.9 0.7 11.8 0.7C14.9 0.7 17.5 2.8 18.1 5.7C21 6 23.3 8.4 23.3 11.3C23.3 14 21 16 18.3 16H7Z" fill="white"/></svg>
            <div class="logo-text-block">
              <span class="logo-main">CLOUDWAYS</span>
              <span class="logo-sub">by DigitalOcean</span>
            </div>
          </div>
          <div class="card">
            <p class="spend">Monthly spend: $${spend}</p>
            <div class="tier-badge">${result.tier}</div>
            <ul>
              ${result.benefits.map((b) => `<li>${b}</li>`).join('')}
            </ul>
            <a href="mailto:agencies@cloudways.com?subject=Connect%20with%20Partner%20Manager%20-%20${result.tier}%20Tier" class="connect-btn">Connect with Partner Manager</a>
            <br />
            <a href="/">&larr; Check another amount</a>
          </div>
        </body>
        </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(resultPage);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// This tells the server: "start listening for requests on port 3000"
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
