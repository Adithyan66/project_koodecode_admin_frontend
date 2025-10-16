import { Plus, X } from 'lucide-react';
import type {
  Parameter,
  ParameterConstraint,
  ParameterValue,
  TestCase,
} from '../../../../types/problemCreate';
import React from 'react';

type Props = {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  parameters: Parameter[];
  returnType: string;
  parameterConstraints: ParameterConstraint[];
  errors: { [key: string]: string };
};

const TestCasesTab: React.FC<Props> = ({
  testCases,
  setTestCases,
  parameters,
  returnType,
  parameterConstraints,
  errors,
}) => {
  const addTestCase = () => {
    const initialInputs: ParameterValue = {};
    parameters
      .filter((p) => p.name.trim())
      .forEach((p) => {
        initialInputs[p.name] = '';
      });

    const newId = Date.now().toString();
    setTestCases((prev) => [
      ...prev,
      { id: newId, inputs: initialInputs, expectedOutput: '', isSample: false },
    ]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 5) {
      setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
    }
  };

  const updateTestCaseInput = (
    id: string,
    parameterName: string,
    value: any,
  ) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id
          ? { ...testCase, inputs: { ...testCase.inputs, [parameterName]: value } }
          : testCase,
      ),
    );
  };

  const updateTestCaseOutput = (id: string, value: any) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id ? { ...testCase, expectedOutput: value } : testCase,
      ),
    );
  };

  const updateTestCaseSample = (id: string, isSample: boolean) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id ? { ...testCase, isSample } : testCase,
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter JSON object"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Test Cases</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create comprehensive test cases to validate solutions (minimum 5 required)
          </p>
        </div>
        <button
          type="button"
          onClick={addTestCase}
          className="flex items-center rounded-lg bg-purple-500 px-4 py-2 text-white shadow-md transition-colors hover:bg-purple-600 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Test Case
        </button>
      </div>

      {errors.testCases && <p className="text-sm text-red-500">{errors.testCases}</p>}

      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div
            key={testCase.id}
            className="rounded-lg border-2 border-gray-200 bg-white p-6 transition-colors hover:border-purple-300"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center font-medium text-gray-700">
                <span className="mr-3 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                  Test Case {index + 1}
                </span>
              </h3>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={testCase.isSample}
                    onChange={(e) => updateTestCaseSample(testCase.id, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span>Sample (visible in examples)</span>
                </label>
                {testCases.length > 5 && (
                  <button
                    type="button"
                    onClick={() => removeTestCase(testCase.id)}
                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h4 className="border-b pb-2 font-medium text-gray-600">Input Parameters</h4>
                {parameters
                  .filter((p) => p.name.trim())
                  .map((param) => (
                    <div key={param.id}>
                      <label className="mb-2 block text-sm font-medium text-gray-600">
                        {param.name}{' '}
                        <span className="text-gray-400">({param.type})</span>
                      </label>
                      {generateInputField(
                        param,
                        testCase.inputs[param.name],
                        (value) => updateTestCaseInput(testCase.id, param.name, value),
                      )}
                    </div>
                  ))}
              </div>

              <div>
                <h4 className="mb-4 border-b pb-2 font-medium text-gray-600">Expected Output</h4>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Result <span className="text-gray-400">({returnType})</span>
                </label>
                {generateInputField(
                  { name: 'output', type: returnType, description: '', id: 'output' },
                  testCase.expectedOutput,
                  (value) => updateTestCaseOutput(testCase.id, value),
                  'Expected result',
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCasesTab;
