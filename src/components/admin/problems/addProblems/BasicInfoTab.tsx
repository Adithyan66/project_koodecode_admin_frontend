import React from 'react';
import Input from '../../../Input';

export interface BasicInfoTabProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  problemType: 'array' | 'pattern' | 'dsa';
  setProblemType: React.Dispatch<React.SetStateAction<'array' | 'pattern' | 'dsa'>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  title,
  setTitle,
  difficulty,
  setDifficulty,
  problemType,
  setProblemType,
  description,
  setDescription,
  isActive,
  setIsActive,
  errors,
  setErrors,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Problem Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-200 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100'
              }`}
              placeholder="Two Sum"
              onBlur={() => {
                if (!title.trim()) {
                  setErrors((prev) => ({ ...prev, title: 'Problem name is required' }));
                } else {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
            />
            {errors.title && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Difficulty Level *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Problem Type *
            </label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value as 'array' | 'pattern' | 'dsa')}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
            >
              <option value="array">Array</option>
              <option value="pattern">Pattern</option>
              <option value="dsa">DSA</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Make problem active immediately
            </label>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Problem Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            className={`w-full resize-none rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-gray-100 ${
              errors.description 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-200 focus:border-blue-500 dark:border-slate-600'
            }`}
            placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
            onBlur={() => {
              if (!description.trim()) {
                setErrors((prev) => ({ ...prev, description: 'Problem description is required' }));
              } else {
                setErrors((prev) => ({ ...prev, description: '' }));
              }
            }}
          />
          {errors.description && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
