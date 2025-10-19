# Bubble Workflow Integration Guide

## Overview

The Contact Host Messaging component integrates with Bubble.io's backend API to send messages from the search_lite page to property hosts. This document outlines the Bubble workflow configuration required for the integration.

## API Endpoint

**Workflow URL:** `https://app.split.lease/version-test/api/1.1/wf/core-contact-host-send-message`

**Method:** `POST`

**Authentication:** Bearer token (API Key)

## Environment Configuration

The component expects a Bubble API key to be configured in your environment. Add this to your `index.html` or configuration file:

```html
<script>
  window.ENV = {
    BUBBLE_API_KEY: 'your-bubble-api-key-here'
  };
</script>
```

**Security Note:** For production, store the API key securely and do not expose it in client-side code. Consider using a serverless function or backend proxy to handle API calls.

## Request Payload

The component sends the following data structure to the Bubble workflow:

```json
{
  "listing_unique_id": "string", // Unique ID of the property listing
  "message_body": "string",      // The message content
  "sender_email": "string",      // Email of the message sender
  "sender_name": "string"        // Name of the message sender
}
```

## Bubble Workflow Setup

### Step 1: Create API Workflow

1. In Bubble, go to **API Workflows**
2. Create a new workflow endpoint: `core-contact-host-send-message`
3. Set the workflow to **Public** (or use authentication if preferred)
4. Configure the following parameters:

| Parameter          | Type   | Required | Description                          |
|--------------------|--------|----------|--------------------------------------|
| listing_unique_id  | text   | Yes      | Listing unique identifier            |
| message_body       | text   | Yes      | Message content                      |
| sender_email       | text   | Yes      | Email of message sender              |
| sender_name        | text   | Yes      | Name of message sender               |

### Step 2: Create Database Table

Create a **Messages** table in Bubble with the following fields:

| Field Name       | Type              | Description                                |
|------------------|-------------------|--------------------------------------------|
| Listing          | Listing (relation)| Related listing object                     |
| Host             | User (relation)   | Message recipient (host)                   |
| Sender           | User (relation)   | Sender if logged in (optional)             |
| Sender Name      | text              | Name of sender                             |
| Sender Email     | text              | Email of sender (for guest messages)       |
| Subject          | text              | Message subject line                       |
| Message Body     | text              | The message content                        |
| Timestamp        | date              | When the message was sent                  |
| Is Guest Message | yes/no            | True if sender is not logged in            |
| Status           | text              | Message status (sent, read, replied, etc.) |
| Created Date     | date              | Auto-generated creation timestamp          |

### Step 3: Configure Workflow Actions

In your `send-message` workflow, add the following actions:

#### Action 1: Create a new thing (Message)

```
Type: Messages
Fields:
  - Listing = Do a search for Listings: unique id = listing_id:first item
  - Host = Do a search for Users: unique id = host_id:first item
  - Sender = Do a search for Users: unique id = user_id:first item (if user_id is not empty)
  - Sender Name = sender_name
  - Sender Email = sender_email
  - Subject = subject
  - Message Body = message
  - Timestamp = Convert text to date (timestamp)
  - Is Guest Message = user_id is empty
  - Status = "sent"
```

#### Action 2: Send email to host

```
To: Result of Step 1's Host's email
From: noreply@split.lease
Subject: New message about [Result of Step 1's Listing's Name]
Body:
  Hi [Result of Step 1's Host's First Name],

  You have received a new message about your listing "[Result of Step 1's Listing's Name]":

  From: [sender_name] ([sender_email])
  Subject: [subject]

  Message:
  [message]

  Reply to this message through your Split Lease dashboard:
  [Link to dashboard]

  Best,
  Split Lease Team
```

#### Action 3: Return data (optional)

Return the following JSON response:

```json
{
  "success": true,
  "message_id": "<Result of Step 1's unique id>",
  "timestamp": "<Current date/time>"
}
```

### Step 4: Set up API Key

1. Go to **Settings → API**
2. Enable **API workflows**
3. Generate an **API Key** for authentication
4. Copy the key and add it to your `window.ENV.BUBBLE_API_KEY` configuration

## Component Integration Points

### How Listing Data is Passed

