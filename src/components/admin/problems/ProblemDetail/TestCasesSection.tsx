import { FileText, Plus, AlertCircle, CheckCircle, Edit3, Trash2, X } from 'lucide-react';
import Button from '../../../Button';
import Input from '../../../Input';
import Toggle from '../../../Toggle';

interface TestCasesSectionProps {
  testCases: any[];
  problem: any;
  isEditMode: boolean;
  loading: boolean;
  error: string | null;
  pagination: any;
  onAddTestCase: () => void;
  onEditTestCase: (testCase: any) => void;
  onSaveTestCase: () => void;
  onCancelTestCase: () => void;
  onDeleteTestCase: (id: string) => void;
  editingTestCaseId: string | null;
  editedTestCase: any;
  onTestCaseChange: (field: string, value: any) => void;
}

export function TestCasesSection({
  testCases,
  problem,
  isEditMode,
  loading,
  error,
  pagination,
  onAddTestCase,
  onEditTestCase,
  onSaveTestCase,
  onCancelTestCase,
  onDeleteTestCase,
  editingTestCaseId,
  editedTestCase,
  onTestCaseChange,
}: TestCasesSectionProps) {
  const formatArrayForDisplay = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (testCases.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <p>No test cases found</p>
        {isEditMode && (
          <Button onClick={onAddTestCase} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Test Case
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Test Cases ({pagination.state.totalCount})
        </h3>
        {isEditMode && (
          <Button onClick={onAddTestCase}>
            <Plus className="mr-2 h-4 w-4" />
            Add Test Case
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Inputs</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Expected Output</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Sample</th>
              {isEditMode && <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase, index) => {
              const isEditing = editingTestCaseId === testCase.id;
              const displayTestCase = isEditing && editedTestCase ? editedTestCase : testCase;
              const isTemporary = testCase.id.startsWith('temp-');

              return (
                <tr key={testCase.id} className={`border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${isTemporary ? 'bg-yellow-50 dark:bg-yellow-900' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium">
                    {isTemporary ? (
                      <span className="text-yellow-600 dark:text-yellow-400">New</span>
                    ) : (
                      pagination.state.startIndex + index + 1
                    )}
                  </td>

                  {/* Inputs Column */}
                  <td className="px-2 py-2">
                    <table className="w-full">
                      <tbody>
                        {problem.parameters.map((param: any) => (
                          <tr key={param.name} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
                            <td className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400" style={{ width: '40%' }}>
                              {param.name}
                            </td>
                            <td className="px-2 py-2" style={{ width: '60%' }}>
                              {isEditing ? (
                                param.type.includes('[]') ? (
                                  <Input
                                    value={formatArrayForDisplay(displayTestCase.inputs[param.name])}
                                    onChange={(e) => onTestCaseChange('inputs', { ...displayTestCase.inputs, [param.name]: e.target.value })}
                                    placeholder="e.g., 1, 2, 3"
                                    className="text-xs"
                                  />
                                ) : param.type === 'boolean' ? (
                                  <select
                                    value={String(displayTestCase.inputs[param.name])}
                                    onChange={(e) => onTestCaseChange('inputs', { ...displayTestCase.inputs, [param.name]: e.target.value === 'true' })}
                                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                                  >
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                  </select>
                                ) : param.type === 'number' ? (
                                  <Input
                                    type="number"
                                    value={displayTestCase.inputs[param.name]}
                                    onChange={(e) => onTestCaseChange('inputs', { ...displayTestCase.inputs, [param.name]: parseFloat(e.target.value) })}
                                    className="text-xs"
                                  />
                                ) : (
                                  <Input
                                    value={displayTestCase.inputs[param.name]}
                                    onChange={(e) => onTestCaseChange('inputs', { ...displayTestCase.inputs, [param.name]: e.target.value })}
                                    className="text-xs"
                                  />
                                )
                              ) : (
                                <span className="text-xs font-mono">
                                  {Array.isArray(displayTestCase.inputs[param.name])
                                    ? `[${displayTestCase.inputs[param.name].join(', ')}]`
                                    : String(displayTestCase.inputs[param.name])}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>

                  {/* Expected Output Column */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      problem.returnType.includes('[]') ? (
                        <Input
                          value={formatArrayForDisplay(displayTestCase.expectedOutput)}
                          onChange={(e) => onTestCaseChange('expectedOutput', e.target.value)}
                          placeholder="e.g., 1, 2, 3"
                          className="font-mono text-xs"
                        />
                      ) : problem.returnType === 'boolean' ? (
                        <select
                          value={String(displayTestCase.expectedOutput)}
                          onChange={(e) => onTestCaseChange('expectedOutput', e.target.value === 'true')}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : problem.returnType === 'number' ? (
                        <Input
                          type="number"
                          value={String(displayTestCase.expectedOutput)}
                          onChange={(e) => onTestCaseChange('expectedOutput', parseFloat(e.target.value))}
                          className="font-mono text-xs"
                        />
                      ) : (
                        <Input
                          value={String(displayTestCase.expectedOutput)}
                          onChange={(e) => onTestCaseChange('expectedOutput', e.target.value)}
                          className="font-mono text-xs"
                        />
                      )
                    ) : (
                      <span className="font-mono text-xs">
                        {Array.isArray(displayTestCase.expectedOutput)
                          ? `[${displayTestCase.expectedOutput.join(', ')}]`
                          : String(displayTestCase.expectedOutput)}
                      </span>
                    )}
                  </td>

                  {/* Sample Toggle Column */}
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <Toggle
                        checked={displayTestCase.isSample}
                        onChange={(e) => onTestCaseChange('isSample', e.target.checked)}
                      />
                    ) : (
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${displayTestCase.isSample
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {displayTestCase.isSample ? 'Sample' : 'Hidden'}
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  {isEditMode && (
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={onSaveTestCase}
                              className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                              title="Save"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={onCancelTestCase}
                              className="rounded p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onEditTestCase(testCase)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteTestCase(testCase.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600">
          Showing {pagination.state.startIndex + 1} to {Math.min(pagination.state.endIndex + 1, pagination.state.totalCount)} of {pagination.state.totalCount}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={!pagination.state.hasPreviousPage}
            onClick={pagination.actions.goToPreviousPage}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.state.page} of {pagination.state.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={!pagination.state.hasNextPage}
            onClick={pagination.actions.goToNextPage}
          >
            Next
          </Button>
          <select
            value={pagination.state.limit}
            onChange={(e) => pagination.actions.setLimit(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}

