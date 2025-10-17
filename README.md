# Contact Host Messaging Component

A fully-featured React modal component for enabling users (both logged-in and guests) to contact property hosts from listing pages. Converted from Bubble.io reusable element with exact styling and functionality.

## Features

- **Multi-view state management** - 4 distinct views (contact form, success, provide email, require signup)
- **Form validation** - Client-side validation with user-friendly error messages
- **Guest support** - Non-logged-in users can send messages with email
- **Logged-in user experience** - Pre-filled forms and streamlined messaging
- **Success confirmation** - Clear feedback when messages are sent
- **Sign-up prompts** - Encourages guest users to create accounts
- **Accessibility** - Full keyboard navigation and ARIA labels
- **Responsive design** - Mobile-optimized with 328px width
- **Exact styling** - Matches Bubble component design (#6D31C2 purple theme, DM Sans font)

## Installation

1. Copy the following files to your project:
   - `ContactHostMessaging.jsx`
   - `ContactHostMessaging.css`
   - `ContactHostMessaging.d.ts` (optional, for TypeScript)

2. Install DM Sans font if not already available:

```html
<!-- Add to your HTML head -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

Or via CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
```

## Quick Start

```jsx
import React, { useState } from 'react';
import ContactHostMessaging from './ContactHostMessaging';

function ListingCard({ listing, currentUser }) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowContactModal(true)}>
        Contact Host
      </button>

      <ContactHostMessaging
        listing={listing}
        currentUser={currentUser}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}
```

## Props

### `listing` (required)
Object containing listing information.

```typescript
{
  id: string;           // Unique listing identifier
  title: string;        // Listing title
  hostId: string;       // Host's unique identifier
  hostName: string;     // Host's display name
}
```

### `currentUser` (required)
Current user object if logged in, `null` if guest.

```typescript
{
  id: string;           // Unique user identifier
  firstName: string;    // User's first name
  lastName: string;     // User's last name
  email: string;        // User's email address
} | null
```

### `isOpen` (required)
Boolean controlling modal visibility.

### `onClose` (required)
Callback function invoked when the modal should close.

## API Integration

The component expects an API endpoint for sending messages:

### Endpoint
```
POST /api/messages/send
```

### Request Body
```json
{
  "listingId": "string",
  "hostId": "string",
  "senderName": "string",
  "senderEmail": "string",
  "subject": "string",
  "message": "string",
  "userId": "string | null",
  "timestamp": "ISO 8601 date string"
}
```

### Success Response (200)
```json
{
  "success": true,
  "messageId": "msg_123456",
  "timestamp": "2025-10-17T10:30:00Z"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Error description"
}
```

## Backend Implementation Examples

### Node.js/Express Example

```javascript
// routes/messages.js
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');
const Message = require('../models/Message');

router.post('/send', async (req, res) => {
  try {
    const {
      listingId,
      hostId,
      senderName,
      senderEmail,
      subject,
      message,
      userId,
      timestamp
    } = req.body;

    // Validation
    if (!listingId || !hostId || !senderName || !senderEmail || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create message record
    const newMessage = await Message.create({
      listingId,
      hostId,
      senderId: userId,
      senderName,
      senderEmail,
      subject,
      body: message,
      status: 'unread',
      createdAt: timestamp
    });

    // Get host email
    const host = await User.findById(hostId);

    // Send email notification to host
    await sendEmail({
      to: host.email,
      subject: `New message about ${subject}`,
      template: 'host-message-notification',
      data: {
        hostName: host.firstName,
        senderName,
        senderEmail,
        subject,
        message,
        listingTitle: subject,
        messageUrl: `${process.env.APP_URL}/messages/${newMessage.id}`
      }
    });

    // Send confirmation email to sender
    await sendEmail({
      to: senderEmail,
      subject: 'Message sent confirmation',
      template: 'sender-confirmation',
      data: {
        senderName,
        hostName: host.firstName,
        listingTitle: subject
      }
    });

    res.status(200).json({
      success: true,
      messageId: newMessage.id,
      timestamp: newMessage.createdAt
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
```

### Python/Django Example

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import Message, Listing, User
from .utils import send_email
import json
from datetime import datetime

@csrf_exempt
@require_http_methods(["POST"])
def send_message(request):
    try:
        data = json.loads(request.body)

        # Validation
        required_fields = ['listingId', 'hostId', 'senderName', 'senderEmail', 'message']
        if not all(field in data for field in required_fields):
            return JsonResponse({
                'success': False,
                'message': 'Missing required fields'
            }, status=400)

        # Create message
        message = Message.objects.create(
            listing_id=data['listingId'],
            host_id=data['hostId'],
            sender_id=data.get('userId'),
            sender_name=data['senderName'],
            sender_email=data['senderEmail'],
            subject=data.get('subject', ''),
            body=data['message'],
            status='unread',
            created_at=data.get('timestamp', datetime.now().isoformat())
        )

        # Get host
        host = User.objects.get(id=data['hostId'])
        listing = Listing.objects.get(id=data['listingId'])

        # Send email to host
        send_email(
            to=host.email,
            subject=f"New message about {listing.title}",
            template='host_message_notification',
            context={
                'host_name': host.first_name,
                'sender_name': data['senderName'],
                'sender_email': data['senderEmail'],
                'message': data['message'],
                'listing_title': listing.title,
                'message_url': f"{settings.APP_URL}/messages/{message.id}"
            }
        )

        # Send confirmation to sender
        send_email(
            to=data['senderEmail'],
            subject='Message sent confirmation',
            template='sender_confirmation',
            context={
                'sender_name': data['senderName'],
                'host_name': host.first_name,
                'listing_title': listing.title
            }
        )

        return JsonResponse({
            'success': True,
            'messageId': str(message.id),
            'timestamp': message.created_at.isoformat()
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
```

## Component States

The component manages four distinct views:

### 1. Contact Form (`contactForm`)
- Initial view where users compose their message
- Shows name input (pre-filled if logged in)
- Email input for guests only
- Message textarea
- Sign-up link for guests
- Send button

### 2. Success (`success`)
- Displayed after successful message submission
- Shows confirmation message
- "Done" button to close modal

### 3. Provide Email (`provideEmail`)
- Prompts guest users to provide contact method
- "Email" button - returns to form with email field focused
- "Private Message" button - leads to signup prompt

### 4. Require Signup (`requireSignup`)
- Shown when guest tries to send private message
- Explains account requirement
- "Sign Up" button - redirects to registration
- "Go Back" button - returns to contact form

## Styling Customization

The component uses CSS variables for easy theming:

```css
.contact-host-modal {
  /* Override these in your global CSS */
  --primary-purple: #6D31C2;
  --text-dark: #4A4A4A;
  --text-gray: #6B6B6B;
  --border-gray: #6B6B6B;
  --white: #FFFFFF;
  --error-red: #FF0000;
}
```

### Example Custom Theme

```css
/* In your global CSS or component wrapper */
.custom-theme .contact-host-modal {
  --primary-purple: #FF6B35;  /* Orange theme */
  --text-dark: #2C3E50;
  border-radius: 8px;  /* Rounded corners */
}
```

## Accessibility Features

- **Keyboard Navigation** - Full support for tab, enter, and escape keys
- **ARIA Labels** - Proper labeling for screen readers
- **Focus Management** - Automatic focus on modal open/close
- **Error Announcements** - Screen reader announcements for validation errors
- **High Contrast Mode** - Enhanced borders in high contrast mode
- **Reduced Motion** - Respects `prefers-reduced-motion` setting

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Unit Test Example (Jest + React Testing Library)

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactHostMessaging from './ContactHostMessaging';

describe('ContactHostMessaging', () => {
  const mockListing = {
    id: 'listing123',
    title: 'Test Listing',
    hostId: 'host456',
    hostName: 'Jane Doe'
  };

  const mockUser = {
    id: 'user789',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Message Jane Doe/i)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={mockUser}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText(/Message Jane Doe/i)).not.toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const sendButton = screen.getByText('Send message');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  test('pre-fills user data when logged in', () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const nameInput = screen.getByPlaceholderText(/Your name/i);
    expect(nameInput).toHaveValue('John');
    expect(nameInput).toBeDisabled();
  });

  test('shows email field for guest users', () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText(/Sign Up to increase/i)).toBeInTheDocument();
  });

  test('closes modal on escape key', () => {
    render(
      <ContactHostMessaging
        listing={mockListing}
        currentUser={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Issue: Modal doesn't close on overlay click
**Solution:** Ensure the `onClose` prop is properly connected to your state setter:
```jsx
<ContactHostMessaging
  onClose={() => setShowModal(false)}  // ✓ Correct
  onClose={setShowModal}                // ✗ Incorrect (expects boolean)
/>
```

### Issue: Form fields not pre-filling for logged-in users
**Solution:** Verify your `currentUser` object has the required properties:
```jsx
const currentUser = {
  id: 'user123',
  firstName: 'John',  // Required
  lastName: 'Doe',    // Required
  email: 'john@...'   // Required
};
```

### Issue: API call fails silently
**Solution:** Check browser console for errors and ensure your API endpoint is correct. Update the endpoint in `ContactHostMessaging.jsx`:
```javascript
const response = await fetch('/api/messages/send', {  // Update this path
```

### Issue: Styling doesn't match
**Solution:** Ensure DM Sans font is loaded and CSS is imported:
```jsx
import './ContactHostMessaging.css';  // In your component file
```

## Performance Optimization

For better performance in large applications:

```jsx
// Use React.lazy for code splitting
const ContactHostMessaging = React.lazy(() => import('./ContactHostMessaging'));

function ListingCard({ listing, currentUser }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Contact Host</button>

      <Suspense fallback={<div>Loading...</div>}>
        {showModal && (
          <ContactHostMessaging
            listing={listing}
            currentUser={currentUser}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </Suspense>
    </>
  );
}
```

## License

This component is provided as-is for use in the Split Lease application.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
