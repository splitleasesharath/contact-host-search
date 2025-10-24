# Testing with Bubble Backend - Complete Guide

## 🎯 What Just Happened

I've created **TWO** preview files for you:

1. **`preview-local.html`** - Mock API testing (no real messages sent)
2. **`preview-bubble-live.html`** ⭐ **NEW** - Real Bubble API integration

---

## 🚀 Quick Start - Test with Real Bubble Backend

### Step 1: Open the Live Preview
The file should have just opened in your browser: `preview-bubble-live.html`

### Step 2: Configure Your Bubble Endpoint (IMPORTANT!)

Open `preview-bubble-live.html` in a text editor and find **line 24**:

```javascript
window.ENV = {
    BUBBLE_API_BASE_URL: 'https://app.split.lease/version-test/api/1.1',
    BUBBLE_MESSAGING_ENDPOINT: 'https://app.split.lease/version-test/api/1.1/wf/core-contact-host-send-message',
    BUBBLE_API_KEY: '05a7a0d1d2400a0b574acd99748e07a0'
};
```

**Check these values:**
- ✅ Is the `BUBBLE_MESSAGING_ENDPOINT` URL correct?
- ✅ Is your Bubble workflow named `core-contact-host-send-message`?
- ✅ Is the API key valid?

### Step 3: Enable CORS in Bubble (CRITICAL!)

Your Bubble backend MUST allow requests from `file://` origins for local testing.

**In Bubble:**
1. Go to **Settings** → **API**
2. Find **"CORS & origins"** or **"Allow requests from"**
3. Add:
   ```
   *
   ```
   (For production, replace `*` with specific domains)

4. Make sure your workflow is set to **"Expose as a public API endpoint"**

### Step 4: Test!

1. Refresh the page after making changes
2. Watch the **console output** at the bottom
3. You should see:
   ```
   ✅ Bubble API endpoint configured!
   🔗 Endpoint: https://app.split.lease/...
   📡 Ready to send messages to your Bubble backend.
   ```

4. Click **"Contact Host"**
5. Fill out the form
6. Click **"Send message"**
7. Watch the live console logs

---

## 🔍 Understanding the Console Output

### Demo Mode (Endpoint Not Configured)
```
⚠️ WARNING: Bubble endpoint not configured!
📋 Using DEMO MODE - No actual message will be sent
📤 Demo data: {...}
✅ Demo mode: Message would be sent successfully
```

### Live Mode (Endpoint Configured)
```
📡 Calling REAL Bubble API...
🔗 Endpoint: https://app.split.lease/version-test/api/1.1/wf/core-contact-host-send-message
📤 Payload: {
  "listing_unique_id": "listing123",
  "message_body": "Test message",
  "sender_email": "test@example.com",
  "sender_name": "Test User"
}
📨 Response status: 200
📥 Response data: {...}
✅ Message sent successfully to Bubble!
```

### CORS Error
```
❌ Network error: Failed to fetch
💡 Check CORS settings in Bubble
```

---

## 🐛 Troubleshooting

### Issue 1: Still in Demo Mode
**Symptoms:**
- Badge shows "🔴 DEMO MODE"
- Console says "Bubble endpoint not configured"

**Solution:**
1. Check that `window.ENV.BUBBLE_MESSAGING_ENDPOINT` is set (not null or empty)
2. Refresh the page (Ctrl+R or Cmd+R)
3. Clear browser cache if needed

---

### Issue 2: CORS Error
**Symptoms:**
```
❌ Network error: Failed to fetch
💡 Check CORS settings in Bubble
```

**Solution:**

**Option A: Enable CORS in Bubble (Recommended for Testing)**
1. In Bubble: Settings → API
2. Under CORS settings, add `*` to allow all origins
3. For production, replace with your actual domain

**Option B: Use a Local Server**
Instead of opening the HTML file directly:
```bash
cd "C:\Users\Split Lease\My Drive\!Agent Context and Tools\SL16\message-host-component"
npx http-server -p 8080 --cors
```
Then open: `http://localhost:8080/preview-bubble-live.html`

