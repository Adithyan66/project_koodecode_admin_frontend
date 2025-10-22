import Input from '../../../Input';
import Toggle from '../../../Toggle';
import { Eye, EyeOff } from 'lucide-react';

interface BasicInfoCardProps {
  problem: any;
  isEditMode: boolean;
  isFieldModified: (field: string) => boolean;
  onFieldChange: (field: string, value: any) => void;
}

export function BasicInfoCard({ problem, isEditMode, isFieldModified, onFieldChange }: BasicInfoCardProps) {

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
          {isEditMode && isFieldModified('title') && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500" title="Modified"></span>
          )}
        </label>
        {isEditMode ? (
          <Input
            value={problem.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-100">{problem.title}</p>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Difficulty
          {isEditMode && isFieldModified('difficulty') && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500" title="Modified"></span>
          )}
        </label>
        {isEditMode ? (
          <select
            value={problem.difficulty}
            onChange={(e) => onFieldChange('difficulty', e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        ) : (
          <p className="text-gray-900 dark:text-gray-100">{problem.difficulty}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
          {isEditMode && isFieldModified('description') && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500" title="Modified"></span>
          )}
        </label>
        {isEditMode ? (
          <textarea
            value={problem.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={12}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        ) : (
          <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {problem.description}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
          {isEditMode && isFieldModified('isActive') && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500" title="Modified"></span>
          )}
        </label>
        {isEditMode ? (
          <div className="flex items-center gap-2">
            <Toggle
              checked={problem.isActive}
              onChange={(e) => onFieldChange('isActive', e.target.checked)}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {problem.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {problem.isActive ? (
              <>
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Active</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Inactive</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
