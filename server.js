// This is our Node.js server. Node.js has a built-in "http" tool
// that lets us create a server without installing anything extra.
const http = require('http');

// Shared styles used on both pages.
function pageShell(extraStyles = '') {
  return `
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2d1b69 0%, #6b2d8c 50%, #d94f3d 100%);
      padding: 40px 16px;
      position: relative;
      overflow-x: hidden;
    }
    .bg-shape {
      position: fixed;
      border-radius: 50%;
      filter: blur(40px);
      z-index: 0;
      pointer-events: none;
    }
    .bg-shape.one { width: 300px; height: 300px; background: rgba(255,122,89,0.25); top: -80px; right: -80px; }
    .bg-shape.two { width: 260px; height: 260px; background: rgba(241,196,15,0.18); bottom: -60px; left: -60px; }
    .bg-shape.three { width: 200px; height: 200px; background: rgba(255,255,255,0.10); top: 40%; right: 8%; }
    .top-logo {
      position: fixed;
      top: 24px;
      left: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 2;
    }
    .top-logo .logo-text-block { display: flex; flex-direction: column; line-height: 1.1; }
    .top-logo .logo-main { font-size: 17px; font-weight: 800; color: white; letter-spacing: 0.5px; }
    .top-logo .logo-sub { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.75); letter-spacing: 0.3px; }
    .page-title { text-align: center; margin-bottom: 8px; z-index: 1; }
    .page-title h2 { color: white; font-size: 34px; font-weight: 800; margin: 0 0 6px; letter-spacing: -0.5px; }
    .page-title p { color: rgba(255,255,255,0.8); font-size: 14px; margin: 0; }
    .how-note {
      color: rgba(255,255,255,0.75);
      font-size: 12.5px;
      text-align: center;
      max-width: 420px;
      margin: 6px 0 24px;
      z-index: 1;
    }
    .card { position: relative; z-index: 1; }
    .footer-strip {
      z-index: 1;
      margin-top: 32px;
      max-width: 560px;
      width: 90%;
      text-align: center;
    }
    .footer-strip .apply-row {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .footer-strip .apply-row a {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
    }
    .apply-btn { background: white; color: #6b2d8c; }
    .directory-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.4); }
    @media (min-width: 900px) {
      .footer-strip .apply-row {
        position: fixed;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
        margin-bottom: 0;
        z-index: 2;
      }
      .footer-strip .apply-row a { width: 170px; text-align: center; }
    }
    .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; }
    .contact-grid .item { color: rgba(255,255,255,0.9); font-size: 12px; }
    .contact-grid .item strong { display: block; color: white; font-size: 13px; margin-bottom: 3px; }
    ${extraStyles}
  `;
}

const bgShapesHtml = `
  <div class="bg-shape one"></div>
  <div class="bg-shape two"></div>
  <div class="bg-shape three"></div>
`;

const topLogoHtml = `
  <div class="top-logo">
    <svg width="26" height="19" viewBox="0 0 28 20"><path d="M7 16C3.5 16 1 13.5 1 10.5C1 7.8 3 5.6 5.6 5.2C6.4 2.5 8.9 0.7 11.8 0.7C14.9 0.7 17.5 2.8 18.1 5.7C21 6 23.3 8.4 23.3 11.3C23.3 14 21 16 18.3 16H7Z" fill="white"/></svg>
    <div class="logo-text-block">
      <span class="logo-main">CLOUDWAYS</span>
      <span class="logo-sub">by DigitalOcean</span>
    </div>
  </div>
`;

const pageTitleHtml = `
  <div class="page-title">
    <h2>Agency Tier Calculator</h2>
    <p>Cloudways Agency Partner Program</p>
  </div>
  <p class="how-note">Tiers are based on your monthly hosting spend on Cloudways &mdash; the more you host, the more you unlock. Tiers update automatically as your spend grows.</p>
`;

