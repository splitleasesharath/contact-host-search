# Setting Up the Messaging Workflow Endpoint

## Current Status

The Contact Host Messaging component is currently running in **DEMO MODE** because the Bubble workflow endpoint has not been configured yet.

**What this means:**
- ✅ The modal opens and works perfectly
- ✅ Form validation is functional
- ✅ Success confirmation displays
- ⚠️ Messages are NOT actually sent to Bubble (simulated only)

## How to Enable Production Mode

Once you create your Bubble backend workflow, follow these steps:

### Step 1: Create the Bubble Workflow

1. Log into Bubble.io
2. Navigate to **Backend workflows**
3. Create a new workflow endpoint
4. Configure it according to `BUBBLE_WORKFLOW_INTEGRATION.md`
5. Copy the full workflow URL

**Example URL format:**
```
https://upgradefromstr.bubbleapps.io/version-test/api/1.1/wf/send-host-message
```

### Step 2: Update the Configuration

**Option A: Edit config.js (Recommended for Production)**

Open `js/config.js` and update line 24:

```javascript
BUBBLE_MESSAGING_ENDPOINT: null  // Current (demo mode)
```

Change to:

```javascript
BUBBLE_MESSAGING_ENDPOINT: 'https://your-bubble-app.bubbleapps.io/version-test/api/1.1/wf/YOUR-WORKFLOW-NAME'
```

**Full example:**

```javascript
window.ENV = {
    GOOGLE_MAPS_API_KEY: 'AIzaSyCFcO3jCTvR69iA4UAxPi-sWHJ7zWPMJWo',
    BUBBLE_API_KEY: '05a7a0d1d2400a0b574acd99748e07a0',
    BUBBLE_API_BASE_URL: 'https://upgradefromstr.bubbleapps.io/version-test/api/1.1',
    BUBBLE_MESSAGING_ENDPOINT: 'https://upgradefromstr.bubbleapps.io/version-test/api/1.1/wf/send-host-message'
};
```

**Option B: Browser Console (Quick Test)**

For quick testing without editing files:

```javascript
window.ENV.BUBBLE_MESSAGING_ENDPOINT = 'https://your-workflow-url-here';
```

Then refresh the page and test.

### Step 3: Enable CORS in Bubble

**IMPORTANT:** You must enable CORS for the workflow to accept requests from your domain.

1. In Bubble, go to **Settings** → **API**
2. Under **"CORS Settings"** or **"Allow requests from"**, add:
   ```
   https://splitlease.app
   https://www.splitlease.app
   ```
3. Make sure the workflow is set to **"Expose as a public API endpoint"**

See `BUBBLE_CORS_FIX.md` for detailed CORS setup instructions.

### Step 4: Test the Integration

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh the page: `https://splitlease.app`
3. Click "Message" on any listing card
4. Fill out the form
5. Click "Send message"
6. Check the console - you should see:
   ```
   📡 Calling Bubble workflow: https://your-workflow-url-here
   ✅ Bubble API response: {...}
   ✅ Message sent successfully
   ```

## Workflow Payload Reference

The component sends this JSON payload to your workflow:

```json
{
  "listing_id": "string",
  "host_id": "string",
  "sender_name": "string",
  "sender_email": "string",
  "subject": "string",
  "message": "string",
  "user_id": "string or null",
  "timestamp": "ISO 8601 string"
}
```

**Field Details:**

| Field         | Type   | Description                                    |
|---------------|--------|------------------------------------------------|
| listing_id    | string | Unique ID of the listing from your database    |
| host_id       | string | ID of the host/property owner                  |
| sender_name   | string | Name entered by the sender                     |
| sender_email  | string | Email (for guest users)                        |
| subject       | string | Usually the listing title                      |
| message       | string | The message content                            |
| user_id       | string | ID if user is logged in, null for guests       |
| timestamp     | string | ISO 8601 timestamp (e.g., "2025-10-19T15:30:00.000Z") |

## Expected Response

Your Bubble workflow should return JSON like this:

```json
{
  "success": true,
  "message_id": "unique-message-id",
  "timestamp": "2025-10-19T15:30:00.000Z"
}
```

Or for errors:

```json
{
  "success": false,
  "message": "Error description here"
}
```

## Console Messages

**Demo Mode (Current):**
```
⚠️ DEMO MODE: Bubble workflow endpoint not configured
📋 To enable production mode, set window.ENV.BUBBLE_MESSAGING_ENDPOINT
📧 Simulating message send...
✅ Demo mode: Message would be sent successfully
```

**Production Mode (After Setup):**
```
📡 Calling Bubble workflow: https://your-workflow-url
✅ Bubble API response: {...}
✅ Message sent successfully
```

## Troubleshooting

### Still in Demo Mode After Setting Endpoint

**Check:**
1. `window.ENV.BUBBLE_MESSAGING_ENDPOINT` is not null
2. You refreshed the page after updating config.js
3. The endpoint URL is a valid URL (starts with https://)

### CORS Error

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Fix:**
See `BUBBLE_CORS_FIX.md` for complete CORS configuration steps.

### Workflow Not Found (404)

**Check:**
1. The workflow URL is correct
2. The workflow is published (not in development mode)
3. The workflow is set to "Expose as a public API endpoint"

### Messages Not Saving

**Check:**
1. Bubble workflow is configured to create database records
2. All required fields are mapped correctly
3. Check Bubble server logs (Settings → Logs)

## Quick Reference

**Files to check:**
- `js/config.js` - Main configuration file
- `components/ContactHost/contact-host-messaging.js` - Component code
- `BUBBLE_WORKFLOW_INTEGRATION.md` - Full workflow setup guide
- `BUBBLE_CORS_FIX.md` - CORS troubleshooting

**Where the endpoint is used:**
- Line 390-391 in `contact-host-messaging.js`

**To switch back to demo mode:**
```javascript
window.ENV.BUBBLE_MESSAGING_ENDPOINT = null;
```

---

**Ready to test?** Just share your Bubble workflow URL and update `config.js`!

**Last Updated:** October 19, 2025
