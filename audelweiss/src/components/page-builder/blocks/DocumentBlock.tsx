'use client';

import { DocumentBlock as DocumentBlockType } from '@/types/page';
import { Download, FileText } from 'lucide-react';

interface DocumentBlockProps {
  block: DocumentBlockType;
}

export default function DocumentBlock({ block }: DocumentBlockProps) {
  const { 
    title, 
    document, 
    description, 
    buttonText = 'Télécharger',
    buttonStyle = 'primary',
    showFileInfo = true 
  } = block;

  const buttonClasses = {
    primary: 'bg-[#E8A499] text-white hover:bg-opacity-90',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-[#E8A499] text-[#E8A499] hover:bg-[#E8A499] hover:text-white'
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return '📄';
    if (mime.includes('word') || mime.includes('document')) return '📝';
    if (mime.includes('excel') || mime.includes('spreadsheet')) return '📊';
    if (mime.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {title}
        </h2>
      )}
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">
              {document ? getFileIcon(document.mime) : '📎'}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {document?.name || 'Document'}
              </h3>
              
              {description && (
                <p className="text-gray-600 mb-4">
                  {description}
                </p>
              )}
              
              {showFileInfo && document && (
                <div className="text-sm text-gray-500 mb-4">
                  <p>Taille: {formatFileSize(document.size)}</p>
                  <p>Type: {document.mime}</p>
                </div>
              )}
              
              {document?.url && (
                <a
                  href={document.url}
                  download={document.name}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClasses[buttonStyle]}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 