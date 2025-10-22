import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { usePagination } from '../utils/usePagination';
import { useGlobalLoading } from '../ui/useGlobalLoading';
import {
  fetchProblemDetail,
  updateProblem,
  deleteProblem,
  cloneProblem,
  fetchTestCases,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  fetchLanguages,
} from '../../api/problems';
import { generateDefaultTemplate } from '../../utils/templateGenerator';
import type { ProblemDetail as ProblemDetailType, TestCase, UpdateProblemPayload, ProblemExample } from '../../types/problemDetail';
import type { Parameter, LanguageTemplate } from '../../types/problemCreate';
import type { Language } from '../../types/problemCreate';

interface UseProblemDetailProps {
  slug: string;
}

export function useProblemDetail({ slug }: UseProblemDetailProps) {
  const { showLoading, hideLoading } = useGlobalLoading();

  // State Management
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'testcases' | 'templates'>('testcases');

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    onConfirm?: () => void;
    showCancel: boolean;
    confirmText: string;
    cancelText: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCancel: false,
    confirmText: 'OK',
    cancelText: 'Cancel'
  });

  // Problem Data
  const [problem, setProblem] = useState<ProblemDetailType | null>(null);
  const [editedProblem, setEditedProblem] = useState<ProblemDetailType | null>(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState<string | null>(null);

  // Test Cases Data
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testCasesTotalCount, setTestCasesTotalCount] = useState(0);
  const [loadingTestCases, setLoadingTestCases] = useState(false);
  const [testCasesError, setTestCasesError] = useState<string | null>(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
  const [editedTestCase, setEditedTestCase] = useState<TestCase | null>(null);

  // Languages
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

  // Pagination for test cases
  const testCasesPagination = usePagination({
    initialPage: 1,
    initialLimit: 5,
    totalCount: testCasesTotalCount,
  });

  // Load Problem Detail
  useEffect(() => {
    if (!slug) return;

    const loadProblem = async () => {
      setLoadingProblem(true);
      setProblemError(null);
      try {
        const response = await fetchProblemDetail(slug);
        setProblem(response.data);
        setEditedProblem(response.data);
      } catch (error: any) {
        setProblemError(error.response?.data?.message || 'Failed to load problem');
      } finally {
        setLoadingProblem(false);
      }
    };

    loadProblem();
  }, [slug]);

  // Load Test Cases
  const loadTestCases = useCallback(async () => {
    if (!slug) return;

    setLoadingTestCases(true);
    setTestCasesError(null);
    try {
      const response = await fetchTestCases(slug, testCasesPagination.state.page, testCasesPagination.state.limit);
      setTestCases(response.data.testCases);
      setTestCasesTotalCount(response.data.totalCount);
    } catch (error: any) {
      setTestCasesError(error.response?.data?.message || 'Failed to load test cases');
    } finally {
      setLoadingTestCases(false);
    }
  }, [slug, testCasesPagination.state.page, testCasesPagination.state.limit]);

  useEffect(() => {
    loadTestCases();
  }, [loadTestCases]);

  // Load Languages
  useEffect(() => {
    const loadLanguages = async () => {
      setLoadingLanguages(true);
      try {
        const langs = await fetchLanguages();
        setLanguages(langs);
      } catch (error) {
        console.error('Failed to load languages:', error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  // Helper to deep compare arrays
  const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  // Helper to deep compare objects
  const objectsEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return a === b;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => objectsEqual(a[key], b[key]));
  };

  // Helper to compare objects and get changed fields
  const getChangedFields = (original: ProblemDetailType, edited: ProblemDetailType): Partial<UpdateProblemPayload> => {
    const changes: Partial<UpdateProblemPayload> = {};

    // Compare simple fields
    if (original.title !== edited.title) changes.title = edited.title;
    if (original.description !== edited.description) changes.description = edited.description;
    if (original.difficulty !== edited.difficulty) changes.difficulty = edited.difficulty;
    if (original.isActive !== edited.isActive) changes.isActive = edited.isActive;
    if (original.functionName !== edited.functionName) changes.functionName = edited.functionName;
    if (original.returnType !== edited.returnType) changes.returnType = edited.returnType;

    // Compare arrays
    if (!arraysEqual(original.tags, edited.tags)) changes.tags = edited.tags;
    if (!arraysEqual(original.hints, edited.hints)) changes.hints = edited.hints;
    if (!arraysEqual(original.companies, edited.companies)) changes.companies = edited.companies;
    if (!arraysEqual(original.supportedLanguages, edited.supportedLanguages)) {
      changes.supportedLanguages = edited.supportedLanguages;
    }

    // Compare complex objects
    if (!objectsEqual(original.constraints, edited.constraints)) {
      changes.constraints = edited.constraints;
    }
    if (!objectsEqual(original.examples, edited.examples)) {
      changes.examples = edited.examples;
    }
    if (!objectsEqual(original.parameters, edited.parameters)) {
      changes.parameters = edited.parameters;
    }
    if (!objectsEqual(original.templates, edited.templates)) {
      changes.templates = edited.templates;
    }

    return changes;
  };

  // Memoize changed fields to prevent unnecessary recalculations
  const changedFields = useMemo(() => {
    if (!problem || !editedProblem) return {};
    return getChangedFields(problem, editedProblem);
  }, [problem, editedProblem]);

  // Handle Edit Mode Toggle
  const handleEditToggle = () => {
    if (isEditMode && hasUnsavedChanges) {
      showModal({
        title: 'Discard Changes',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        type: 'warning',
        showCancel: true,
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
        onConfirm: () => {
          setEditedProblem(problem);
          setHasUnsavedChanges(false);
          setIsEditMode(false);
        }
      });
      return;
    }
    setIsEditMode(!isEditMode);
  };

  // Handle Field Changes
  const handleFieldChange = (field: keyof ProblemDetailType, value: any) => {
    setEditedProblem(prev => prev ? { ...prev, [field]: value } : null);
    setHasUnsavedChanges(true);
  };

  // Handle Save All Changes
  const handleSaveChanges = async () => {
    if (!slug || !editedProblem || !problem) return;

    showLoading('Saving changes...');
    try {
      // If no changes, just exit edit mode
      if (Object.keys(changedFields).length === 0) {
        setHasUnsavedChanges(false);
        setIsEditMode(false);
        toast.info('No changes to save.');
        return;
      }

      console.log('Sending only changed fields:', changedFields);

      await updateProblem(slug, changedFields);
      setProblem(editedProblem);
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      toast.success('Changes saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save changes');
    } finally {
      hideLoading();
    }
  };

  // Handle Delete Problem
  const handleDeleteProblem = async () => {
    if (!slug) return;

    showModal({
      title: 'Delete Problem',
      message: 'Are you sure you want to delete this problem? This action cannot be undone.',
      type: 'error',
      showCancel: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        showLoading('Deleting problem...');
        try {
          await deleteProblem(slug);
          toast.success('Problem deleted successfully!');
          // Navigate will be handled by the component
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete problem');
        } finally {
          hideLoading();
        }
      }
    });
  };

  // Handle Clone Problem
  const handleCloneProblem = async () => {
    if (!slug) return;

    showLoading('Cloning problem...');
    try {
      const response = await cloneProblem(slug);
      toast.success('Problem cloned successfully!');
      return response.data?.slug;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clone problem');
      return null;
    } finally {
      hideLoading();
    }
  };

  // Handle Toggle Active Status
  const handleToggleActive = async () => {
    if (!slug || !editedProblem) return;

    const newStatus = !editedProblem.isActive;
    showLoading(newStatus ? 'Activating problem...' : 'Deactivating problem...');

    try {
      await updateProblem(slug, { isActive: newStatus });
      const updated = { ...editedProblem, isActive: newStatus };
      setProblem(updated);
      setEditedProblem(updated);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      hideLoading();
    }
  };

  // Test Case CRUD Operations
  const handleAddTestCase = async () => {
    if (!slug || !editedProblem) return;

    // Create a temporary test case object for inline editing
    const tempTestCase: TestCase = {
      id: `temp-${Date.now()}`, // Temporary ID
      problemId: slug,
      inputs: {}, // Empty inputs
      expectedOutput: '', // Empty expected output
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initialize inputs based on problem parameters
    editedProblem.parameters.forEach(param => {
      tempTestCase.inputs[param.name] = '';
    });

    // Add to test cases list for inline editing
    setTestCases(prev => [tempTestCase, ...prev]);
    setEditingTestCaseId(tempTestCase.id);
    setEditedTestCase({ ...tempTestCase });
  };

  const handleEditTestCase = (testCase: TestCase) => {
    setEditingTestCaseId(testCase.id);
    setEditedTestCase({ ...testCase });
  };

  const handleSaveTestCase = async () => {
    if (!slug || !editedTestCase) return;

    showLoading('Saving test case...');
    try {
      // Convert comma-separated strings to arrays for array types
      const processedInputs = { ...editedTestCase.inputs };
      const processedExpectedOutput = editedTestCase.expectedOutput;

      // Process inputs based on parameter types
      if (editedProblem) {
        editedProblem.parameters.forEach(param => {
          if (param.type.includes('[]')) {
            // Convert comma-separated string to array
            const value = processedInputs[param.name];
            if (typeof value === 'string' && value.trim()) {
              processedInputs[param.name] = parseArrayInput(value, param.type);
            } else {
              processedInputs[param.name] = [];
            }
          }
        });
      }

      // Process expected output if it's an array type
      let finalExpectedOutput = processedExpectedOutput;
      if (editedProblem && editedProblem.returnType.includes('[]')) {
        if (typeof processedExpectedOutput === 'string' && processedExpectedOutput.trim()) {
          finalExpectedOutput = parseArrayInput(processedExpectedOutput, editedProblem.returnType);
        } else {
          finalExpectedOutput = [];
        }
      }

      // Check if this is a new test case (temporary ID)
      if (editedTestCase.id.startsWith('temp-')) {
        // Create new test case
        const response = await createTestCase(slug, {
          inputs: processedInputs,
          expectedOutput: finalExpectedOutput,
          isSample: editedTestCase.isSample
        });

        // Update pagination if provided
        if (response.data?.pagination) {
          setTestCasesTotalCount(response.data.pagination.totalCount);
        }

        // Reload test cases to get the real data
        loadTestCases();
      } else {
        // Update existing test case
        await updateTestCase(slug, editedTestCase.id, {
          inputs: processedInputs,
          expectedOutput: finalExpectedOutput,
          isSample: editedTestCase.isSample
        });
        loadTestCases();
      }

      setEditingTestCaseId(null);
      setEditedTestCase(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save test case');
    } finally {
      hideLoading();
    }
  };

  const handleCancelTestCase = () => {
    if (editedTestCase?.id.startsWith('temp-')) {
      // Remove temporary test case from list
      setTestCases(prev => prev.filter(tc => tc.id !== editedTestCase.id));
    }
    setEditingTestCaseId(null);
    setEditedTestCase(null);
  };

  const handleDeleteTestCase = async (testCaseId: string) => {
    if (!slug) return;

    showModal({
      title: 'Delete Test Case',
      message: 'Are you sure you want to delete this test case?',
      type: 'warning',
      showCancel: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        showLoading('Deleting test case...');
        try {
          await deleteTestCase(slug, testCaseId);
          loadTestCases();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete test case');
        } finally {
          hideLoading();
        }
      }
    });
  };

  // Helper to parse array input from comma-separated string
  const parseArrayInput = (value: string, type: string): any => {
    if (!value.trim()) return [];

    const items = value.split(',').map(item => item.trim());

    if (type.includes('number')) {
      return items.map(item => parseFloat(item)).filter(num => !isNaN(num));
    } else if (type.includes('boolean')) {
      return items.map(item => item.toLowerCase() === 'true');
    }
    return items;
  };

  // Template Management
  const handleAddLanguage = (languageId: number) => {
    if (!editedProblem) return;

    const language = languages.find(l => l.id === languageId);
    if (!language) return;

    // Generate template automatically using the shared utility
    const generatedTemplate = generateDefaultTemplate(
      language,
      editedProblem.functionName,
      editedProblem.returnType,
      editedProblem.parameters
    );

    setEditedProblem(prev => {
      if (!prev) return null;

      const newSupportedLanguages = [...prev.supportedLanguages, languageId];
      const newTemplates = {
        ...prev.templates,
        [languageId]: generatedTemplate
      };

      return {
        ...prev,
        supportedLanguages: newSupportedLanguages,
        templates: newTemplates
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveLanguage = (languageId: number) => {
    if (!editedProblem) return;

    showModal({
      title: 'Remove Language Template',
      message: 'Are you sure you want to remove this language template?',
      type: 'warning',
      showCancel: true,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      onConfirm: () => {
        setEditedProblem(prev => {
          if (!prev) return null;

          const newSupportedLanguages = prev.supportedLanguages.filter(id => id !== languageId);
          const newTemplates = { ...prev.templates };
          delete newTemplates[languageId];

          return {
            ...prev,
            supportedLanguages: newSupportedLanguages,
            templates: newTemplates
          };
        });
        setHasUnsavedChanges(true);
        if (activeTemplateTab === languageId) {
          setActiveTemplateTab(null);
        }
      }
    });
  };

  const handleUpdateTemplate = (languageId: number, field: keyof LanguageTemplate, value: string) => {
    if (!editedProblem) return;

    setEditedProblem(prev => {
      if (!prev) return null;

      return {
        ...prev,
        templates: {
          ...prev.templates,
          [languageId]: {
            ...prev.templates[languageId],
            [field]: value
          }
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  // Array field helpers
  const handleArrayFieldAdd = (field: 'tags' | 'hints' | 'companies', value: string) => {
    if (!editedProblem || !value.trim()) {
      console.log('Cannot add:', { field, value, editedProblem: !!editedProblem });
      return;
    }

    console.log('Adding to array field:', { field, value });

    setEditedProblem(prev => {
      if (!prev) return null;
      const newArray = [...prev[field], value.trim()];
      console.log('New array:', newArray);
      return {
        ...prev,
        [field]: newArray
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleArrayFieldRemove = (field: 'tags' | 'hints' | 'companies', index: number) => {
    if (!editedProblem) return;

    setEditedProblem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      };
    });
    setHasUnsavedChanges(true);
  };

  // Example helpers
  const handleExampleUpdate = (index: number, field: keyof ProblemExample, value: any) => {
    if (!editedProblem) return;

    setEditedProblem(prev => {
      if (!prev) return null;
      const newExamples = [...prev.examples];
      newExamples[index] = { ...newExamples[index], [field]: value };
      return { ...prev, examples: newExamples };
    });
    setHasUnsavedChanges(true);
  };

  // Parameter helpers
  const handleParameterUpdate = (index: number, field: keyof Parameter, value: any) => {
    if (!editedProblem) return;

    setEditedProblem(prev => {
      if (!prev) return null;
      const newParameters = [...prev.parameters];
      newParameters[index] = { ...newParameters[index], [field]: value };
      return { ...prev, parameters: newParameters };
    });
    setHasUnsavedChanges(true);
  };

  // Modal helper functions
  const showModal = (config: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    onConfirm?: () => void;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
  }) => {
    setModal({
      isOpen: true,
      title: config.title,
      message: config.message,
      type: config.type || 'info',
      onConfirm: config.onConfirm,
      showCancel: config.showCancel || false,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel'
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    // State
    isEditMode,
    hasUnsavedChanges,
    activeTab,
    modal,
    problem,
    editedProblem,
    loadingProblem,
    problemError,
    testCases,
    loadingTestCases,
    testCasesError,
    editingTestCaseId,
    editedTestCase,
    languages,
    loadingLanguages,
    activeTemplateTab,
    testCasesPagination,
    changedFields,

    // Actions
    setIsEditMode,
    setHasUnsavedChanges,
    setActiveTab,
    setEditingTestCaseId,
    setEditedTestCase,
    setActiveTemplateTab,
    handleEditToggle,
    handleFieldChange,
    handleSaveChanges,
    handleDeleteProblem,
    handleCloneProblem,
    handleToggleActive,
    handleAddTestCase,
    handleEditTestCase,
    handleSaveTestCase,
    handleCancelTestCase,
    handleDeleteTestCase,
    handleAddLanguage,
    handleRemoveLanguage,
    handleUpdateTemplate,
    handleArrayFieldAdd,
    handleArrayFieldRemove,
    handleExampleUpdate,
    handleParameterUpdate,
    showModal,
    closeModal,
    loadTestCases,
  };
}