When a user clicks the "Message" button on a listing card:

1. The button has `onclick="openContactHostModal('${listing.id}')"`
2. The `openContactHostModal()` function finds the listing object by ID
3. The listing object contains:
   - `listing.id` - Unique listing identifier
   - `listing.host.id` or `listing['Created By']` - Host user ID
   - `listing.title` or `listing.Name` - Listing title (used as subject)
4. The component opens with pre-filled data

### User Authentication

The component supports both logged-in users and guests:

**Logged-in users:**
- `window.currentUser` is set with user data
- User name and email are pre-filled from `currentUser`
- `user_id` is sent to Bubble for linking the message to the user account

**Guest users:**
- `window.currentUser` is `null`
- User must enter their name and email manually
- `user_id` is `null` in the API payload
- Guest messages are marked with `Is Guest Message = true`

### Form Validation

The component validates:
- **Name**: Required for all users
- **Email**: Required for guest users, must be valid email format
- **Message**: Required, minimum 10 characters

## Testing the Integration

### Test Checklist

- [ ] API endpoint is accessible at `https://splitlease.com/version-test/api/1.1/wf/send-message`
- [ ] API key is correctly configured in `window.ENV.BUBBLE_API_KEY`
- [ ] Bubble workflow creates a new Message record
- [ ] Email notification is sent to the host
- [ ] Message appears in host's dashboard
- [ ] Guest messages (user_id = null) work correctly
- [ ] Logged-in user messages work correctly
- [ ] Error handling works (invalid listing, network errors, etc.)

### Manual Test Steps

1. **Open search_lite page**: `http://localhost:8000`
2. **Click "Message" button** on any listing card
3. **Fill out the form**:
   - Enter your name (if not logged in)
   - Enter your email (if not logged in)
   - Write a message (at least 10 characters)
4. **Click "Send message"**
5. **Verify**:
   - Success message appears
   - Message is saved in Bubble database
   - Host receives email notification
   - No console errors

### Testing with Console Logs

The component includes detailed console logging. Open browser DevTools and look for:

```
✅ Contact Host Messaging initialized
📧 Opening contact host modal for listing: <listing-id>
📤 Sending message to Bubble API...
Listing ID: <listing-id>
Host ID: <host-id>
📡 Calling Bubble workflow: <url>
✅ Bubble API response: <response-data>
✅ Message sent successfully
```

## Troubleshooting

### Common Issues

**Issue:** "Bubble API configuration not found"
- **Solution:** Ensure `window.ENV.BUBBLE_API_KEY` is set before the component loads

**Issue:** "Bubble API error: 401"
- **Solution:** Check that the API key is correct and the API workflow is enabled

**Issue:** "Bubble API error: 404"
- **Solution:** Verify the workflow URL is correct: `/version-test/api/1.1/wf/send-message`

**Issue:** Modal doesn't open when clicking "Message"
- **Solution:** Check that `window.contactHostMessaging` is initialized. Look for "✅ Contact Host Messaging initialized" in console

**Issue:** Listing or host not found in Bubble
- **Solution:** Ensure listing IDs and host IDs match between search_lite data and Bubble database

## Security Considerations

1. **API Key Protection**: Do not expose API keys in client-side code for production
2. **Rate Limiting**: Implement rate limiting on the Bubble workflow to prevent spam
3. **Input Sanitization**: Bubble automatically sanitizes input, but validate on the backend
4. **Email Validation**: Verify email addresses are valid before sending
5. **CORS**: Ensure CORS is properly configured on Bubble API endpoints

## Production Deployment

For production deployment:

1. **Use environment variables** for API keys
2. **Implement a backend proxy** to hide API keys from client
3. **Enable HTTPS** for all API calls
4. **Add reCAPTCHA** to prevent spam messages
5. **Monitor API usage** and set up alerts
6. **Test thoroughly** with both logged-in and guest users

## Support

For issues or questions:
- Check Bubble workflow logs in the API section
- Review browser console for error messages
- Verify API key permissions and endpoint configuration
- Contact Split Lease development team

---

**Last Updated:** October 19, 2025
**Component Version:** 1.0.0
**Bubble API Version:** 1.1
