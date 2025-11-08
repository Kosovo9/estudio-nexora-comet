'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  minImages: number
}

export default function PhotoUpload({ onUpload, minImages }: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 10) // Max 10 images
    setFiles(newFiles)
    
    // Create previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
    
    onUpload(newFiles)
  }, [files, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newPreviews)
    onUpload(newFiles)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload Photos</h2>
      <p className="text-gray-400 mb-6">
        Upload at least {minImages} images to continue
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="text-lg mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500">or click to select</p>
        <p className="text-xs text-gray-600 mt-2">
          Supports: JPEG, PNG, WebP (Max 10 images)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Uploaded Images ({files.length}/{minImages} minimum)
            </h3>
            {files.length >= minImages && (
              <span className="text-green-400 text-sm">✓ Minimum reached</span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-700">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
                  {files[index].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

