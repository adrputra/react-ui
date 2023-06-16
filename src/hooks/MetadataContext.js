import React, { createContext, useState, useEffect } from 'react';

export const MetadataContext = createContext();

export const MetadataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(() => {
    const storedMetadata = localStorage.getItem('metadata');
    return storedMetadata ? JSON.parse(storedMetadata) : {};
  });

  useEffect(() => {
    // Update local storage when metadata changes
    localStorage.setItem('metadata', JSON.stringify(metadata));
  }, [metadata]);

  const updateMetadata = (updatedMetadata) => {
    setMetadata(updatedMetadata);
  };

  return (
    <MetadataContext.Provider value={{ metadata, updateMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};
