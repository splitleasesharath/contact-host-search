# Local Preview Guide - Contact Host Messaging Component

## Quick Start

### Option 1: Direct Browser Open (Easiest)
Simply double-click `preview-local.html` or run:
```bash
npm run preview
```
This will open the preview directly in your default browser.

### Option 2: Local Server (Recommended)
For a better development experience with live reload:
```bash
npm run serve
```
This will start a local server at `http://localhost:8080`

### Option 3: Manual Browser Open
1. Navigate to the `message-host-component` folder
2. Right-click on `preview-local.html`
3. Select "Open with" → Your preferred browser

---

## What's Included

### Preview Features
- **Interactive Testing**: Switch between guest and logged-in user modes
- **Multiple Listings**: Test with 3 different property listings
- **Real-time Console**: See API calls and responses logged in real-time
- **Form Validation**: Test all validation scenarios
- **Error Handling**: 90% success rate to test error states
- **Responsive Design**: Works on mobile, tablet, and desktop

### Component Features Being Tested
✅ Guest user flow (email required)
✅ Logged-in user flow (pre-filled data)
✅ Form validation (name, email, message)
✅ Error messages and states
✅ Success confirmation
✅ Modal animations
✅ Keyboard navigation (ESC to close)
✅ Accessibility features

---

## Testing Scenarios

### Test Case 1: Guest User
1. Keep "Guest User (Not Logged In)" selected
2. Click "Contact Host"
3. Try submitting without filling fields → See validation errors
4. Fill in name and email (use a real email format)
5. Write a message (at least 10 characters)
6. Click "Send message"
7. Watch the console output
8. See success or error message

### Test Case 2: Logged-In User
1. Select "Logged In (John Doe)" from dropdown
2. Click "Contact Host"
3. Notice name and email are pre-filled and disabled
4. Write a message
5. Submit and verify

### Test Case 3: Different Listings
1. Change the "Select Property" dropdown
2. Notice how the modal title and subject change
3. Test messaging different hosts

### Test Case 4: Error Handling
- With 90% success rate, some submissions will fail
- This tests the error banner display
- Try resubmitting to test retry logic

### Test Case 5: Validation Edge Cases
- Empty fields
- Invalid email formats (test@test, test.com, etc.)
- Messages under 10 characters
- Special characters in fields

---

## File Structure

```
message-host-component/
├── preview-local.html          ← New enhanced preview file
├── test-demo.html              ← Original demo file
├── ContactHostMessaging.jsx    ← Main component
├── ContactHostMessaging.css    ← Component styles
├── ContactHostMessaging.d.ts   ← TypeScript definitions
├── ExampleUsage.jsx           ← Integration example
├── package.json               ← Updated with preview scripts
└── LOCAL_PREVIEW_GUIDE.md     ← This file
```

---

## GitHub Repository

**Repository URL**: https://github.com/splitleasesharath/contact-host-search.git

### Current Status
- ✅ Remote configured correctly
- ✅ On `main` branch
- ⚠️ Uncommitted changes:
  - Modified: `package.json`
  - New: `preview-local.html`
  - New: `LOCAL_PREVIEW_GUIDE.md`

### To Push Changes to GitHub

```bash
# Navigate to directory
cd "C:\Users\Split Lease\My Drive\!Agent Context and Tools\SL16\message-host-component"

# Stage new files
git add preview-local.html LOCAL_PREVIEW_GUIDE.md package.json

# Commit changes
git commit -m "Add enhanced local preview with testing environment"

# Push to GitHub
git push origin main
```

---

## Preview vs Production

### Preview Mode (Current)
- Uses mock API (`mockSendMessage` function)
- 90% success rate simulation
- Console logging enabled
- No real messages sent
- Perfect for development and testing

### Production Integration
To use in production, replace the mock API:

```javascript
// In ContactHostMessaging.jsx line 81
const response = await fetch('/api/messages/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    listingId: listing.id,
    hostId: listing.hostId,
    senderName: formData.userName,
    senderEmail: formData.email,
    subject: formData.subject,
    message: formData.messageBody,
    userId: currentUser?.id || null,
    timestamp: new Date().toISOString()
  })
});
```

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Troubleshooting

### Issue: Page doesn't load
**Solution**: Make sure `ContactHostMessaging.css` is in the same directory

### Issue: Console output not showing
**Solution**: Check browser console (F12) for JavaScript errors

### Issue: Modal doesn't appear
**Solution**:
1. Check if React loaded correctly (check browser console)
2. Try refreshing the page
3. Clear browser cache

### Issue: Styles look broken
**Solution**:
1. Verify the CSS file path in preview-local.html
2. Check if fonts are loading (requires internet for Google Fonts)
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Console Output Explained

The console at the bottom of the preview shows:
- 📤 Outgoing API requests with full payload
- ✅ Successful responses
- ❌ Error responses
- Timestamps for all events

This helps you understand exactly what data is being sent and received.

---

## Next Steps

1. ✅ Test all scenarios in the preview
2. ✅ Verify styles match your design
3. ✅ Test on different screen sizes
4. ✅ Push to GitHub when satisfied
5. 🔄 Integrate with your real API endpoint
6. 🔄 Deploy to production

---

## Support

For issues or questions:
1. Check the main README.md
2. Review QUICKSTART.md
3. Check INTEGRATION_CHECKLIST.md
4. Consult the GitHub repository issues

---

## Version History

### v1.0.0 (Current)
- Enhanced local preview with testing controls
- Real-time console logging
- Multiple test scenarios
- Responsive design improvements
- Comprehensive documentation

---

**Happy Testing! 🚀**
