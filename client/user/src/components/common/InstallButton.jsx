import React, { useState, useEffect } from "react";

const InstallButton = ({ isInstallable, setIsInstallable }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Don't prevent default - let the browser show its prompt if we don't handle it
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is already installed
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // Show the prompt
      await deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // Clear the prompt reference
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (err) {
      console.error("Error showing install prompt:", err);
    }
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-lg mb-2">Install TurfBuddy for a better experience!</p>
      <button
        onClick={handleInstallClick}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mr-2"
      >
        Install App
      </button>
      <button
        onClick={() => setIsInstallable(false)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default InstallButton;