const footerHtml = `
  <div class="footer-strip">
    <div class="apply-row">
      <a class="apply-btn" href="https://www.cloudways.com/en/agency-partner-program.php" target="_blank">Not a partner yet? Apply now</a>
      <a class="directory-btn" href="https://www.cloudways.com/en/agency-partner-directory.php" target="_blank">View Agency Directory</a>
    </div>
    <div class="contact-grid">
      <div class="item"><strong>Partner Manager</strong>agencies@cloudways.com</div>
      <div class="item"><strong>Success Manager</strong>success@cloudways.com</div>
      <div class="item"><strong>Billing Team</strong>billing@cloudways.com</div>
    </div>
  </div>
`;

// This is the webpage (HTML) that we will show when someone visits our site.
const formPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Cloudways Partner Tier Checker</title>
  <style>
    ${pageShell(`
      .card {
        background: white;
        padding: 48px 44px;
        border-radius: 16px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        max-width: 520px;
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
      h1 { margin: 0 0 8px; font-size: 24px; color: #1a1a2e; }
      p.sub { color: #666; font-size: 14px; margin-bottom: 28px; }
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
      }
      button:hover { background: #f0673f; }
      button:disabled { opacity: 0.7; cursor: default; }
      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.5);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        vertical-align: middle;
        margin-right: 8px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `)}
  </style>
</head>
<body>
  ${bgShapesHtml}
  ${topLogoHtml}
  ${pageTitleHtml}
  <div class="card">
    <span class="badge">CLOUDWAYS AGENCY PARTNERS</span>
    <h1>Agency Partner Program Tier Checker</h1>
    <p class="sub">Enter your monthly hosting spend to see your partner tier &amp; benefits</p>
    <form method="POST" action="/check" id="tierForm">
      <input type="number" name="spend" placeholder="e.g. 250" required />
      <button type="submit" id="submitBtn">Check My Tier</button>
    </form>
  </div>
  ${footerHtml}
  <script>
    document.getElementById('tierForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Calculating...';
      setTimeout(() => e.target.submit(), 800);
    });
  </script>
