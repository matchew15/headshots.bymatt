import React from 'react';

"use client"; // This line marks the component as a Client Component

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center px-4 lg:px-40 py-4 h-12 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center space-y-3 sm:mb-0 mb-3 border-gray-200">
      <div className="text-gray-500">
        <a
          className="text-blue-600 hover:underline font-bold"
          href="https://www.betterheadshot.com"
        >
          Better Headshot
        </a>
        {" © "}{new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
  );
}
