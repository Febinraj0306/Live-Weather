import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, MapPin } from 'lucide-react';
import { searchLocation } from '../utils/weatherAPI';

const SearchOverlay = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchLocation(query);
        setResults(data);
      } catch (error) {
        console.error("Error fetching locations", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col pt-32 px-6 sm:px-12 bg-black/40"
        >
          <div className="absolute top-8 right-8 cursor-pointer p-2 rounded-full hover:bg-white/10 transition" onClick={onClose}>
             <X size={32} color="white" />
          </div>

          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="relative">
              <SearchIcon size={24} className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-50" color="white" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..." 
                className="w-full bg-white/10 border border-white/20 rounded-full py-5 pl-16 pr-8 text-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
              />
            </div>

            <div className="mt-8 space-y-2">
              {loading && <div className="text-white/60 ml-6">Searching the winds...</div>}
              {!loading && results.map((res) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={res.id}
                  onClick={() => onSelect({ name: res.name, lat: res.latitude, lon: res.longitude, country: res.country })}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="p-3 bg-white/5 rounded-full">
                    <MapPin size={20} color="white" />
                  </div>
                  <div>
                    <div className="text-xl text-white font-medium">{res.name}</div>
                    <div className="text-white/60 text-sm">
                      {res.admin1 ? `${res.admin1}, ` : ''}{res.country}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
