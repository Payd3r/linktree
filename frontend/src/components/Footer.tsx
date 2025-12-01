import React from 'react'

export const Footer = () => {
  return (
    <footer className="w-full py-8 mt-10 border-t border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} ilariaugc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}


