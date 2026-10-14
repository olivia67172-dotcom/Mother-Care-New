import React, { useEffect, useRef } from 'react';

interface AdsterraSocialBarProps {
  scriptCode?: string;
}

export const AdsterraSocialBar: React.FC<AdsterraSocialBarProps> = ({ scriptCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptCode || !scriptCode.trim() || !containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';

    try {
      // Create a range to execute embedded script tags safely
      const range = document.createRange();
      range.selectNode(containerRef.current);
      const documentFragment = range.createContextualFragment(scriptCode);
      containerRef.current.appendChild(documentFragment);
    } catch (e) {
      console.error('Error executing Adsterra script', e);
    }
  }, [scriptCode]);

  if (!scriptCode || !scriptCode.trim()) return null;

  return (
    <div 
      ref={containerRef} 
      className="adsterra-social-bar-slot fixed bottom-0 left-0 right-0 z-30 pointer-events-auto"
      aria-hidden="true"
    />
  );
};
