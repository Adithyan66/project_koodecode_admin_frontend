import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	Edit3,
	Save,
	X,
	Trash2,
	Copy,
	Eye,
	EyeOff,
	Plus,
	Code,
	FileText,
	AlertCircle,
	CheckCircle,
	ArrowLeft,
	ExternalLink
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Toggle from '../components/Toggle';
import { Card, CardHeader, CardContent } from '../components/Card';
import { useGlobalLoading } from '../hooks';
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
} from '../api/problems';
import { generateDefaultTemplate } from '../utils/templateGenerator';
import type { ProblemDetail as ProblemDetailType, TestCase, UpdateProblemPayload, ProblemExample } from '../types/problemDetail';
import type { Parameter, LanguageTemplate } from '../types/problemCreate';
import type { Language } from '../types/problemCreate';

export default function ProblemDetail() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const { showLoading, hideLoading } = useGlobalLoading();

	// State Management
	const [isEditMode, setIsEditMode] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [activeTab, setActiveTab] = useState<'testcases' | 'templates'>('testcases');

	// Problem Data
	const [problem, setProblem] = useState<ProblemDetailType | null>(null);
	const [editedProblem, setEditedProblem] = useState<ProblemDetailType | null>(null);
	const [loadingProblem, setLoadingProblem] = useState(true);
	const [problemError, setProblemError] = useState<string | null>(null);

	// Test Cases Data
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [testCasesPage, setTestCasesPage] = useState(1);
	const [testCasesLimit, setTestCasesLimit] = useState(10);
	const [testCasesTotalPages, setTestCasesTotalPages] = useState(1);
	const [testCasesTotalCount, setTestCasesTotalCount] = useState(0);
	const [loadingTestCases, setLoadingTestCases] = useState(false);
	const [testCasesError, setTestCasesError] = useState<string | null>(null);
	const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
	const [editedTestCase, setEditedTestCase] = useState<TestCase | null>(null);

	// Languages
	const [languages, setLanguages] = useState<Language[]>([]);
	const [loadingLanguages, setLoadingLanguages] = useState(false);
	const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

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
			const response = await fetchTestCases(slug, testCasesPage, testCasesLimit);
			setTestCases(response.data.testCases);
			setTestCasesTotalPages(response.data.totalPages);
			setTestCasesTotalCount(response.data.totalCount);
		} catch (error: any) {
			setTestCasesError(error.response?.data?.message || 'Failed to load test cases');
		} finally {
			setLoadingTestCases(false);
		}
	}, [slug, testCasesPage, testCasesLimit]);

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
			if (!window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
				return;
			}
			setEditedProblem(problem);
			setHasUnsavedChanges(false);
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
				alert('No changes to save.');
				return;
			}

			console.log('Sending only changed fields:', changedFields);

			await updateProblem(slug, changedFields);
			setProblem(editedProblem);
			setHasUnsavedChanges(false);
			setIsEditMode(false);
			alert('Changes saved successfully!');
		} catch (error: any) {
			alert(error.response?.data?.message || 'Failed to save changes');
		} finally {
			hideLoading();
		}
	};

	// Handle Delete Problem
	const handleDeleteProblem = async () => {
		if (!slug) return;

		if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
			return;
		}

		showLoading('Deleting problem...');
		try {
			await deleteProblem(slug);
			alert('Problem deleted successfully!');
			navigate('/problems');
		} catch (error: any) {
			alert(error.response?.data?.message || 'Failed to delete problem');
		} finally {
			hideLoading();
		}
	};

	// Handle Clone Problem
	const handleCloneProblem = async () => {
		if (!slug) return;

		showLoading('Cloning problem...');
		try {
			const response = await cloneProblem(slug);
			alert('Problem cloned successfully!');
			if (response.data?.slug) {
				navigate(`/problems/${response.data.slug}`);
			}
		} catch (error: any) {
			alert(error.response?.data?.message || 'Failed to clone problem');
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
			alert(error.response?.data?.message || 'Failed to update status');
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
					setTestCasesTotalPages(response.data.pagination.totalPages);
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
			alert(error.response?.data?.message || 'Failed to save test case');
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

		if (!window.confirm('Are you sure you want to delete this test case?')) {
			return;
		}

		showLoading('Deleting test case...');
		try {
			await deleteTestCase(slug, testCaseId);
			loadTestCases();
		} catch (error: any) {
			alert(error.response?.data?.message || 'Failed to delete test case');
		} finally {
			hideLoading();
		}
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

	// Helper to format array for display
	const formatArrayForDisplay = (value: any): string => {
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		return String(value);
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

		if (!window.confirm('Are you sure you want to remove this language template?')) {
			return;
		}

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

	if (loadingProblem) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading problem...</p>
				</div>
			</div>
		);
	}

	if (problemError || !problem || !editedProblem) {
		return (
			<div className="flex items-center justify-center py-12">
				<Card className="max-w-md">
					<CardContent className="flex items-center gap-3 p-6 text-red-600">
						<AlertCircle className="h-6 w-6" />
						<div>
							<h3 className="font-semibold">Error Loading Problem</h3>
							<p className="text-sm">{problemError || 'Problem not found'}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const displayProblem = isEditMode ? editedProblem : problem;
	const difficultyColors = {
		easy: 'text-green-600 bg-green-50 border-green-200',
		medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
		hard: 'text-red-600 bg-red-50 border-red-200',
	};

	// Helper to check if a field has been modified
	const isFieldModified = (field: keyof ProblemDetailType): boolean => {
		return field in changedFields;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" onClick={() => navigate('/problems')}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold">
							#{displayProblem.problemNumber}. {displayProblem.title}
						</h1>
						<p className="text-sm text-gray-500">
							Created by {displayProblem.createdBy.fullName}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* Status Badge */}
					<div className={`flex items-center gap-2 rounded-lg border px-3 py-1 ${displayProblem.isActive
							? 'border-green-200 bg-green-50 text-green-700'
							: 'border-gray-300 bg-gray-100 text-gray-600'
						}`}>
						{displayProblem.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
						<span className="text-sm font-medium">
							{displayProblem.isActive ? 'Active' : 'Inactive'}
						</span>
					</div>

					{/* Action Buttons */}
					{isEditMode ? (
						<>
							<Button variant="ghost" onClick={handleEditToggle}>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
								<Save className="mr-2 h-4 w-4" />
								Save All Changes
							</Button>
						</>
					) : (
						<>
							<Button variant="secondary" onClick={handleToggleActive}>
								{displayProblem.isActive ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
								{displayProblem.isActive ? 'Deactivate' : 'Activate'}
							</Button>
							<Button variant="secondary" onClick={handleCloneProblem}>
								<Copy className="mr-2 h-4 w-4" />
								Clone
							</Button>
							<Button variant="secondary" onClick={handleEditToggle}>
								<Edit3 className="mr-2 h-4 w-4" />
								Edit
							</Button>
							<Button
								variant="secondary"
								onClick={handleDeleteProblem}
								className="text-red-600 hover:bg-red-50"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Unsaved Changes Warning */}
			{hasUnsavedChanges && (
				<div className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
					<AlertCircle className="h-5 w-5" />
					<div className="flex-1">
						<span>You have unsaved changes. Don't forget to save!</span>
						{Object.keys(changedFields).length > 0 && (
							<div className="mt-1 text-sm">
								Changed fields: {Object.keys(changedFields).join(', ')}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Main Content - Side by Side Layout */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left Column - Main Content (2/3 width) */}
				<div className="space-y-6 lg:col-span-2">
					{/* Basic Info Card */}
					<Card>
						<CardHeader className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">Basic Information</h2>
							<div className={`rounded-lg border px-3 py-1 text-sm font-medium ${difficultyColors[displayProblem.difficulty]}`}>
								{displayProblem.difficulty.toUpperCase()}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
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
										value={editedProblem.title}
										onChange={(e) => handleFieldChange('title', e.target.value)}
									/>
								) : (
									<p className="text-gray-900 dark:text-gray-100">{displayProblem.title}</p>
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
										value={editedProblem.difficulty}
										onChange={(e) => handleFieldChange('difficulty', e.target.value)}
										className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
									>
										<option value="easy">Easy</option>
										<option value="medium">Medium</option>
										<option value="hard">Hard</option>
									</select>
								) : (
									<p className="text-gray-900 dark:text-gray-100">{displayProblem.difficulty}</p>
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
										value={editedProblem.description}
										onChange={(e) => handleFieldChange('description', e.target.value)}
										rows={6}
										className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
									/>
								) : (
									<p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
										{displayProblem.description}
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Constraints Card */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-semibold">Constraints</h2>
							{isEditMode && <span className="ml-2 text-xs text-gray-500">(Read-only)</span>}
						</CardHeader>
						<CardContent>
							{displayProblem.constraints.length === 0 ? (
								<p className="text-gray-500">No constraints defined</p>
							) : (
								<div className="space-y-3">
									{displayProblem.constraints.map((constraint, index) => (
										<div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
											<p className="font-mono text-sm font-medium">{constraint.parameterName} ({constraint.type})</p>
											{(constraint.minValue !== undefined || constraint.maxValue !== undefined) && (
												<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
													Range: {constraint.minValue ?? '−∞'} to {constraint.maxValue ?? '∞'}
												</p>
											)}
											{(constraint.minLength !== undefined || constraint.maxLength !== undefined) && (
												<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
													Length: {constraint.minLength ?? '0'} to {constraint.maxLength ?? '∞'}
												</p>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Examples Card */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-semibold">Examples</h2>
						</CardHeader>
						<CardContent>
							{displayProblem.examples.length === 0 ? (
								<p className="text-gray-500">No examples defined</p>
							) : (
								<div className="space-y-4">
									{displayProblem.examples.map((example, index) => (
										<div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
											<h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
												Example {index + 1} {example.isSample && <span className="ml-2 text-xs">(Sample)</span>}
											</h4>
											{isEditMode ? (
												<div className="space-y-2">
													<div>
														<label className="text-xs font-medium">Input:</label>
														<textarea
															value={example.input}
															onChange={(e) => handleExampleUpdate(index, 'input', e.target.value)}
															rows={2}
															className="mt-1 w-full rounded border border-blue-300 bg-white px-2 py-1 font-mono text-sm"
														/>
													</div>
													<div>
														<label className="text-xs font-medium">Output:</label>
														<Input
															value={example.output}
															onChange={(e) => handleExampleUpdate(index, 'output', e.target.value)}
															className="mt-1 font-mono text-sm"
														/>
													</div>
													<div>
														<label className="text-xs font-medium">Explanation:</label>
														<textarea
															value={example.explanation}
															onChange={(e) => handleExampleUpdate(index, 'explanation', e.target.value)}
															rows={2}
															className="mt-1 w-full rounded border border-blue-300 bg-white px-2 py-1 text-sm"
														/>
													</div>
												</div>
											) : (
												<>
													<div className="mb-2">
														<span className="text-xs font-semibold text-blue-800 dark:text-blue-200">Input:</span>
														<pre className="mt-1 overflow-x-auto rounded bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
															{example.input}
														</pre>
													</div>
													<div className="mb-2">
														<span className="text-xs font-semibold text-blue-800 dark:text-blue-200">Output:</span>
														<pre className="mt-1 overflow-x-auto rounded bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
															{example.output}
														</pre>
													</div>
													{example.explanation && (
														<div>
															<span className="text-xs font-semibold text-blue-800 dark:text-blue-200">Explanation:</span>
															<p className="mt-1 text-sm text-blue-900 dark:text-blue-100">{example.explanation}</p>
														</div>
													)}
												</>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Function Definition Card */}
					<Card>
						<CardHeader className="flex items-center gap-2">
							<Code className="h-5 w-5" />
							<h2 className="text-xl font-semibold">Function Definition</h2>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Function Name
										{isEditMode && isFieldModified('functionName') && (
											<span className="ml-2 inline-block h-2 w-2 rounded-full bg-orange-500" title="Modified"></span>
										)}
									</label>
									{isEditMode ? (
										<Input
											value={editedProblem.functionName}
											onChange={(e) => handleFieldChange('functionName', e.target.value)}
											className="font-mono"
										/>
									) : (
										<p className="font-mono text-gray-900 dark:text-gray-100">{displayProblem.functionName}</p>
									)}
								</div>
								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Return Type
										{isEditMode && <span className="ml-2 text-xs text-gray-500">(Read-only)</span>}
									</label>
									<p className="font-mono text-gray-900 dark:text-gray-100">{displayProblem.returnType}</p>
								</div>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
									Parameters
									{isEditMode && <span className="ml-2 text-xs text-gray-500">(Types are read-only)</span>}
								</label>
								<div className="space-y-2">
									{displayProblem.parameters.map((param, index) => (
										<div key={param.id || index} className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
											{isEditMode ? (
												<div className="grid grid-cols-3 gap-2">
													<div>
														<label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Name</label>
														<Input
															placeholder="Name"
															value={param.name}
															onChange={(e) => handleParameterUpdate(index, 'name', e.target.value)}
															className="font-mono text-sm"
														/>
													</div>
													<div>
														<label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Type (Read-only)</label>
														<div className="flex h-9 items-center rounded-md border border-gray-300 bg-gray-100 px-3 font-mono text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
															{param.type}
														</div>
													</div>
													<div>
														<label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Description</label>
														<Input
															placeholder="Description"
															value={param.description}
															onChange={(e) => handleParameterUpdate(index, 'description', e.target.value)}
															className="text-sm"
														/>
													</div>
												</div>
											) : (
												<div>
													<span className="font-mono text-sm font-medium">{param.name}: {param.type}</span>
													{param.description && (
														<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{param.description}</p>
													)}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Metadata & Stats (1/3 width) */}
				<div className="space-y-6">
					{/* Statistics Card */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Statistics</h2>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Total Submissions:</span>
								<span className="font-semibold">{displayProblem.submissionStats.totalSubmissions}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Accepted:</span>
								<span className="font-semibold text-green-600">{displayProblem.submissionStats.acceptedSubmissions}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate:</span>
								<span className="font-semibold">{displayProblem.submissionStats.acceptanceRate.toFixed(2)}%</span>
							</div>
							<div className="mt-4 border-t pt-3">
								<Button
									variant="secondary"
									className="w-full"
									onClick={() => navigate(`/problems/${slug}/submissions`)}
								>
									<ExternalLink className="mr-2 h-4 w-4" />
									View Submissions
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Tags Card */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Tags</h2>
						</CardHeader>
						<CardContent>
							{isEditMode ? (
								<div className="space-y-2">
									<div className="flex flex-wrap gap-2">
										{editedProblem.tags.map((tag, index) => (
											<span key={index} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
												{tag}
												<button onClick={() => handleArrayFieldRemove('tags', index)} className="hover:text-blue-600">
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
									<div className="flex gap-2">
										<Input
											placeholder="Add tag..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													handleArrayFieldAdd('tags', e.currentTarget.value);
													e.currentTarget.value = '';
												}
											}}
											className="text-sm"
										/>
										<Button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													handleArrayFieldAdd('tags', input.value);
													input.value = '';
												}
											}}
											className="px-3 py-1 text-xs"
										>
											Add
										</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{displayProblem.tags.length === 0 ? (
										<p className="text-sm text-gray-500">No tags</p>
									) : (
										displayProblem.tags.map((tag, index) => (
											<span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
												{tag}
											</span>
										))
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Companies Card */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Companies</h2>
						</CardHeader>
						<CardContent>
							{isEditMode ? (
								<div className="space-y-2">
									<div className="flex flex-wrap gap-2">
										{editedProblem.companies.map((company, index) => (
											<span key={index} className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-800">
												{company}
												<button onClick={() => handleArrayFieldRemove('companies', index)} className="hover:text-purple-600">
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
									<div className="flex gap-2">
										<Input
											placeholder="Add company..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													handleArrayFieldAdd('companies', e.currentTarget.value);
													e.currentTarget.value = '';
												}
											}}
											className="text-sm"
										/>
										<Button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													handleArrayFieldAdd('companies', input.value);
													input.value = '';
												}
											}}
											className="px-3 py-1 text-xs"
										>
											Add
										</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{displayProblem.companies.length === 0 ? (
										<p className="text-sm text-gray-500">No companies</p>
									) : (
										displayProblem.companies.map((company, index) => (
											<span key={index} className="rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-800">
												{company}
											</span>
										))
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Hints Card */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Hints</h2>
						</CardHeader>
						<CardContent>
							{isEditMode ? (
								<div className="space-y-2">
									{editedProblem.hints.map((hint, index) => (
										<div key={index} className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-2">
											<span className="text-sm">{index + 1}.</span>
											<textarea
												value={hint}
												onChange={(e) => {
													const newHints = [...editedProblem.hints];
													newHints[index] = e.target.value;
													handleFieldChange('hints', newHints);
												}}
												rows={2}
												className="flex-1 rounded border-none bg-transparent text-sm focus:outline-none"
											/>
											<button onClick={() => handleArrayFieldRemove('hints', index)} className="text-red-600 hover:text-red-700">
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
									<div className="flex gap-2">
										<Input
											placeholder="Add hint..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													handleArrayFieldAdd('hints', e.currentTarget.value);
													e.currentTarget.value = '';
												}
											}}
											className="text-sm"
										/>
										<Button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													handleArrayFieldAdd('hints', input.value);
													input.value = '';
												}
											}}
											className="px-3 py-1 text-xs"
										>
											Add
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-2">
									{displayProblem.hints.length === 0 ? (
										<p className="text-sm text-gray-500">No hints</p>
									) : (
										displayProblem.hints.map((hint, index) => (
											<div key={index} className="flex gap-2 text-sm">
												<span className="font-medium">{index + 1}.</span>
												<span>{hint}</span>
											</div>
										))
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Metadata */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold">Metadata</h2>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div>
								<span className="font-medium">Slug:</span>
								<p className="font-mono text-gray-600 dark:text-gray-400">{displayProblem.slug}</p>
							</div>
							<div>
								<span className="font-medium">Problem #:</span>
								<p className="text-gray-600 dark:text-gray-400">{displayProblem.problemNumber}</p>
							</div>
							<div>
								<span className="font-medium">Created By:</span>
								<p className="text-gray-600 dark:text-gray-400">
									{displayProblem.createdBy.fullName} (@{displayProblem.createdBy.userName})
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Test Cases & Templates Section */}
			<Card>
				<div className="border-b border-gray-200 dark:border-gray-700">
					<div className="flex">
						<button
							onClick={() => setActiveTab('testcases')}
							className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'testcases'
									? 'border-b-2 border-blue-600 text-blue-600'
									: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
								}`}
						>
							<FileText className="mr-2 inline h-4 w-4" />
							Test Cases ({testCasesTotalCount})
						</button>
						<button
							onClick={() => setActiveTab('templates')}
							className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'templates'
									? 'border-b-2 border-blue-600 text-blue-600'
									: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
								}`}
						>
							<Code className="mr-2 inline h-4 w-4" />
							Language Templates ({displayProblem.supportedLanguages.length})
						</button>
					</div>
				</div>

				<div className="p-6">
					{activeTab === 'testcases' ? (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Test Cases</h3>
								{isEditMode && (
									<Button onClick={handleAddTestCase}>
										<Plus className="mr-2 h-4 w-4" />
										Add Test Case
									</Button>
								)}
							</div>

							{loadingTestCases ? (
								<div className="flex items-center justify-center py-8">
									<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
								</div>
							) : testCasesError ? (
								<div className="flex items-center gap-2 text-red-600">
									<AlertCircle className="h-5 w-5" />
									<span>{testCasesError}</span>
								</div>
							) : testCases.length === 0 ? (
								<p className="py-8 text-center text-gray-500">No test cases found</p>
							) : (
								<>
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
																	(testCasesPage - 1) * testCasesLimit + index + 1
																)}
															</td>

															{/* Inputs Column - Nested Table */}
															<td className="px-2 py-2">
																<table className="w-full">
																	<tbody>
																		{displayProblem.parameters.map((param) => (
																			<tr key={param.name} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
																				<td className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400" style={{ width: '40%' }}>
																					{param.name}
																				</td>
																				<td className="px-2 py-2" style={{ width: '60%' }}>
																					{isEditing ? (
																						param.type.includes('[]') ? (
																							<Input
																								value={formatArrayForDisplay(displayTestCase.inputs[param.name])}
																								onChange={(e) => {
																									setEditedTestCase(prev => prev ? {
																										...prev,
																										inputs: { ...prev.inputs, [param.name]: e.target.value }
																									} : null);
																								}}
																								placeholder="e.g., 1, 2, 3"
																								className="text-xs"
																							/>
																						) : param.type === 'boolean' ? (
																							<select
																								value={String(displayTestCase.inputs[param.name])}
																								onChange={(e) => {
																									setEditedTestCase(prev => prev ? {
																										...prev,
																										inputs: { ...prev.inputs, [param.name]: e.target.value === 'true' }
																									} : null);
																								}}
																								className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
																							>
																								<option value="true">true</option>
																								<option value="false">false</option>
																							</select>
																						) : param.type === 'number' ? (
																							<Input
																								type="number"
																								value={displayTestCase.inputs[param.name]}
																								onChange={(e) => {
																									setEditedTestCase(prev => prev ? {
																										...prev,
																										inputs: { ...prev.inputs, [param.name]: parseFloat(e.target.value) }
																									} : null);
																								}}
																								className="text-xs"
																							/>
																						) : (
																							<Input
																								value={displayTestCase.inputs[param.name]}
																								onChange={(e) => {
																									setEditedTestCase(prev => prev ? {
																										...prev,
																										inputs: { ...prev.inputs, [param.name]: e.target.value }
																									} : null);
																								}}
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
																	displayProblem.returnType.includes('[]') ? (
																		<Input
																			value={formatArrayForDisplay(displayTestCase.expectedOutput)}
																			onChange={(e) => {
																				setEditedTestCase(prev => prev ? { ...prev, expectedOutput: e.target.value } : null);
																			}}
																			placeholder="e.g., 1, 2, 3"
																			className="font-mono text-xs"
																		/>
																	) : displayProblem.returnType === 'boolean' ? (
																		<select
																			value={String(displayTestCase.expectedOutput)}
																			onChange={(e) => {
																				setEditedTestCase(prev => prev ? {
																					...prev,
																					expectedOutput: e.target.value === 'true'
																				} : null);
																			}}
																			className="w-full rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800"
																		>
																			<option value="true">true</option>
																			<option value="false">false</option>
																		</select>
																	) : displayProblem.returnType === 'number' ? (
																		<Input
																			type="number"
																			value={String(displayTestCase.expectedOutput)}
																			onChange={(e) => {
																				setEditedTestCase(prev => prev ? {
																					...prev,
																					expectedOutput: parseFloat(e.target.value)
																				} : null);
																			}}
																			className="font-mono text-xs"
																		/>
																	) : (
																		<Input
																			value={String(displayTestCase.expectedOutput)}
																			onChange={(e) => {
																				setEditedTestCase(prev => prev ? {
																					...prev,
																					expectedOutput: e.target.value
																				} : null);
																			}}
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
																		onChange={(e) => {
																			setEditedTestCase(prev => prev ? {
																				...prev,
																				isSample: e.target.checked
																			} : null);
																		}}
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
																					onClick={handleSaveTestCase}
																					className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
																					title="Save"
																				>
																					<CheckCircle className="h-4 w-4" />
																				</button>
																				<button
																					onClick={handleCancelTestCase}
																					className="rounded p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
																					title="Cancel"
																				>
																					<X className="h-4 w-4" />
																				</button>
																			</>
																		) : (
																			<>
																				<button
																					onClick={() => handleEditTestCase(testCase)}
																					className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
																					title="Edit"
																				>
																					<Edit3 className="h-4 w-4" />
																				</button>
																				<button
																					onClick={() => handleDeleteTestCase(testCase.id)}
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

									{/* Test Cases Pagination */}
									<div className="flex items-center justify-between pt-4">
										<div className="text-sm text-gray-600">
											Showing {(testCasesPage - 1) * testCasesLimit + 1} to {Math.min(testCasesPage * testCasesLimit, testCasesTotalCount)} of {testCasesTotalCount}
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="secondary"
												disabled={testCasesPage === 1}
												onClick={() => setTestCasesPage(prev => prev - 1)}
											>
												Previous
											</Button>
											<span className="text-sm">
												Page {testCasesPage} of {testCasesTotalPages}
											</span>
											<Button
												variant="secondary"
												disabled={testCasesPage === testCasesTotalPages}
												onClick={() => setTestCasesPage(prev => prev + 1)}
											>
												Next
											</Button>
											<select
												value={testCasesLimit}
												onChange={(e) => {
													setTestCasesLimit(Number(e.target.value));
													setTestCasesPage(1);
												}}
												className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
											>
												<option value="5">5</option>
												<option value="10">10</option>
												<option value="20">20</option>
												<option value="50">50</option>
											</select>
										</div>
									</div>
								</>
							)}
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Language Templates</h3>
								{isEditMode && (
									<div className="flex items-center gap-2">
										<select
											onChange={(e) => {
												const langId = Number(e.target.value);
												if (langId && !editedProblem.supportedLanguages.includes(langId)) {
													handleAddLanguage(langId);
												}
												e.target.value = '';
											}}
											className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
											defaultValue=""
										>
											<option value="" disabled>Add Language...</option>
											{languages
												.filter(lang => !editedProblem.supportedLanguages.includes(lang.id))
												.map(lang => (
													<option key={lang.id} value={lang.id}>
														{lang.name}
													</option>
												))
											}
										</select>
									</div>
								)}
							</div>

							{loadingLanguages ? (
								<div className="flex items-center justify-center py-8">
									<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
								</div>
							) : displayProblem.supportedLanguages.length === 0 ? (
								<p className="py-8 text-center text-gray-500">No language templates configured</p>
							) : (
								<>
									{/* Language Tabs */}
									<div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
										{displayProblem.supportedLanguages.map(langId => {
											const lang = languages.find(l => l.id === langId);
											if (!lang) return null;

											return (
												<button
													key={langId}
													onClick={() => setActiveTemplateTab(activeTemplateTab === langId ? null : langId)}
													className={`relative flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${activeTemplateTab === langId
															? 'bg-blue-50 text-blue-600 dark:bg-blue-950'
															: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
														}`}
												>
													{lang.name}
													{isEditMode && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleRemoveLanguage(langId);
															}}
															className="rounded p-0.5 hover:bg-red-100 hover:text-red-600"
														>
															<X className="h-3 w-3" />
														</button>
													)}
												</button>
											);
										})}
									</div>

									{/* Template Editor */}
									{activeTemplateTab && displayProblem.templates[activeTemplateTab] ? (
										<div className="space-y-4 pt-4">
											{(() => {
												const lang = languages.find(l => l.id === activeTemplateTab);
												const template = displayProblem.templates[activeTemplateTab];
												if (!lang || !template) return null;

												return (
													<>
														<div>
															<label className="mb-2 block text-sm font-medium">
																Function Signature
															</label>
															{isEditMode ? (
																<textarea
																	value={template.userFunctionSignature}
																	onChange={(e) => handleUpdateTemplate(activeTemplateTab, 'userFunctionSignature', e.target.value)}
																	className="w-full resize-none rounded border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800" />
															) : (
																<pre className="overflow-x-auto rounded bg-gray-50 px-4 py-3 font-mono text-sm dark:bg-gray-800">
																	{template.userFunctionSignature}
																</pre>
															)}
														</div>

														<div>
															<label className="mb-2 block text-sm font-medium">
																Template Code
																{isEditMode && (
																	<span className="ml-2 text-xs text-gray-500">
																		(Use {template.placeholder} as placeholder)
																	</span>
																)}
															</label>
															{isEditMode ? (
																<textarea
																	value={template.templateCode}
																	onChange={(e) => handleUpdateTemplate(activeTemplateTab, 'templateCode', e.target.value)}
																	rows={16}
																	className="w-full resize-none rounded border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
																/>
															) : (
																<pre className="overflow-x-auto rounded bg-gray-50 px-4 py-3 font-mono text-sm dark:bg-gray-800">
																	{template.templateCode}
																</pre>
															)}
														</div>

														{isEditMode && (
															<div>
																<label className="mb-2 block text-sm font-medium">
																	Placeholder
																</label>
																<Input
																	value={template.placeholder}
																	onChange={(e) => handleUpdateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
																	className="font-mono text-sm"
																/>
															</div>
														)}
													</>
												);
											})()}
										</div>
									) : (
										<div className="py-12 text-center text-gray-500">
											<Code className="mx-auto mb-4 h-16 w-16 text-gray-300" />
											<p>Click on a language tab above to view its template</p>
										</div>
									)}
								</>
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}