---

### Issue 3: 404 Not Found
**Symptoms:**
```
📨 Response status: 404
❌ Bubble API error: Endpoint not found
```

**Solution:**
1. Verify the workflow URL in Bubble
2. Check that the workflow is published (not in development)
3. Ensure the workflow name matches exactly: `core-contact-host-send-message`

---

### Issue 4: 401 Unauthorized
**Symptoms:**
```
📨 Response status: 401
❌ Bubble API error: Unauthorized
```

**Solution:**
1. Check your API key is correct
2. Verify API workflows are enabled in Bubble Settings
3. Make sure the workflow doesn't require authentication

---

### Issue 5: Messages Not Appearing in Bubble
**Symptoms:**
- Gets 200 response
- But no message in database

**Solution:**
1. Check your Bubble workflow actions
2. Verify the workflow creates a database record
3. Check Bubble server logs (Settings → Logs)
4. Make sure field mappings are correct

---

## 📋 Bubble Workflow Checklist

Your Bubble workflow should:

### Parameters (API expects these)
- [ ] `listing_unique_id` (text) - Required
- [ ] `message_body` (text) - Required
- [ ] `sender_email` (text) - Optional
- [ ] `sender_name` (text) - Required

### Actions
- [ ] Create new "Message" record in database
- [ ] Send email notification to host (optional)
- [ ] Return JSON response with `success: true`

### Settings
- [ ] Workflow is set to "Public" or properly authenticated
- [ ] CORS is enabled for your domain
- [ ] API workflows are enabled in Settings

---

## 🔄 What Gets Sent to Bubble

```json
{
  "listing_unique_id": "listing123",
  "message_body": "I'm interested in this property...",
  "sender_email": "user@example.com",
  "sender_name": "John Doe"
}
```

### Field Mapping

| React Component Field | Bubble Parameter      | Type   |
|-----------------------|-----------------------|--------|
| `listing.id`          | `listing_unique_id`   | string |
| `formData.messageBody`| `message_body`        | string |
| `formData.email`      | `sender_email`        | string |
| `formData.userName`   | `sender_name`         | string |

---

## ✅ Successful Test Checklist

After sending a test message, verify:

- [ ] Console shows "✅ Message sent successfully to Bubble!"
- [ ] Response status is 200
- [ ] No CORS errors
- [ ] Message appears in Bubble database
- [ ] Host receives email (if configured)
- [ ] No JavaScript errors in browser console

---

## 🎨 Differences from Mock Preview

| Feature | `preview-local.html` | `preview-bubble-live.html` |
|---------|---------------------|----------------------------|
| API Calls | Mock/Simulated | Real Bubble API |
| Messages Saved | No | Yes (if configured) |
| Success Rate | 90% simulated | Real responses |
| Console Logs | Basic | Detailed with real responses |
| CORS Required | No | Yes |
| Configuration | None | Bubble endpoint required |

---

## 📝 Next Steps

1. ✅ Test with the live preview
2. ✅ Verify messages appear in Bubble
3. ✅ Check email notifications work
4. ✅ Test both guest and logged-in user flows
5. 🔄 Fix any issues using this guide
6. 🔄 Deploy to your production site

---

## 🆘 Still Having Issues?

### Check These Files:
1. `BUBBLE_WORKFLOW_INTEGRATION.md` - Complete Bubble setup guide
2. `BUBBLE_CORS_FIX.md` - CORS troubleshooting
3. `SETUP_MESSAGING_ENDPOINT.md` - Endpoint configuration

### Browser Console (F12):
- Look for red errors
- Check Network tab for failed requests
- Verify request payload matches expected format

### Bubble Logs:
- Settings → Logs → Server logs
- Look for incoming API requests
- Check for workflow errors

---

## 🎉 Success!

When everything works, you'll see:
- 🟢 **LIVE MODE** badge
- ✅ Success messages in console
- 📧 Messages in Bubble database
- 😊 Happy users contacting hosts!

---

**Last Updated:** October 24, 2025
**Component Version:** 1.0.0
