'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { DICTIONARY, type Language } from '@/lib/dictionary';

interface FileUploadProps {
  lang: Language;
  onUpload: (files: File[]) => void;
}

export default function FileUpload({ lang, onUpload }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const t = useCallback(
    (key: keyof typeof DICTIONARY['es']) => {
      const translation = DICTIONARY[lang][key];
      return typeof translation === 'function' ? translation(0) : translation;
    },
    [lang]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, 3);
      setFiles(newFiles);

      if (newFiles.length > 0) {
        const successMessage = DICTIONARY[lang].uploadSuccess(newFiles.length);
        setMessage({ text: successMessage, type: 'success' });
        onUpload(newFiles);
      } else {
        setMessage({ text: t('uploadError'), type: 'error' });
      }
    },
    [lang, t, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: 3,
  });

  return (
    <div className="w-full max-w-md p-6 bg-black/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">{t('uploadTitle')}</h3>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-900/30'
            : 'border-gray-500 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-300">
          {isDragActive ? (lang === 'es' ? '¡Suelta las imágenes aquí!' : 'Drop images here!') : t('uploadText')}
        </p>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-white mb-2">{t('uploadedFiles')}</p>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-xs text-gray-300 truncate flex justify-between items-center">
                <span>{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                <button
                  onClick={() => {
                    const updatedFiles = files.filter((_, i) => i !== index);
                    setFiles(updatedFiles);
                    onUpload(updatedFiles);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

