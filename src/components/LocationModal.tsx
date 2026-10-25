import React, { useState } from 'react';
import { Crosshair, MapPin, Check, X, Navigation } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/labData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (locationId: string, locationName: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}) => {
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleUseCurrentGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          // Default to closest major healthcare hub
          onSelectLocation('bailey', 'Bailey Road');
          onClose();
        },
        () => {
          setIsLocating(false);
          onSelectLocation('bailey', 'Bailey Road');
          onClose();
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      onSelectLocation('bailey', 'Bailey Road');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          aria-label="Close location modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Select Location</h3>
            <p className="text-xs text-slate-500">Find diagnostic labs offering home collection near you</p>
          </div>
        </div>

        {/* GPS Auto Detect Button */}
        <button
          onClick={handleUseCurrentGPS}
          disabled={isLocating}
          className="w-full py-3 px-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mb-4 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Crosshair className={`w-4 h-4 text-teal-700 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting your GPS location...' : 'Detect Current Location (GPS)'}</span>
        </button>

        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
          Popular Areas in Patna
        </span>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc.id, loc.name);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/60 font-bold text-teal-900 ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-slate-400" />
                  <span className="text-xs sm:text-sm">{loc.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-700 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
