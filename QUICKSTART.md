# Quick Start Guide

Get the Contact Host Messaging component running in your app in 5 minutes.

## 1. Copy Files (30 seconds)

Copy these 3 files to your project:
```
ContactHostMessaging.jsx  → src/components/
ContactHostMessaging.css  → src/components/
ContactHostMessaging.d.ts → src/components/ (optional, TypeScript only)
```

## 2. Add Font (1 minute)

Add to your `public/index.html` in the `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

## 3. Use the Component (2 minutes)

```jsx
import React, { useState } from 'react';
import ContactHostMessaging from './components/ContactHostMessaging';

function ListingPage() {
  const [showModal, setShowModal] = useState(false);

  // Your listing data
  const listing = {
    id: 'listing123',
    title: 'Beautiful 2BR Apartment',
    hostId: 'host456',
    hostName: 'Jane Smith'
  };

  // Your current user (or null if not logged in)
  const currentUser = {
    id: 'user789',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };

  return (
    <div>
      <h1>{listing.title}</h1>

      <button onClick={() => setShowModal(true)}>
        Contact Host
      </button>

      <ContactHostMessaging
        listing={listing}
        currentUser={currentUser}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default ListingPage;
```

## 4. Create API Endpoint (2 minutes)

Create a simple endpoint at `POST /api/messages/send`:

### Express.js Example
```javascript
// routes/messages.js
router.post('/send', async (req, res) => {
  try {
    const { listingId, hostId, senderName, senderEmail, message } = req.body;

    // Save to database
    const newMessage = await db.messages.create({
      listingId,
      hostId,
      senderName,
      senderEmail,
      message,
      createdAt: new Date()
    });

    res.json({
      success: true,
      messageId: newMessage.id,
      timestamp: newMessage.createdAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

## 5. Test It!

1. Click "Contact Host" button
2. Fill out the form
3. Click "Send message"
4. See success confirmation

## That's It! 🎉

Your contact host messaging is now working!

## Next Steps

- [ ] Add email notifications (see README.md)
- [ ] Customize styling (see ContactHostMessaging.css)
- [ ] Add analytics tracking (see README.md)
- [ ] Run tests (see README.md)
- [ ] Review security checklist (see INTEGRATION_CHECKLIST.md)

## Common Issues

### Modal not appearing?
Check that `isOpen={showModal}` is set to `true`

### Form not submitting?
Check browser console for API errors. Ensure `/api/messages/send` endpoint exists.

### Styling looks wrong?
Ensure `ContactHostMessaging.css` is imported and DM Sans font is loaded.

### Guest users can't send messages?
Pass `null` for `currentUser` prop when user is not logged in.

## Need Help?

See detailed documentation in:
- `README.md` - Full documentation
- `ExampleUsage.jsx` - More usage examples
- `INTEGRATION_CHECKLIST.md` - Complete integration guide

---

**Happy Coding!** 🚀
