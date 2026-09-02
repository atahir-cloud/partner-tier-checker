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
    body { font-family: sans-serif; max-width: 500px; margin: 60px auto; text-align: center; }
    input { padding: 10px; font-size: 16px; width: 200px; }
    button { padding: 10px 20px; font-size: 16px; background: #ff7a59; color: white; border: none; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Partner Tier Checker</h1>
  <p>Enter your monthly hosting spend to see your partner tier:</p>
  <form method="POST" action="/check">
    <input type="number" name="spend" placeholder="e.g. 250" required />
    <br /><br />
    <button type="submit">Check My Tier</button>
  </form>
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
            body { font-family: sans-serif; max-width: 500px; margin: 60px auto; text-align: center; }
            h1 { color: ${result.color}; }
            a { color: #ff7a59; }
          </style>
        </head>
        <body>
          <p>Monthly spend: $${spend}</p>
          <h1>${result.tier} Tier</h1>
          <ul style="text-align: left; display: inline-block;">
            ${result.benefits.map((b) => `<li>${b}</li>`).join('')}
          </ul>
          <br /><br />
          <a href="/">&larr; Check another amount</a>
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
