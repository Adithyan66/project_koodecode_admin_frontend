import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AlertCircle } from 'lucide-react';
import { Card } from '../../../Card';

interface SettingsTabProps {
  formData: {
    registrationDeadline: Date | null;
    startTime: Date | null;
    endTime: Date | null;
    problemTimeLimit: number;
    maxAttempts: number;
    wrongSubmissionPenalty: number;
  };
  formErrors: {
    registrationDeadline?: string;
    startTime?: string;
    endTime?: string;
    problemTimeLimit?: string;
    maxAttempts?: string;
    wrongSubmissionPenalty?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | Date, field: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  formData,
  formErrors,
  handleInputChange
}) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contest Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure timing and attempt settings for your contest
        </p>
      </div>
      <div className="px-6 py-4 space-y-6">
        {/* Date Time Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Registration Deadline *
            </label>
            <DatePicker
              selected={formData.registrationDeadline}
              onChange={(date) => handleInputChange(date || new Date(), 'registrationDeadline')}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholderText="Select registration deadline"
              minDate={new Date()}
            />
            {formErrors.registrationDeadline && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.registrationDeadline}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contest Start Time *
            </label>
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => handleInputChange(date || new Date(), 'startTime')}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.startTime ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholderText="Select start time"
              minDate={new Date()}
            />
            {formErrors.startTime && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.startTime}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contest End Time *
            </label>
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => handleInputChange(date || new Date(), 'endTime')}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.endTime ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholderText="Select end time"
              minDate={formData.startTime || new Date()}
            />
            {formErrors.endTime && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.endTime}
              </p>
            )}
          </div>
        </div>

        {/* Numeric Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="problemTimeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Problem Time Limit (minutes) *
            </label>
            <input
              id="problemTimeLimit"
              type="number"
              min="1"
              max="300"
              value={formData.problemTimeLimit}
              onChange={(e) => handleInputChange(e, 'problemTimeLimit')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.problemTimeLimit ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.problemTimeLimit && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.problemTimeLimit}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Attempts *
            </label>
            <input
              id="maxAttempts"
              type="number"
              min="1"
              max="10"
              value={formData.maxAttempts}
              onChange={(e) => handleInputChange(e, 'maxAttempts')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.maxAttempts ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.maxAttempts && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.maxAttempts}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="wrongSubmissionPenalty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Wrong Submission Penalty (points) *
            </label>
            <input
              id="wrongSubmissionPenalty"
              type="number"
              min="0"
              max="1000"
              value={formData.wrongSubmissionPenalty}
              onChange={(e) => handleInputChange(e, 'wrongSubmissionPenalty')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                formErrors.wrongSubmissionPenalty ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.wrongSubmissionPenalty && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.wrongSubmissionPenalty}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SettingsTab;
