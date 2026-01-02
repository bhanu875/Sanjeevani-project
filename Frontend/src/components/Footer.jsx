import React from "react";

const Footer = () => {
  return (
    <footer className="bg-cocoa text-beige py-4 text-center mt-10">
      <p className="text-[11px] tracking-wide">
        © {new Date().getFullYear()} SANJEEVANI — Ayurveda • Wellness • Care
      </p>
    </footer>
  );
};

export default Footer;
