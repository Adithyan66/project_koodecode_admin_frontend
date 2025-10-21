import { AlertCircle, Minus, Plus } from 'lucide-react';
import React from 'react';
import type { Parameter, ParameterConstraint } from '../../../../types/problemCreate';

type Props = {
  parameters: Parameter[];
  parameterConstraints: ParameterConstraint[];
  setParameterConstraints: React.Dispatch<React.SetStateAction<ParameterConstraint[]>>;
  errors: { [key: string]: string };
};

const ConstraintsTab: React.FC<Props> = ({
  parameters,
  parameterConstraints,
  setParameterConstraints,
  errors,
}) => {
  const addConstraint = () => {
    const newConstraint: ParameterConstraint = {
      parameterName: '',
      type: 'number',
      minValue: undefined,
      maxValue: undefined,
      minLength: undefined,
      maxLength: undefined,
      allowedChars: undefined,
      arrayMinLength: undefined,
      arrayMaxLength: undefined,
      elementConstraints: undefined,
    };
    setParameterConstraints((prev) => [...prev, newConstraint]);
  };

  const removeConstraint = (index: number) => {
    setParameterConstraints((prev) => prev.filter((_, i) => i !== index));
  };

  const updateConstraint = (index: number, field: keyof ParameterConstraint, value: any) => {
    setParameterConstraints((prev) =>
      prev.map((constraint, i) =>
        i === index ? { ...constraint, [field]: value } : constraint,
      ),
    );
  };

  const getConstraintTypeOptions = (parameterType: string) => {
    switch (parameterType) {
      case 'number':
        return ['number'];
      case 'string':
        return ['string'];
      case 'boolean':
        return ['boolean'];
      case 'number[]':
      case 'string[]':
      case 'boolean[]':
        return ['array'];
      case 'number[][]':
      case 'string[][]':
        return ['array'];
      case 'TreeNode':
      case 'ListNode':
        return ['tree', 'list'];
      default:
        return ['object'];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-300">
            <AlertCircle className="mr-2 h-5 w-5" />
            Parameter Constraints
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define constraints for input parameters to validate test cases
          </p>
        </div>
        <button
          type="button"
          onClick={addConstraint}
          className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white shadow-md transition-colors hover:bg-orange-600 hover:shadow-lg dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Constraint
        </button>
      </div>

      {errors.constraints && <p className="text-sm text-red-500 dark:text-red-400">{errors.constraints}</p>}

      <div className="space-y-4">
        {parameterConstraints.map((constraint, index) => (
          <div
            key={index}
            className="rounded-lg border-2 border-gray-200 bg-white p-6 transition-colors hover:border-orange-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-orange-500"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center font-medium text-gray-700 dark:text-gray-300">
                <span className="mr-3 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Constraint {index + 1}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => removeConstraint(index)}
                className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Parameter Name *
                </label>
                <select
                  value={constraint.parameterName}
                  onChange={(e) => updateConstraint(index, 'parameterName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                >
                  <option value="">Select parameter</option>
                  {parameters
                    .filter((p) => p.name.trim())
                    .map((param) => (
                      <option key={param.id} value={param.name}>
                        {param.name} ({param.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Constraint Type *
                </label>
                <select
                  value={constraint.type}
                  onChange={(e) => updateConstraint(index, 'type', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                >
                  {getConstraintTypeOptions(
                    parameters.find((p) => p.name === constraint.parameterName)?.type || '',
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Number constraints */}
            {constraint.type === 'number' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Min Value
                  </label>
                  <input
                    type="number"
                    value={constraint.minValue || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'minValue', parseFloat(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Minimum value"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={constraint.maxValue || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'maxValue', parseFloat(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Maximum value"
                  />
                </div>
              </div>
            )}

            {/* String constraints */}
            {constraint.type === 'string' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={constraint.minLength || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'minLength', parseInt(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Minimum length"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={constraint.maxLength || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'maxLength', parseInt(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Maximum length"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Allowed Characters
                  </label>
                  <input
                    type="text"
                    value={constraint.allowedChars || ''}
                    onChange={(e) => updateConstraint(index, 'allowedChars', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="e.g., abcdefghijklmnopqrstuvwxyz"
                  />
                </div>
              </div>
            )}

            {/* Array constraints */}
            {constraint.type === 'array' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Min Array Length
                  </label>
                  <input
                    type="number"
                    value={constraint.arrayMinLength || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'arrayMinLength', parseInt(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Minimum array length"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Max Array Length
                  </label>
                  <input
                    type="number"
                    value={constraint.arrayMaxLength || ''}
                    onChange={(e) =>
                      updateConstraint(index, 'arrayMaxLength', parseInt(e.target.value) || undefined)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Maximum array length"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {parameterConstraints.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-slate-600 dark:bg-slate-800">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No constraints defined</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add constraints to validate input parameters for your problem.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConstraintsTab;