import { ArrowLeft, Eye, EyeOff, Edit3, Save, X, Copy, Trash2 } from 'lucide-react';
import Button from '../../../Button';

interface ProblemHeaderProps {
  problem: any;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onEditToggle: () => void;
  onSaveChanges: () => void;
  onToggleActive: () => void;
  onClone: () => void;
  onDelete: () => void;
}

export function ProblemHeader({
  problem,
  isEditMode,
  hasUnsavedChanges,
  onBack,
  onEditToggle,
  onSaveChanges,
  onToggleActive,
  onClone,
  onDelete,
}: ProblemHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            #{problem.problemNumber}. {problem.title}
          </h1>
          <p className="text-sm text-gray-500">
            Created by {problem.createdBy.fullName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Status Badge */}
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-1 ${
          problem.isActive
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-gray-300 bg-gray-100 text-gray-600'
        }`}>
          {problem.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {problem.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Action Buttons */}
        {isEditMode ? (
          <>
            <Button variant="ghost" onClick={onEditToggle}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={onSaveChanges} disabled={!hasUnsavedChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onToggleActive}>
              {problem.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {problem.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="secondary" onClick={onClone}>
              <Copy className="mr-2 h-4 w-4" />
              Clone
            </Button>
            <Button variant="secondary" onClick={onEditToggle}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="secondary"
              onClick={onDelete}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
