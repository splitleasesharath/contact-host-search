import React, { useState } from 'react';
import ContactHostMessaging from './ContactHostMessaging';

/**
 * Example usage of the ContactHostMessaging component
 * This demonstrates how to integrate the component into your application
 */

// Example 1: Basic Usage in a Listing Card
function ListingCard({ listing }) {
  const [showContactModal, setShowContactModal] = useState(false);

  // Mock current user - replace with your actual auth state
  const currentUser = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };

  return (
    <div className="listing-card">
      <img src={listing.image} alt={listing.title} />
      <h3>{listing.title}</h3>
      <p>{listing.description}</p>
      <p className="price">${listing.price}/month</p>

      <button
        className="contact-host-btn"
        onClick={() => setShowContactModal(true)}
      >
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

// Example 2: Usage with React Context for Auth
import { useAuth } from './context/AuthContext'; // Your auth context

function ListingDetails({ listing }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useAuth(); // Get current user from context

  return (
    <div className="listing-details">
      <h1>{listing.title}</h1>
      <div className="listing-content">
        {/* Listing details */}
      </div>

      <button onClick={() => setShowContactModal(true)}>
        Message {listing.hostName}
      </button>

      <ContactHostMessaging
        listing={listing}
        currentUser={user} // Will be null if not logged in
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}

// Example 3: Usage with Redux
import { useSelector } from 'react-redux';

function ListingSearchResults({ listings }) {
  const [selectedListing, setSelectedListing] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const currentUser = useSelector(state => state.auth.user);

  const handleContactHost = (listing) => {
    setSelectedListing(listing);
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    // Optional: Reset selected listing after a delay
    setTimeout(() => setSelectedListing(null), 300);
  };

  return (
    <div className="search-results">
      {listings.map(listing => (
        <div key={listing.id} className="result-card">
          <h3>{listing.title}</h3>
          <button onClick={() => handleContactHost(listing)}>
            Contact Host
          </button>
        </div>
      ))}

      {selectedListing && (
        <ContactHostMessaging
          listing={selectedListing}
          currentUser={currentUser}
          isOpen={showContactModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// Example 4: Guest User Flow (Not Logged In)
function GuestListingView({ listing }) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="guest-listing-view">
      <h2>{listing.title}</h2>

      <button onClick={() => setShowContactModal(true)}>
        Inquire About This Property
      </button>

      {/* Pass null as currentUser to indicate guest */}
      <ContactHostMessaging
        listing={listing}
        currentUser={null}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}

// Example 5: With Custom Event Tracking
function ListingWithAnalytics({ listing }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useAuth();

  const handleOpenContactForm = () => {
    // Track analytics event
    if (window.gtag) {
      window.gtag('event', 'contact_host_clicked', {
        listing_id: listing.id,
        listing_title: listing.title,
        user_logged_in: !!user
      });
    }

    setShowContactModal(true);
  };

  const handleCloseContactForm = () => {
    setShowContactModal(false);

    // Track close event
    if (window.gtag) {
      window.gtag('event', 'contact_host_modal_closed', {
        listing_id: listing.id
      });
    }
  };

  return (
    <div>
      <button onClick={handleOpenContactForm}>
        Contact Host
      </button>

      <ContactHostMessaging
        listing={listing}
        currentUser={user}
        isOpen={showContactModal}
        onClose={handleCloseContactForm}
      />
    </div>
  );
}

// Example 6: Mobile-Optimized Full-Screen Modal
function MobileListingView({ listing }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useAuth();

  // Prevent background scroll on mobile when modal is open
  React.useEffect(() => {
    if (showContactModal) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showContactModal]);

  return (
    <div className="mobile-listing">
      <button
        className="floating-contact-btn"
        onClick={() => setShowContactModal(true)}
      >
        Contact Host
      </button>

      <ContactHostMessaging
        listing={listing}
        currentUser={user}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}

export {
  ListingCard,
  ListingDetails,
  ListingSearchResults,
  GuestListingView,
  ListingWithAnalytics,
  MobileListingView
};
