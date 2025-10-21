import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Code, Settings, Tag, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchLanguages, createProblem } from '../api/problems';
import type { LanguageItem } from '../types/language';
import BasicInfoTab from '../components/admin/problems/addProblems/BasicInfoTab';
import FunctionDefinitionTab from '../components/admin/problems/addProblems/FunctionDefinitionTab';
import ConstraintsTab from '../components/admin/problems/addProblems/ConstraintsTab';
import ExamplesTab from '../components/admin/problems/addProblems/ExamplesTab';
import TestCasesTab from '../components/admin/problems/addProblems/TestCasesTab';
import MetadataTab from '../components/admin/problems/addProblems/MetadataTab';
import type {
  Parameter,
  ParameterConstraint,
  Example,
  TestCase,
  ProblemTemplate,
} from '../types/problemCreate';

// Define the sequence of tabs
const TAB_SEQUENCE = [
  { id: 'basic', title: 'Basic Info', icon: Settings },
  { id: 'function', title: 'Function Definition', icon: Code },
  { id: 'constraints', title: 'Constraints', icon: AlertCircle },
  { id: 'examples', title: 'Examples', icon: Eye },
  { id: 'testcases', title: 'Test Cases', icon: Check },
  { id: 'metadata', title: 'Tags & Metadata', icon: Tag },
];

