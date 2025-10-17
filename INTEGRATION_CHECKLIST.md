# Integration Checklist

Use this checklist to ensure proper integration of the ContactHostMessaging component into your Split Lease application.

## Pre-Integration Setup

- [ ] **Install DM Sans Font**
  ```html
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
  ```

- [ ] **Verify React Version**
  - React 17.0.0+ or 18.0.0+
  - Check: `npm list react`

- [ ] **Backend API Endpoint Ready**
  - Endpoint: `POST /api/messages/send`
  - Accepts message payload
  - Returns success/error response

## File Integration

- [ ] **Copy Component Files**
  - [ ] `ContactHostMessaging.jsx` → Your components directory
  - [ ] `ContactHostMessaging.css` → Same directory or styles folder
  - [ ] `ContactHostMessaging.d.ts` → Same directory (TypeScript only)

- [ ] **Update Import Paths**
  - [ ] Check CSS import path in JSX file
  - [ ] Verify relative paths match your project structure

## Data Structure Verification

- [ ] **Listing Object Structure**
  ```javascript
  {
    id: string,        // ✓ Available
    title: string,     // ✓ Available
    hostId: string,    // ✓ Available
    hostName: string   // ✓ Available or can derive
  }
  ```

- [ ] **CurrentUser Object Structure**
  ```javascript
  {
    id: string,        // ✓ Available
    firstName: string, // ✓ Available
    lastName: string,  // ✓ Available
    email: string      // ✓ Available
  }
  ```

## Backend Integration

- [ ] **Create Message API Endpoint**
  - [ ] Route: `POST /api/messages/send`
  - [ ] Request validation
  - [ ] Database schema for messages
  - [ ] Error handling

- [ ] **Database Schema**
  ```sql
  CREATE TABLE messages (
    id VARCHAR(255) PRIMARY KEY,
    listing_id VARCHAR(255) NOT NULL,
    host_id VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255), -- NULL for guests
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (host_id) REFERENCES users(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );
  ```

- [ ] **Email Notifications**
  - [ ] Email service configured (SendGrid, AWS SES, etc.)
  - [ ] Host notification template
  - [ ] Sender confirmation template

## Component Implementation

- [ ] **Import Component**
  ```javascript
  import ContactHostMessaging from './components/ContactHostMessaging';
  ```

- [ ] **Add State Management**
  ```javascript
  const [showContactModal, setShowContactModal] = useState(false);
  ```

- [ ] **Implement Trigger Button**
  ```javascript
  <button onClick={() => setShowContactModal(true)}>
    Contact Host
  </button>
  ```

- [ ] **Add Component with Props**
  ```javascript
  <ContactHostMessaging
    listing={listing}
    currentUser={currentUser}
    isOpen={showContactModal}
    onClose={() => setShowContactModal(false)}
  />
  ```

## Authentication Integration

- [ ] **Connect to Auth System**
  - [ ] Context API: `const { user } = useAuth();`
  - [ ] Redux: `const user = useSelector(state => state.auth.user);`
  - [ ] Other state management

- [ ] **Handle Logged-Out State**
  - [ ] Pass `null` for `currentUser` when not logged in
  - [ ] Email field shows for guests

- [ ] **Sign Up Route**
  - [ ] Update signup link in component: `/signup`
  - [ ] Or implement custom handler

## Testing Checklist

### Manual Testing

- [ ] **Guest User Flow**
  - [ ] Open modal as non-logged-in user
  - [ ] Name field is editable
  - [ ] Email field is visible
  - [ ] Sign-up link appears
  - [ ] Can send message with email
  - [ ] Success view displays
  - [ ] Modal closes on "Done"

- [ ] **Logged-In User Flow**
  - [ ] Open modal as logged-in user
  - [ ] Name is pre-filled and disabled
  - [ ] Email field is hidden
  - [ ] Can send message
  - [ ] Success view displays
  - [ ] Modal closes properly

- [ ] **Form Validation**
  - [ ] Submit empty form → Shows errors
  - [ ] Name required → Error displays
  - [ ] Message required → Error displays
  - [ ] Message too short → Error displays
  - [ ] Invalid email (guests) → Error displays
  - [ ] Errors clear when typing

- [ ] **UI/UX**
  - [ ] Modal centers on screen
  - [ ] Overlay dims background
  - [ ] Click overlay → Modal closes
  - [ ] Click X button → Modal closes
  - [ ] Press Escape → Modal closes
  - [ ] Body scroll locked when open
  - [ ] Animations smooth
  - [ ] Mobile responsive

