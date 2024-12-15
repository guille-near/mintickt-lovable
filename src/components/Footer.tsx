const Footer = () => {
  return (
    <footer className="bg-[#1D1D1D] text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NFT Tickets. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;