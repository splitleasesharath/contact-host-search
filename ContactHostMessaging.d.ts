/**
 * TypeScript definitions for ContactHostMessaging component
 */

export interface Listing {
  /** Unique identifier for the listing */
  id: string;
  /** Title of the listing */
  title: string;
  /** Host's unique identifier */
  hostId: string;
  /** Host's display name */
  hostName: string;
  /** Optional: Listing description */
  description?: string;
  /** Optional: Listing image URL */
  image?: string;
  /** Optional: Price per month */
  price?: number;
}

export interface CurrentUser {
  /** Unique identifier for the user */
  id: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** Optional: User's phone number */
  phone?: string;
}

export interface MessagePayload {
  /** Listing identifier */
  listingId: string;
  /** Host identifier */
  hostId: string;
  /** Sender's name */
  senderName: string;
  /** Sender's email */
  senderEmail: string;
  /** Message subject */
  subject: string;
  /** Message body */
  message: string;
  /** User ID if logged in, null otherwise */
  userId: string | null;
  /** Timestamp of message creation */
  timestamp: string;
}

export interface MessageResponse {
  /** Whether the message was sent successfully */
  success: boolean;
  /** Unique identifier for the message */
  messageId?: string;
  /** Timestamp of when message was sent */
  timestamp?: string;
  /** Error message if failed */
  message?: string;
}

export type ViewState = 'contactForm' | 'success' | 'provideEmail' | 'requireSignup';

export interface FormData {
  /** User's name */
  userName: string;
  /** Message subject */
  subject: string;
  /** Message body */
  messageBody: string;
  /** User's email */
  email: string;
}

export interface FormErrors {
  /** Error message for userName field */
  userName?: string;
  /** Error message for email field */
  email?: string;
  /** Error message for messageBody field */
  messageBody?: string;
  /** Error message for form submission */
  submit?: string;
}

export interface ContactHostMessagingProps {
  /**
   * Listing object containing information about the property
   * Must include id, title, hostId, and hostName
   */
  listing: Listing;

  /**
   * Current user object if logged in, null if guest
   * When null, the component will require email input
   */
  currentUser: CurrentUser | null;

  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Callback function called when the modal should close
   * Use this to update your parent component's state
   */
  onClose: () => void;
}

/**
 * ContactHostMessaging Component
 *
 * A modal component that allows users (both logged-in and guests) to contact
 * property hosts from listing pages. Provides a multi-step form with validation,
 * success confirmation, and optional sign-up prompts.
 *
 * @example
 * ```tsx
 * import ContactHostMessaging from './ContactHostMessaging';
 *
 * function MyComponent() {
 *   const [showModal, setShowModal] = useState(false);
 *   const currentUser = useAuth();
 *
 *   const listing = {
 *     id: 'listing123',
 *     title: 'Beautiful 2BR Apartment',
 *     hostId: 'host456',
 *     hostName: 'Jane Smith'
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => setShowModal(true)}>
 *         Contact Host
 *       </button>
 *
 *       <ContactHostMessaging
 *         listing={listing}
 *         currentUser={currentUser}
 *         isOpen={showModal}
 *         onClose={() => setShowModal(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
declare const ContactHostMessaging: React.FC<ContactHostMessagingProps>;

export default ContactHostMessaging;
