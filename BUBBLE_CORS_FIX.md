# Fixing CORS Error for Contact Host Messaging

## The Problem

You're seeing this error in the console:

```
Access to fetch at 'https://splitlease.com/version-test/api/1.1/wf/send-message'
from origin 'https://splitlease.app' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This is a **CORS (Cross-Origin Resource Sharing)** error. It happens because:
- Your search page is hosted on: `https://splitlease.app`
- Your Bubble API is hosted on: `https://splitlease.com`
- Browsers block cross-origin requests by default for security

## The Solution

You need to enable CORS in your Bubble application to allow requests from `splitlease.app`.

### Step 1: Access Bubble API Settings

1. Log into your Bubble editor at: `https://bubble.io/`
2. Open your Split Lease application
3. Navigate to: **Settings** → **API**

### Step 2: Enable CORS

In the API settings page:

1. Scroll down to the **"API Workflows"** section
2. Look for **"Enable API Workflows"** - make sure this is checked ✅
3. Find the **"CORS Settings"** or **"Allow requests from"** option
4. Add your domain(s):
   ```
   https://splitlease.app
   https://www.splitlease.app
   ```

### Step 3: Configure Workflow Permissions

1. Go to **Backend workflows** in Bubble
2. Find your `send-message` workflow
3. Under **Expose as a public API endpoint**, make sure:
   - ✅ Checkbox is enabled
   - ✅ "Use as a public API endpoint" is ON
   - ✅ "Allow access from other domains" is enabled

### Step 4: Test the Fix

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Refresh the search_lite page
3. Click "Message" on any listing
4. Fill out the form and click "Send message"
5. Check the console - you should see:
   ```
   ✅ Message sent successfully
   ```

## Alternative Solution: Use a Backend Proxy

If CORS continues to be an issue, you can create a backend proxy:

### Option A: Cloudflare Worker

Create a Cloudflare Worker to proxy requests:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Only proxy POST requests to /api/send-message
  if (request.method === 'POST' && url.pathname === '/api/send-message') {
    const body = await request.json()

    const response = await fetch('https://splitlease.com/version-test/api/1.1/wf/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BUBBLE_API_KEY}` // Store as environment variable
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://splitlease.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  return new Response('Not found', { status: 404 })
}
```

Then update the component to call your Cloudflare Worker instead:

```javascript
const bubbleApiUrl = 'https://splitlease.app/api/send-message';
```

### Option B: Express.js Proxy

If you have a Node.js backend:

```javascript
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'https://splitlease.app' }));
app.use(express.json());

app.post('/api/send-message', async (req, res) => {
  try {
    const response = await fetch('https://splitlease.com/version-test/api/1.1/wf/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BUBBLE_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## Current Workaround: Demo Mode

Until CORS is fixed, the component runs in **demo mode**:

- ✅ Modal opens correctly
- ✅ Form validation works
- ✅ Success message displays
- ⚠️ Messages are NOT actually sent to Bubble
- ⚠️ Console shows: "DEMO MODE: Bubble API key not configured"

To enable **production mode** with real API calls:

1. Fix CORS settings in Bubble (see above)
2. Verify `window.ENV.BUBBLE_API_KEY` is set
3. Test again - should work without errors

## Troubleshooting

### "Failed to fetch" Error Persists

**Check these things:**

1. **CORS is enabled** in Bubble Settings → API
2. **Domain is whitelisted**: `https://splitlease.app` (include https://)
3. **API workflow is public** and exposed
4. **Clear browser cache** after making changes
5. **Check Bubble logs** for any error messages

### "Host ID: undefined" Warning

The console shows `Host ID: undefined` - this means the listing data doesn't include host information.

**To fix:**

1. Update your Bubble database listing records to include host/creator information
2. Or modify the API response to include the `Created By` field
3. The component will fallback to `'unknown-host'` for now

### Messages Not Appearing in Bubble

**Verify:**

1. The workflow endpoint URL is correct: `/api/1.1/wf/send-message`
2. The workflow creates a database record
3. Check Bubble's **Server logs** for workflow execution
4. Ensure all required fields are mapped correctly

## Support

If you continue to experience issues:

1. Check browser console for detailed error messages
2. Review Bubble server logs (Settings → Logs)
3. Verify API key is correct and active
4. Test the Bubble workflow directly using Postman or curl
5. Contact Bubble support for CORS configuration help

---

**Last Updated:** October 19, 2025
**Related Files:**
- `components/ContactHost/contact-host-messaging.js`
- `BUBBLE_WORKFLOW_INTEGRATION.md`