</body>
</html>
`;

// This function contains our tier rules -- taken from the real
// Cloudways Agency Partner Program Guide.
function getTier(spend) {
  if (spend >= 2500) {
    return {
      tier: 'Platinum',
      icon: '💎',
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
      icon: '🥇',
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
      icon: '🥈',
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
      icon: '🥉',
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

const TIER_COLORS = { Bronze: '#cd7f32', Silver: '#95a5a6', Gold: '#f1c40f', Platinum: '#8e44ad' };

// Works out how close the spend is to the NEXT tier up, so we can show
// a progress bar. Returns null when already at the top tier (Platinum).
function getProgress(spend, tier) {
  if (tier === 'Bronze') {
    return { percent: Math.min(100, (spend / 100) * 100), remaining: 100 - spend, nextTier: 'Silver', nextColor: TIER_COLORS.Silver };
  } else if (tier === 'Silver') {
    return { percent: Math.min(100, ((spend - 100) / (500 - 100)) * 100), remaining: 500 - spend, nextTier: 'Gold', nextColor: TIER_COLORS.Gold };
  } else if (tier === 'Gold') {
    return { percent: Math.min(100, ((spend - 500) / (2500 - 500)) * 100), remaining: 2500 - spend, nextTier: 'Platinum', nextColor: TIER_COLORS.Platinum };
  }
  return null; // Platinum -- already at the top!
}

// createServer() sets up our server, and tells it what to do
// every time a request comes in.
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(formPage);
  } else if (req.method === 'GET' && req.url === '/check') {
    res.writeHead(302, { Location: '/' });
    res.end();
  } else if (req.method === 'POST' && req.url === '/check') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const spend = Number(new URLSearchParams(body).get('spend')) || 0;
      const result = getTier(spend);
      const progress = getProgress(spend, result.tier);
      const progressColor = progress ? progress.nextColor : result.color;

      const progressHtml = progress
        ? `
          <div class="progress-wrap">
            <p class="progress-label">🎯 <strong>$${progress.remaining}</strong> away from <strong>${progress.nextTier}</strong></p>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress.percent}%; background: ${progressColor};"></div>
            </div>
          </div>
        `
        : `<p class="top-tier-msg">🎉 You've reached the top tier!</p>`;

      const shareText = `I'm a Cloudways ${result.tier} tier agency partner! 🎉`;

      const resultPage = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Your Partner Tier</title>
          <style>
            ${pageShell(`
              .card {
                background: white;
                padding: 44px 44px;
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.25);
                max-width: 520px;
                width: 90%;
                text-align: center;
                animation: fadeInUp 0.5s ease-out;
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .spend { color: #888; font-size: 14px; margin-bottom: 6px; }
              .tier-icon { font-size: 40px; margin-bottom: 4px; }
              .tier-badge {
                display: inline-block;
                font-size: 28px;
                font-weight: 800;
                color: white;
                background: ${result.color};
                padding: 10px 28px;
                border-radius: 30px;
                margin-bottom: 20px;
              }
              .progress-wrap {
                margin-bottom: 24px;
                background: linear-gradient(135deg, ${progressColor}22, ${progressColor}0a);
                border: 1px solid ${progressColor}55;
                border-radius: 12px;
                padding: 14px 16px;
              }
              .progress-label { font-size: 14px; color: #444; margin: 0 0 10px; }
              .progress-label strong { color: ${progressColor}; }
              .progress-track { background: #f0f0f0; border-radius: 10px; height: 10px; overflow: hidden; }
              .progress-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
              .top-tier-msg { font-size: 14px; color: #8e44ad; font-weight: 600; margin-bottom: 24px; }
              ul { text-align: left; list-style: none; padding: 0; margin: 0; }
              li { padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333; font-size: 15px; }
              li:last-child { border-bottom: none; }
              li::before { content: "✓ "; color: ${result.color}; font-weight: 700; }
              .connect-btn {
                display: block;
                width: 100%;
                margin-top: 24px;
                padding: 14px;
                background: #ff7a59;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 15px;
                font-family: inherit;
                cursor: pointer;
                text-decoration: none;
              }
              .connect-btn:hover { background: #f0673f; }
              .share-btn {
                display: block;
                width: 100%;
                margin-top: 10px;
                padding: 12px;
                background: white;
                color: #6b2d8c;
                border: 2px solid #e5e0f0;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
              }
              .share-btn:hover { border-color: #6b2d8c; }
              a.back { display: inline-block; margin-top: 20px; color: #ff7a59; text-decoration: none; font-weight: 600; font-size: 14px; }
              .confetti {
                position: fixed;
                top: -10px;
                width: 8px;
                height: 8px;
                opacity: 0.9;
                animation: fall linear forwards;
                z-index: 3;
              }
              @keyframes fall {
                to { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
              }
            `)}
          </style>
          <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
          <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
        </head>
        <body>
          ${bgShapesHtml}
          ${topLogoHtml}
          ${pageTitleHtml}
          <div class="card">
            <div class="tier-icon">${result.icon}</div>
            <p class="spend">Monthly spend: $${spend}</p>
            <div class="tier-badge">${result.tier}</div>
            ${progressHtml}
            <ul>
              ${result.benefits.map((b) => `<li>${b}</li>`).join('')}
            </ul>
            <button type="button" class="connect-btn" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/atahir-yts/let-s-connect'}); return false;">Connect with Partner Manager</button>
            <button class="share-btn" id="shareBtn">Share My Tier</button>
            <br />
            <a class="back" href="/">&larr; Check another amount</a>
          </div>
          ${footerHtml}
          <script>
            document.getElementById('shareBtn').addEventListener('click', function () {
              navigator.clipboard.writeText(${JSON.stringify(shareText)}).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => { this.textContent = 'Share My Tier'; }, 1500);
              });
            });

            const isPlatinum = ${result.tier === 'Platinum'};
            if (isPlatinum) {
              const colors = ['#ff7a59', '#f1c40f', '#8e44ad', '#6b2d8c', 'white'];
              for (let i = 0; i < 60; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.animationDuration = (2 + Math.random() * 2) + 's';
                piece.style.animationDelay = (Math.random() * 0.5) + 's';
                document.body.appendChild(piece);
                setTimeout(() => piece.remove(), 4500);
              }
            }
          </script>
        </body>
        </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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
