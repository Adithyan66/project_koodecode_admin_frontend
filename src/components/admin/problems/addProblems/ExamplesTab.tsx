import { Plus, X } from 'lucide-react';
import type {
  Example,
  Parameter,
  ParameterConstraint,
  ParameterValue,
} from '../../../../types/problemCreate';
import React from 'react';

type Props = {
  examples: Example[];
  setExamples: React.Dispatch<React.SetStateAction<Example[]>>;
  parameters: Parameter[];
  returnType: string;
  parameterConstraints: ParameterConstraint[];
  errors: { [key: string]: string };
};

const ExamplesTab: React.FC<Props> = ({
  examples,
  setExamples,
  parameters,
  returnType,
  parameterConstraints,
  errors,
}) => {
  const addExample = () => {
    if (examples.length < 3) {
      const initialInputs: ParameterValue = {};
      parameters
        .filter((p) => p.name.trim())
        .forEach((p) => {
          initialInputs[p.name] = '';
        });

      const newId = Date.now().toString();
      setExamples((prev) => [
        ...prev,
        { id: newId, inputs: initialInputs, expectedOutput: '', explanation: '' },
      ]);
    }
  };

  const removeExample = (id: string) => {
    if (examples.length > 1) {
      setExamples((prev) => prev.filter((example) => example.id !== id));
    }
  };

  const updateExampleInput = (
    id: string,
    parameterName: string,
    value: any,
  ) => {
    setExamples((prev) =>
      prev.map((example) =>
        example.id === id
          ? { ...example, inputs: { ...example.inputs, [parameterName]: value } }
          : example,
      ),
    );
  };

  const updateExampleOutput = (id: string, value: any) => {
    setExamples((prev) =>
      prev.map((example) =>
        example.id === id ? { ...example, expectedOutput: value } : example,
      ),
    );
  };

  const updateExampleExplanation = (id: string, value: string) => {
    setExamples((prev) =>
      prev.map((example) =>
        example.id === id ? { ...example, explanation: value } : example,
      ),
    );
  };

  const generateInputField = (
    parameter: Parameter,
    value: any,
    onChange: (value: any) => void,
    placeholder?: string,
  ) => {
    const constraint = parameterConstraints.find(
      (c) => c.parameterName === parameter.name,
    );

    switch (parameter.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder={placeholder || `Enter ${parameter.name}`}
            min={constraint?.minValue}
            max={constraint?.maxValue}
          />
        );

      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder={placeholder || `Enter ${parameter.name}`}
            minLength={constraint?.minLength}
            maxLength={constraint?.maxLength}
          />
        );

      case 'boolean':
        return (
          <select
            value={value?.toString() || 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
          >
            <option value="">Select boolean</option>
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        );

      case 'number[]':
      case 'string[]':
      case 'boolean[]':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder={
              parameter.type === 'number[]'
                ? '[1,2,3,4]'
                : parameter.type === 'string[]'
                ? '["a","b","c"]'
                : '[true,false,true]'
            }
          />
        );

      case 'number[][]':
      case 'string[][]':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder={
              parameter.type === 'number[][]'
                ? '[[1,2],[3,4]]'
                : '[["a","b"],["c","d"]]'
            }
          />
        );

      case 'TreeNode':
      case 'ListNode':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder={
              parameter.type === 'TreeNode'
                ? '[1,2,3,null,4]'
                : '[1,2,3,4,5]'
            }
          />
        );

      default:
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
            placeholder="Enter JSON object"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Examples</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create 1-3 examples to help users understand the problem</p>
        </div>
        {examples.length < 3 && (
          <button
            type="button"
            onClick={addExample}
            className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white shadow-md transition-colors hover:bg-green-600 hover:shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Example
          </button>
        )}
      </div>

      {errors.examples && <p className="text-sm text-red-500 dark:text-red-400">{errors.examples}</p>}

      <div className="space-y-6">
        {examples.map((example, index) => (
          <div
            key={example.id}
            className="rounded-lg border-2 border-gray-200 bg-white p-6 transition-colors hover:border-green-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-green-500"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                <span className="mr-3 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                  Example {index + 1}
                </span>
              </h3>
              {examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExample(example.id)}
                  className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="border-b pb-2 font-medium text-gray-600 dark:text-gray-400">Input Parameters</h4>
                {parameters
                  .filter((p) => p.name.trim())
                  .map((param) => (
                    <div key={param.id}>
                      <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                        {param.name}{' '}
                        <span className="text-gray-400 dark:text-gray-500">({param.type})</span>
                      </label>
                      {generateInputField(
                        param,
                        example.inputs[param.name],
                        (value) => updateExampleInput(example.id, param.name, value),
                      )}
                    </div>
                  ))}
              </div>

              <div>
                <h4 className="mb-4 border-b pb-2 font-medium text-gray-600 dark:text-gray-400">Expected Output</h4>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Result <span className="text-gray-400 dark:text-gray-500">({returnType})</span>
                </label>
                {generateInputField(
                  { name: 'output', type: returnType, description: '', id: 'output' },
                  example.expectedOutput,
                  (value) => updateExampleOutput(example.id, value),
                  'Expected result',
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Explanation *</label>
              <textarea
                value={example.explanation}
                onChange={(e) => updateExampleExplanation(example.id, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                placeholder="Explain how the output is derived from the input..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamplesTab;


