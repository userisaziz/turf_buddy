const Footer = () => {
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
    </footer>
  );
};

export default Footer;
