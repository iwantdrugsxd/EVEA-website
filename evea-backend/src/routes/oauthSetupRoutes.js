// evea-backend/src/routes/oauthSetupRoutes.js
// CREATE THIS NEW FILE for one-time OAuth setup

const express = require('express');
const router = express.Router();
const { getOAuthAuthUrl, getOAuthTokens } = require('../services/googleDriveService');

// Step 1: Start OAuth flow
router.get('/setup-google-auth', (req, res) => {
  try {
    console.log('🔧 Starting OAuth setup for Google Drive...');
    
    const authUrl = getOAuthAuthUrl();
    console.log('🔗 Redirecting to Google OAuth...');
    console.log('📋 Auth URL:', authUrl);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>EVEA - Google Drive OAuth Setup</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
          .container { text-align: center; }
          .btn { background: #4285f4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .btn:hover { background: #357ae8; }
          .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .step { margin: 10px 0; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔧 EVEA Google Drive OAuth Setup</h1>
          <div class="info">
            <p><strong>One-time setup required</strong></p>
            <p>This will allow EVEA to upload files to your personal Google Drive</p>
          </div>
          
          <div class="step">
            <h3>Step 1: Authenticate with Google</h3>
            <p>Click the button below to grant EVEA access to your Google Drive</p>
            <a href="${authUrl}" class="btn">🔗 Connect Google Drive</a>
          </div>
          
          <div class="step">
            <h3>What happens next:</h3>
            <p>1. You'll be redirected to Google</p>
            <p>2. Sign in with your Google account</p>
            <p>3. Grant permission to access Google Drive</p>
            <p>4. You'll be redirected back with a refresh token</p>
            <p>5. Add the token to your .env file</p>
            <p>6. Restart your server</p>
          </div>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ OAuth setup error:', error);
    res.status(500).json({
      error: 'Failed to start OAuth setup',
      message: error.message
    });
  }
});

// Step 2: Handle OAuth callback
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    if (error) {
      console.error('❌ OAuth error:', error);
      return res.status(400).send(`
        <h1>❌ OAuth Error</h1>
        <p>Error: ${error}</p>
        <p><a href="/setup-google-auth">Try again</a></p>
      `);
    }
    
    if (!code) {
      return res.status(400).send(`
        <h1>❌ No Authorization Code</h1>
        <p>No authorization code received from Google</p>
        <p><a href="/setup-google-auth">Try again</a></p>
      `);
    }
    
    console.log('🔑 Received authorization code, exchanging for tokens...');
    
    // Exchange code for tokens
    const tokens = await getOAuthTokens(code);
    
    console.log('✅ OAuth tokens received successfully!');
    console.log('🔑 Access token:', tokens.access_token ? 'Received' : 'Missing');
    console.log('🔄 Refresh token:', tokens.refresh_token ? 'Received' : 'Missing');
    
    if (!tokens.refresh_token) {
      return res.status(400).send(`
        <h1>⚠️ Missing Refresh Token</h1>
        <p>No refresh token received. This usually means:</p>
        <ul>
          <li>You've already authorized this app before</li>
          <li>The consent screen wasn't shown</li>
        </ul>
        <p><strong>Solution:</strong></p>
        <ol>
          <li>Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a></li>
          <li>Remove "EVEA Document Upload" app</li>
          <li>Try the setup again</li>
        </ol>
        <p><a href="/setup-google-auth">Start Over</a></p>
      `);
    }
    
    // Success! Show the refresh token
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>EVEA - OAuth Setup Complete</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .container { text-align: center; }
          .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .token-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; font-family: monospace; word-break: break-all; text-align: left; }
          .step { margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 5px; text-align: left; }
          .copy-btn { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ OAuth Setup Complete!</h1>
          
          <div class="success">
            <h3>🎉 Google Drive Connected Successfully!</h3>
            <p>Your refresh token has been generated</p>
          </div>
          
          <div class="step">
            <h3>📝 Step 1: Copy Your Refresh Token</h3>
            <p>Copy this refresh token and add it to your .env file:</p>
            <div class="token-box" id="refreshToken">
              GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
            </div>
            <button class="copy-btn" onclick="copyToken()">📋 Copy Token</button>
          </div>
          
          <div class="step">
            <h3>⚙️ Step 2: Update Your .env File</h3>
            <p>Add this line to your <code>evea-backend/.env</code> file:</p>
            <div class="token-box">
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
            </div>
          </div>
          
          <div class="step">
            <h3>🔄 Step 3: Restart Your Server</h3>
            <p>Stop your backend server (Ctrl+C) and start it again</p>
            <p>The OAuth authentication is now complete!</p>
          </div>
          
          <div class="step">
            <h3>🧪 Step 4: Test</h3>
            <p>Try uploading documents in vendor registration - it should work now!</p>
          </div>
        </div>
        
        <script>
          function copyToken() {
            const tokenText = document.getElementById('refreshToken').textContent;
            navigator.clipboard.writeText(tokenText).then(() => {
              alert('Refresh token copied to clipboard!');
            });
          }
        </script>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.status(500).send(`
      <h1>❌ OAuth Setup Failed</h1>
      <p>Error: ${error.message}</p>
      <p><a href="/setup-google-auth">Try again</a></p>
    `);
  }
});

// OAuth status check
router.get('/oauth-status', (req, res) => {
  const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
  const hasClientId = !!process.env.GOOGLE_OAUTH_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  
  res.json({
    oauthConfigured: hasClientId && hasClientSecret,
    refreshTokenSet: hasRefreshToken,
    needsSetup: !hasRefreshToken,
    setupUrl: hasClientId && hasClientSecret ? '/setup-google-auth' : null,
    status: hasRefreshToken ? 'Ready' : 'Needs Setup'
  });
});

module.exports = router;