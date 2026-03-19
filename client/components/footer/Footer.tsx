import React from "react";
import Container from "../common/Container";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <Container className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/about" className="hover:text-gray-400">
              About
            </a>
            <a href="/contact" className="hover:text-gray-400">
              Contact
            </a>
            <a href="/privacy" className="hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-400">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
          </div>
        </div>

        <div className="text-gray-500 text-xs text-center md:text-left">
          Made with ❤️ using React and Tailwind CSS.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
