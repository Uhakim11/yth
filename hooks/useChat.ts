// useChat hook has been removed as per user request to remove chatting/messaging features.
// This file is kept to avoid breaking direct import errors if any were missed,
// but it no longer provides any chat functionality.

// For a full cleanup, this file would be deleted and all imports to it removed.

const useChat = () => {
  // console.warn("useChat hook is deprecated and no longer functional.");
  return {}; // Return an empty object or throw an error
};

export { useChat }; // Export to satisfy existing imports if any