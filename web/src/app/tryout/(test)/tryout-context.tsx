'use client'

import { createContext, useContext } from 'react';

// Define the shape of your data
type TryoutDataType = any
// Create the context
const TryoutContext = createContext<TryoutDataType | undefined>(undefined);

// Provider component
export function TryoutDataProvider({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: TryoutDataType 
}) {
  return (
    <TryoutContext.Provider value={value}>
      {children}
    </TryoutContext.Provider>
  );
}

// Custom hook for consuming the context
export function useTryoutData() {
  const context = useContext(TryoutContext);
  if (context === undefined) {
    throw new Error('useTryoutData must be used within a TryoutDataProvider');
  }
  return context;
}
