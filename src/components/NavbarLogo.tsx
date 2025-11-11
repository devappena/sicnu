import React from 'react';
import enaLogoImage from '../assets/images/ena-logo.png';

interface NavbarLogoProps {
  className?: string;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="h-10 w-10 flex-shrink-0">
        <img 
          src={enaLogoImage} 
          alt="Logo ENA - École Nationale d'Administration" 
          className="h-10 w-10 object-contain drop-shadow-md filter brightness-110"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="font-bold text-white text-lg leading-tight">
          ENA
        </h1>
        <p className="text-blue-200 text-xs leading-tight">
          Portail RH
        </p>
      </div>
    </div>
  );
};

export default NavbarLogo;
