import React from 'react';
import {
  Upload,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../../Card';

interface BasicInfoTabProps {
  formData: {
    title: string;
    description: string;
    thumbnail: string;
  };
  formErrors: {
    title?: string;
    description?: string;
  };
  thumbnailImage: string;
  isUploading: boolean;
  uploadProgress: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date, field: string) => void;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setThumbnailImage: (image: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  formErrors,
  thumbnailImage,
  isUploading,
  uploadProgress,
  handleInputChange,
  handleThumbnailUpload,
  setThumbnailImage,
  setFormData
}) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contest Details</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Provide basic information about your contest</p>
      </div>
      <div className="px-6 py-4 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contest Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange(e, 'title')}
            placeholder="Enter contest title"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.title && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange(e, 'description')}
            placeholder="Describe your contest..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              formErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.description && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formErrors.description}
            </p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contest Thumbnail
          </label>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail"
                  className={`cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
                    isUploading
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed dark:bg-gray-700'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Click to upload thumbnail</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {thumbnailImage && (
              <div className="relative">
                <img
                  src={thumbnailImage}
                  alt="Contest thumbnail"
                  className="w-32 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailImage('');
                    setFormData((prev: any) => ({ ...prev, thumbnail: '' }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoTab;
