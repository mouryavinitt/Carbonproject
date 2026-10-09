import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Leaf } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
        <Leaf className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        The carbon tracking page or resource you requested could not be located.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Return to CarbonTrack Home
        </Button>
      </Link>
    </div>
  );
};
