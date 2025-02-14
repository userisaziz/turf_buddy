import { useState } from "react";
import InstallButton from "../common/InstallButton";
const Footer = () => {
  const [isInstallable, setIsInstallable] = useState(false);

  const handleInstall = () => {
    setIsInstallable(true);
    // Check if the browser supports the PWA installation
    if (window.deferredPrompt) {
      // Show the install prompt
      window.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
          setIsInstallable(true);
        }
        window.deferredPrompt = null; // Clear the deferred prompt
      });
    }
  };

  return (
    <footer className="bg-base-200 py-4 text-center">
      <p>&copy; {new Date().getFullYear()} TurfBuddy. All rights reserved.</p>
      <p>
        Developed with ❤ by{" "}
        <a
          href="https://github.com/userisaziz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Aziz
        </a>
      </p>
      <p className="mt-2">
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={handleInstall}
        >
          Install the TurfBuddy App
        </span>
      </p>
      <InstallButton
        isInstallable={isInstallable}
        setIsInstallable={setIsInstallable}
      />
    </footer>
  );
};

export default Footer;