- [ ] **Accessibility**
  - [ ] Tab navigation works
  - [ ] Focus visible on elements
  - [ ] Screen reader announces errors
  - [ ] ARIA labels present
  - [ ] Keyboard shortcuts work

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Small mobile (320x568)

## API Testing

- [ ] **Success Case**
  - [ ] Message sends successfully
  - [ ] Returns messageId and timestamp
  - [ ] Database record created
  - [ ] Host receives email notification
  - [ ] Sender receives confirmation

- [ ] **Error Cases**
  - [ ] Missing required fields → 400 error
  - [ ] Invalid listing ID → 404 error
  - [ ] Server error → 500 error
  - [ ] Network error → Shows error message
  - [ ] Error messages display to user

- [ ] **Email Delivery**
  - [ ] Host receives notification
  - [ ] Sender receives confirmation
  - [ ] Emails have correct data
  - [ ] Links work in emails

## Security Checklist

- [ ] **Input Validation**
  - [ ] Server-side validation
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] Email validation

- [ ] **Rate Limiting**
  - [ ] Prevent spam (e.g., 5 messages per hour per IP)
  - [ ] CAPTCHA for guests (optional)

- [ ] **Authorization**
  - [ ] Verify listing exists
  - [ ] Verify host exists
  - [ ] Logged-in users: verify user ID matches session

## Performance Optimization

- [ ] **Code Splitting**
  - [ ] Lazy load component if needed
  - [ ] Consider bundle size

- [ ] **API Optimization**
  - [ ] Response time < 500ms
  - [ ] Implement caching where appropriate

- [ ] **Image/Asset Optimization**
  - [ ] DM Sans font loaded efficiently
  - [ ] CSS minified in production

## Analytics Integration (Optional)

- [ ] **Track Events**
  ```javascript
  // On modal open
  gtag('event', 'contact_host_modal_opened', {
    listing_id: listing.id,
    user_logged_in: !!currentUser
  });

  // On message sent
  gtag('event', 'message_sent_to_host', {
    listing_id: listing.id,
    user_type: currentUser ? 'logged_in' : 'guest'
  });
  ```

- [ ] **Conversion Tracking**
  - [ ] Modal open rate
  - [ ] Message send rate
  - [ ] Guest → Sign up conversion

## Documentation

- [ ] **Internal Documentation**
  - [ ] Component added to style guide
  - [ ] Usage examples documented
  - [ ] API documented for team

- [ ] **User Documentation** (if needed)
  - [ ] Help articles updated
  - [ ] FAQ updated

## Deployment Checklist

- [ ] **Pre-Deployment**
  - [ ] All tests pass
  - [ ] Code reviewed
  - [ ] No console errors
  - [ ] Accessibility audit passed
  - [ ] Performance benchmarks met

- [ ] **Deployment**
  - [ ] Deploy to staging first
  - [ ] Test on staging
  - [ ] Deploy to production
  - [ ] Monitor for errors

- [ ] **Post-Deployment**
  - [ ] Smoke tests on production
  - [ ] Monitor error logs
  - [ ] Check analytics data
  - [ ] Verify email delivery

## Monitoring

- [ ] **Error Tracking**
  - [ ] Sentry or similar tool configured
  - [ ] API errors logged
  - [ ] Frontend errors logged

- [ ] **Metrics to Track**
  - [ ] Modal open count
  - [ ] Message send success rate
  - [ ] Message send error rate
  - [ ] Average time to send message
  - [ ] Guest vs logged-in user ratio

## Rollback Plan

- [ ] **Rollback Procedure Documented**
  - [ ] How to disable component
  - [ ] How to revert backend changes
  - [ ] How to restore previous version

- [ ] **Emergency Contacts**
  - [ ] Frontend team lead
  - [ ] Backend team lead
  - [ ] DevOps contact

## Sign-Off

- [ ] **Development** - Developer Name: _________________ Date: _________
- [ ] **Code Review** - Reviewer Name: _________________ Date: _________
- [ ] **QA Testing** - QA Name: _________________ Date: _________
- [ ] **Product Owner** - PO Name: _________________ Date: _________
- [ ] **Deployment** - DevOps Name: _________________ Date: _________

---

## Notes

Use this section to document any specific issues, customizations, or important information discovered during integration:

```
[Your notes here]
```

---

**Last Updated:** 2025-10-17
**Component Version:** 1.0.0
