import React from "react";
import './header.css';
import { images } from '../../assets/images'

function Header({ className }) {
  return (
    <header  className={`p-4 ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo on the left */}
        <div className="text-xl font-bold">
          <img src={images.Logo} alt="Logo" className="logo-img w-auto"/>
        </div>

        {/* Text and SVG on the right */}
        <div className="flex items-center space-x-4">
          <img src={images.Aisvg} alt="Logo" className="ai-svg w-auto"/>
          <span className="assesment-text" > AI Assessment Engine</span>
        </div>
      </div>
    </header>
  )
}

export default Header