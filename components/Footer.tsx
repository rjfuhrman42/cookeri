import React from "react";

function Footer() {
  return (
    <footer className="bg-light-black h-[300px] w-screen flex flex-col items-center py-8">
      <div className="container flex flex-col items-center justify-between h-full">
        <h1 className="text-cookeri-green text-4xl font-gluten font-bold">
          Cookeri
        </h1>
        <div className="flex gap-x-4">
          <a
            href="mailto:hey@reidfuhrman.com"
            className="uppercase text-sm font-league-spartan text-lighter-grey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
          <a
            href="/privacy-policy.pdf"
            className="uppercase text-sm font-league-spartan text-lighter-grey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
        <p className="font-league-spartan text-base text-lighter-grey">
          © {`${new Date(Date.now()).getUTCFullYear()} `}Made with 💚 by{" "}
          <a
            href="https://cliki.in/lxnhe5asne"
            className="font-league-spartan text-base text-cookeri-green "
            target="_blank"
            rel="noopener noreferrer"
          >
            Reid Fuhrman
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