export default function ProblemCreate() {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // Basic Information
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Function Definition
  const [functionName, setFunctionName] = useState('');
  const [returnType, setReturnType] = useState('number');
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: '1', name: '', type: 'number', description: '' },
  ]);

  // Constraints
  const [parameterConstraints, setParameterConstraints] = useState<ParameterConstraint[]>([]);

  // Examples and Test Cases
  const [examples, setExamples] = useState<Example[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  // Additional Fields
  const [tags, setTags] = useState<string[]>(['']);
  const [hints, setHints] = useState<string[]>(['']);
  const [companies, setCompanies] = useState<string[]>(['']);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const [templates, setTemplates] = useState<ProblemTemplate>({});

  useEffect(() => {
    const loadLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const fetchedLanguages = await fetchLanguages();
        setLanguages(fetchedLanguages);
        // Pre-select common languages (optional)
        const commonLanguageNames = ['JavaScript', 'Python', 'Java', 'C++'];
        const commonLanguageIds = fetchedLanguages
          .filter((lang: LanguageItem) => commonLanguageNames.some((name) => lang.name.includes(name)))
          .map((lang: LanguageItem) => lang.id);
        setSelectedLanguageIds(commonLanguageIds);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        toast.error('Failed to load supported languages');
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  const isValidName = (name: string) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return isNaN(value);
    if (Array.isArray(value)) return value.length === 0;
    return false;
  };

  const validateExamples = () => {
    if (examples.length === 0) return false;

    return examples.some((example) => {
      const validParams = parameters.filter((p) => p.name.trim());
      const allInputsFilled = validParams.every((param) => !isEmpty(example.inputs[param.name]));
      const outputFilled = !isEmpty(example.expectedOutput);
      const explanationFilled = !isEmpty(example.explanation);

      return allInputsFilled && outputFilled && explanationFilled;
    });
  };

  const canGoNext = () => {
    switch (currentTabIndex) {
      case 0:
        return title.trim() && description.trim();
      case 1:
        return (
          functionName.trim() &&
          isValidName(functionName) &&
          parameters.every((p) => p.name.trim() && isValidName(p.name) && p.type)
        );
      case 2:
        return parameterConstraints.length > 0;
      case 3:
        return validateExamples();
      case 4:
        return (
          testCases.filter((tc) => {
            const validParams = parameters.filter((p) => p.name.trim());
            const allInputsFilled = validParams.every((param) => !isEmpty(tc.inputs[param.name]));
            return allInputsFilled && !isEmpty(tc.expectedOutput);
          }).length >= 5
        );
      default:
        return true;
    }
  };

  const getValidationMessage = () => {
    switch (currentTabIndex) {
      case 0:
        if (!title.trim()) return 'Title is required';
        if (!description.trim()) return 'Description is required';
        return '';
      case 1:
        if (!functionName.trim()) return 'Function name is required';
        if (!isValidName(functionName)) return 'Function name invalid (no spaces allowed)';
        const invalidParam = parameters.find((p) => !p.name.trim() || !isValidName(p.name) || !p.type);
        if (invalidParam) return 'All parameters must have valid names and types';
        return '';
      case 2:
        if (parameterConstraints.length === 0) return 'No constraints defined';
        return '';
      case 3:
        if (examples.length === 0) return 'No examples created';
        const validParams = parameters.filter((p) => p.name.trim());
        const incompleteExamples = examples.filter((example) => {
          const allInputsFilled = validParams.every((param) => !isEmpty(example.inputs[param.name]));
          const outputFilled = !isEmpty(example.expectedOutput);
          const explanationFilled = !isEmpty(example.explanation);
          return !(allInputsFilled && outputFilled && explanationFilled);
        });
        if (incompleteExamples.length === examples.length) {
          return 'At least one complete example required (all inputs, output, and explanation)';
        }
        return '';
      case 4:
        const validTestCases = testCases.filter((tc) => {
          const validParams = parameters.filter((p) => p.name.trim());
          const allInputsFilled = validParams.every((param) => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        });
        if (validTestCases.length < 5) return `Need at least 5 complete test cases (have ${validTestCases.length})`;
        return '';
      default:
        return '';
    }
  };

  const nextTab = () => {
    if (currentTabIndex < TAB_SEQUENCE.length - 1 && canGoNext()) {
      setCurrentTabIndex(currentTabIndex + 1);
    }
  };

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setCurrentTabIndex(currentTabIndex - 1);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Problem name is required';
    if (!description.trim()) newErrors.description = 'Problem description is required';
    if (!functionName.trim()) newErrors.functionName = 'Function name is required';
    if (!isValidName(functionName))
      newErrors.functionName = 'Function name can only contain letters, numbers, and underscore (no spaces)';

    if (selectedLanguageIds.length === 0) {
      newErrors.languages = 'At least one programming language must be selected';
    }

    parameters.forEach((param, index) => {
      if (!param.name.trim()) newErrors[`param_${index}_name`] = 'Parameter name is required';
      if (!isValidName(param.name))
        newErrors[`param_${index}_name`] = 'Parameter name can only contain letters, numbers, and underscore (no spaces)';
      if (!param.type) newErrors[`param_${index}_type`] = 'Parameter type is required';
    });

    if (!validateExamples()) newErrors.examples = 'At least one complete example is required';

    const missingTemplates = selectedLanguageIds.filter(
      (langId) =>
        !templates[langId] ||
        !templates[langId].templateCode.trim() ||
        !templates[langId].templateCode.includes(templates[langId].placeholder),
    );

    if (missingTemplates.length > 0) {
      const missingLangNames = languages
        .filter((lang) => missingTemplates.includes(lang.id))
        .map((lang) => lang.name)
        .join(', ');
      newErrors.templates = `Templates missing or invalid for: ${missingLangNames}`;
    }

    const validTestCases = testCases.filter((tc) => {
      const validParams = parameters.filter((p) => p.name.trim());
      const allInputsFilled = validParams.every((param) => !isEmpty(tc.inputs[param.name]));
      return allInputsFilled && !isEmpty(tc.expectedOutput);
    });
    if (validTestCases.length < 5) newErrors.testCases = 'At least 5 complete test cases are required';

    const nonEmptyTags = tags.filter((tag) => tag.trim());
    if (nonEmptyTags.length === 0) newErrors.tags = 'At least one tag is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const problemData = {
        title: title.trim(),
        difficulty,
        description: description.trim(),
        functionName: functionName.trim(),
        supportedLanguages: selectedLanguageIds,
        returnType,
        templates: templates,
        parameters: parameters.filter((p) => p.name.trim()),
        constraints: parameterConstraints,
        examples: examples.filter((ex) => {
          const validParams = parameters.filter((p) => p.name.trim());
          const allInputsFilled = validParams.every((param) => !isEmpty(ex.inputs[param.name]));
          return allInputsFilled && !isEmpty(ex.expectedOutput) && !isEmpty(ex.explanation);
        }),
        testCases: testCases.filter((tc) => {
          const validParams = parameters.filter((p) => p.name.trim());
          const allInputsFilled = validParams.every((param) => !isEmpty(tc.inputs[param.name]));
          return allInputsFilled && !isEmpty(tc.expectedOutput);
        }),
        tags: tags.filter((tag) => tag.trim()),
        hints: hints.filter((hint) => hint.trim()),
        companies: companies.filter((company) => company.trim()),
        isActive,
      };

      try {
        const res = await createProblem(problemData);

        if (res.success) {
          toast.success('Problem created successfully!');
          navigate('/problems');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to create problem');
      }
    }
  };

  const currentTab = TAB_SEQUENCE[currentTabIndex];

  return (
    <div className="flex min-h-screen flex-col ">
      <div className="mx-auto w-full  flex-1 rounded-2xl ">
          <h1 className="mb-2 text-2xl font-bold ">Create New Problem</h1>
          <p className="text-gray-800">
            Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}: {currentTab.title}
          </p>

        <div className="border-b border-gray-200  p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            {TAB_SEQUENCE.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    index <= currentTabIndex
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                </div>
                {index < TAB_SEQUENCE.length - 1 && (
                  <div
                    className={`ml-2 h-1 w-20 transition-colors ${
                      index < currentTabIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">{currentTab.title}</h2>
        </div>

        <div className="min-h-96 p-8">
          {currentTabIndex === 0 && (
            <BasicInfoTab
              title={title}
              setTitle={setTitle}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              description={description}
              setDescription={setDescription}
              isActive={isActive}
              setIsActive={setIsActive}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentTabIndex === 1 && (
            <FunctionDefinitionTab
              functionName={functionName}
              setFunctionName={setFunctionName}
              returnType={returnType}
              setReturnType={setReturnType}
              parameters={parameters}
              setParameters={setParameters}
              languages={languages}
              selectedLanguageIds={selectedLanguageIds}
              setSelectedLanguageIds={setSelectedLanguageIds}
              templates={templates}
              setTemplates={setTemplates}
              isLoadingLanguages={isLoadingLanguages}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {currentTabIndex === 2 && (
            <ConstraintsTab
              parameters={parameters}
              parameterConstraints={parameterConstraints}
              setParameterConstraints={setParameterConstraints}
              errors={errors}
            />
          )}

          {currentTabIndex === 3 && (
            <ExamplesTab
              examples={examples}
              setExamples={setExamples}
              parameters={parameters}
              returnType={returnType}
              parameterConstraints={parameterConstraints}
              errors={errors}
            />
          )}

          {currentTabIndex === 4 && (
            <TestCasesTab
              testCases={testCases}
              setTestCases={setTestCases}
              parameters={parameters}
              returnType={returnType}
              parameterConstraints={parameterConstraints}
              errors={errors}
            />
          )}

          {currentTabIndex === 5 && (
            <MetadataTab
              tags={tags}
              setTags={setTags}
              hints={hints}
              setHints={setHints}
              companies={companies}
              setCompanies={setCompanies}
              errors={errors}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={prevTab}
            disabled={currentTabIndex === 0}
            className={`flex items-center rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
              currentTabIndex === 0
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-gray-600 text-white shadow-md hover:bg-gray-700 hover:shadow-lg'
            }`}
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentTabIndex + 1} of {TAB_SEQUENCE.length}
            </div>
            {!canGoNext() && currentTabIndex < TAB_SEQUENCE.length - 1 && (
              <div className="mt-1 text-xs text-red-500">{getValidationMessage()}</div>
            )}
          </div>

          {currentTabIndex === TAB_SEQUENCE.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Check className="mr-2 h-5 w-5" />
              Create Problem
            </button>
          ) : (
            <button
              type="button"
              onClick={nextTab}
              disabled={!canGoNext()}
              className={`flex items-center rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
                canGoNext()
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


