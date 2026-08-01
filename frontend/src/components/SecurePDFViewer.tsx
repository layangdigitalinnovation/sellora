'use client';

import React from 'react';

export function SecurePDFViewer({ src }: { src: string }) {
  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <iframe 
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`} 
        className="w-full h-full"
        title="PDF Document"
      />
    </div>
  );
}
