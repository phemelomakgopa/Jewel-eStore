// Turn Firebase auth error codes into messages that say what to do next.
const MESSAGES = {
  "auth/invalid-credential": "That email and password don't match. Check them and try again.",
  "auth/wrong-password": "That email and password don't match. Check them and try again.",
  "auth/user-not-found": "There's no account with that email. Create one below.",
  "auth/invalid-email": "Enter an email like name@example.com.",
  "auth/email-already-in-use": "An account with this email already exists. Sign in instead.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes, or reset your password.",
  "auth/network-request-failed": "We couldn't reach the server. Check your connection and try again.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
};

const SILENT = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];

export const authErrorMessage = (error) => {
  if (SILENT.includes(error?.code)) return "";
  return MESSAGES[error?.code] || "Something went wrong. Try again.";
};
