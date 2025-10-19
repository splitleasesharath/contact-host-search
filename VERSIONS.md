# Contact Host Messaging - Available Versions

This repository contains **two versions** of the Contact Host Messaging component:

## 1. React Version (Original)

**Files:**
- `ContactHostMessaging.jsx` - React component
- `ContactHostMessaging.css` - Styling
- `ContactHostMessaging.d.ts` - TypeScript definitions
- `ExampleUsage.jsx` - React usage examples
- `test-demo.html` - Standalone React demo

**Best for:**
- React applications
- TypeScript projects
- Build systems with npm/webpack/vite
- Applications using JSX

**Integration:**
```jsx
import ContactHostMessaging from './ContactHostMessaging';

function App() {
  return (
    <ContactHostMessaging
      listing={listingData}
      currentUser={userData}
      onClose={() => console.log('Closed')}
    />
  );
}
```

See `README.md` for full React documentation.

## 2. Vanilla JavaScript Version (New)

**Files:**
- `contact-host-messaging.js` - Pure JavaScript (no build required)
- `contact-host-messaging.css` - Styling (same as React version)

**Best for:**
- Static HTML pages
- No build system
- Plain JavaScript projects
- CDN-based projects
- Quick integration without npm

**Integration:**
```html
<!-- Add to your HTML -->
<link rel="stylesheet" href="contact-host-messaging.css">
<script src="contact-host-messaging.js"></script>

<!-- Call from your JavaScript -->
<script>
  window.contactHostMessaging.open(listing, currentUser);
</script>
```

**Button Integration:**
```html
<button onclick="openContactHostModal('listing-id-123')">
  Message Host
</button>
```

See `SETUP_MESSAGING_ENDPOINT.md` for vanilla JS documentation.

## Feature Comparison

Both versions have **identical functionality**:

| Feature | React | Vanilla JS |
|---------|-------|------------|
| Contact form with validation | ✅ | ✅ |
| Guest & logged-in user support | ✅ | ✅ |
| Bubble.io API integration | ✅ | ✅ |
| Demo mode (no backend) | ✅ | ✅ |
| Production mode (real API) | ✅ | ✅ |
| Success confirmation | ✅ | ✅ |
| Error handling | ✅ | ✅ |
| CORS support | ✅ | ✅ |
| Accessibility (ARIA) | ✅ | ✅ |
| Responsive design | ✅ | ✅ |
| Modern rounded borders | ✅ | ✅ |

## Configuration

Both versions use the same configuration structure:

```javascript
window.ENV = {
  BUBBLE_API_KEY: 'your-api-key',
  BUBBLE_MESSAGING_ENDPOINT: 'https://app.split.lease/version-test/api/1.1/wf/core-contact-host-send-message'
};
```

## Bubble Workflow Parameters

Both versions send the same payload:

```json
{
  "listing_unique_id": "string",
  "message_body": "string",
  "sender_email": "string",
  "sender_name": "string"
}
```

## Documentation

**Bubble Integration:**
- `BUBBLE_WORKFLOW_INTEGRATION.md` - Complete Bubble setup guide
- `BUBBLE_CORS_FIX.md` - CORS troubleshooting
- `SETUP_MESSAGING_ENDPOINT.md` - Endpoint configuration

**React Version:**
- `README.md` - React component documentation
- `QUICKSTART.md` - 5-minute React setup
- `INTEGRATION_CHECKLIST.md` - React integration steps

**Vanilla JS Version:**
- `SETUP_MESSAGING_ENDPOINT.md` - Setup guide
- See `search_lite` repository for live example

## Which Version Should I Use?

**Choose React Version if:**
- You have a React application
- You use npm/yarn for dependencies
- You have a build system (webpack, vite, etc.)
- You want TypeScript support

**Choose Vanilla JS Version if:**
- You have a static HTML page
- You don't want to use a build system
- You want the simplest integration
- You're adding to an existing non-React site

## Live Examples

**React Version:**
- See `test-demo.html` - Open in browser for standalone demo

**Vanilla JS Version:**
- Live at: https://splitlease.app (integrated into search page)
- Repository: https://github.com/splitleasesharath/search_lite.git

## Repository

This component is maintained at:
- https://github.com/splitleasesharath/contact-host-search.git

Both versions are kept in sync with the same features and bug fixes.

---

**Last Updated:** October 19, 2025
