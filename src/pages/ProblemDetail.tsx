import { useParams, useNavigate } from 'react-router-dom';
import { ProblemHeader, BasicInfoCard, TestCasesSection } from '../components/admin/problems/ProblemDetail';
import { useProblemDetail } from '../hooks/data/useProblemDetail';
import { Card, CardHeader, CardContent } from '../components/Card';
import Modal from '../components/Modal';
import { AlertCircle, Code, ExternalLink, X, FileText } from 'lucide-react';

export default function ProblemDetail() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const {
		// State
		isEditMode,
		hasUnsavedChanges,
		activeTab,
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
		modal,

		// Actions
		setActiveTab,
		setActiveTemplateTab,
		handleEditToggle,
		handleFieldChange,
		handleSaveChanges,
		handleToggleActive,
		handleCloneProblem,
		handleDeleteProblem,
		handleAddTestCase,
		handleEditTestCase,
		handleSaveTestCase,
		handleCancelTestCase,
		handleDeleteTestCase,
		handleAddLanguage,
		handleRemoveLanguage,
		handleUpdateTemplate,
		closeModal,
		setEditedTestCase,
	} = useProblemDetail({ slug: slug! });

	// Handle clone with navigation
	const handleCloneWithNavigation = async () => {
		const newSlug = await handleCloneProblem();
		if (newSlug) {
			navigate(`/problems/${newSlug}`);
		}
	};

	// Handle delete with navigation
	const handleDeleteWithNavigation = async () => {
		await handleDeleteProblem();
		navigate('/problems');
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

	const isFieldModified = (field: string): boolean => {
		return field in changedFields;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<ProblemHeader
				problem={displayProblem}
				isEditMode={isEditMode}
				hasUnsavedChanges={hasUnsavedChanges}
				onBack={() => navigate('/problems')}
				onEditToggle={handleEditToggle}
				onSaveChanges={handleSaveChanges}
				onToggleActive={handleToggleActive}
				onClone={handleCloneWithNavigation}
				onDelete={handleDeleteWithNavigation}
			/>

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

			{/* Main Content - Responsive Layout */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				{/* Column 1 - Basic Information + Constraints (for xl screens) */}
				<div className="space-y-6 xl:col-span-1">
					{/* Basic Info Card */}
					<Card className="h-fit">
						<CardHeader className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">Basic Information</h2>
							<div className={`rounded-lg border px-3 py-1 text-sm font-medium ${
								displayProblem.difficulty === 'easy' ? 'text-green-600 bg-green-50 border-green-200' :
								displayProblem.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
								'text-red-600 bg-red-50 border-red-200'
							}`}>
								{displayProblem.difficulty.toUpperCase()}
							</div>
						</CardHeader>
						<CardContent>
							<BasicInfoCard
								problem={displayProblem}
								isEditMode={isEditMode}
								isFieldModified={isFieldModified}
								onFieldChange={(field: string, value: any) => handleFieldChange(field as any, value)}
							/>
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
				</div>

				{/* Column 2 - Examples + Function Definition (for xl screens) */}
				<div className="space-y-6 xl:col-span-1">
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
															onChange={(e) => {
																const newExamples = [...displayProblem.examples];
																newExamples[index] = { ...newExamples[index], input: e.target.value };
																handleFieldChange('examples', newExamples);
															}}
															rows={2}
															className="mt-1 w-full rounded border border-blue-300 bg-white px-2 py-1 font-mono text-sm"
														/>
													</div>
													<div>
														<label className="text-xs font-medium">Output:</label>
														<input
															value={example.output}
															onChange={(e) => {
																const newExamples = [...displayProblem.examples];
																newExamples[index] = { ...newExamples[index], output: e.target.value };
																handleFieldChange('examples', newExamples);
															}}
															className="mt-1 w-full rounded border border-blue-300 bg-white px-2 py-1 font-mono text-sm"
														/>
													</div>
													<div>
														<label className="text-xs font-medium">Explanation:</label>
														<textarea
															value={example.explanation}
															onChange={(e) => {
																const newExamples = [...displayProblem.examples];
																newExamples[index] = { ...newExamples[index], explanation: e.target.value };
																handleFieldChange('examples', newExamples);
															}}
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
										<input
											value={displayProblem.functionName}
											onChange={(e) => handleFieldChange('functionName', e.target.value)}
											className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-900"
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
														<input
															placeholder="Name"
															value={param.name}
															onChange={(e) => {
																const newParameters = [...displayProblem.parameters];
																newParameters[index] = { ...newParameters[index], name: e.target.value };
																handleFieldChange('parameters', newParameters);
															}}
															className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-900"
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
														<input
															placeholder="Description"
															value={param.description}
															onChange={(e) => {
																const newParameters = [...displayProblem.parameters];
																newParameters[index] = { ...newParameters[index], description: e.target.value };
																handleFieldChange('parameters', newParameters);
															}}
															className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
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

				{/* Column 3 - Statistics + Companies + Tags + Hints + Metadata (for xl screens) */}
				<div className="space-y-6 xl:col-span-1">
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
								<button
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
									onClick={() => navigate(`/problems/${slug}/submissions`)}
								>
									<ExternalLink className="mr-2 inline h-4 w-4" />
									View Submissions
								</button>
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
										{displayProblem.tags.map((tag, index) => (
											<span key={index} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
												{tag}
												<button 
													onClick={() => {
														const newTags = displayProblem.tags.filter((_, i) => i !== index);
														handleFieldChange('tags', newTags);
													}} 
													className="hover:text-blue-600"
												>
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
									<div className="flex gap-2">
										<input
											placeholder="Add tag..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													const newTags = [...displayProblem.tags, e.currentTarget.value];
													handleFieldChange('tags', newTags);
													e.currentTarget.value = '';
												}
											}}
											className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
										/>
										<button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													const newTags = [...displayProblem.tags, input.value];
													handleFieldChange('tags', newTags);
													input.value = '';
												}
											}}
											className="rounded-md bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700"
										>
											Add
										</button>
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
										{displayProblem.companies.map((company, index) => (
											<span key={index} className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-800">
												{company}
												<button 
													onClick={() => {
														const newCompanies = displayProblem.companies.filter((_, i) => i !== index);
														handleFieldChange('companies', newCompanies);
													}} 
													className="hover:text-purple-600"
												>
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
									<div className="flex gap-2">
										<input
											placeholder="Add company..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													const newCompanies = [...displayProblem.companies, e.currentTarget.value];
													handleFieldChange('companies', newCompanies);
													e.currentTarget.value = '';
												}
											}}
											className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
										/>
										<button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													const newCompanies = [...displayProblem.companies, input.value];
													handleFieldChange('companies', newCompanies);
													input.value = '';
												}
											}}
											className="rounded-md bg-purple-600 px-3 py-2 text-xs text-white hover:bg-purple-700"
										>
											Add
										</button>
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
									{displayProblem.hints.map((hint, index) => (
										<div key={index} className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-2">
											<span className="text-sm">{index + 1}.</span>
											<textarea
												value={hint}
												onChange={(e) => {
													const newHints = [...displayProblem.hints];
													newHints[index] = e.target.value;
													handleFieldChange('hints', newHints);
												}}
												rows={2}
												className="flex-1 rounded border-none bg-transparent text-sm focus:outline-none"
											/>
											<button 
												onClick={() => {
													const newHints = displayProblem.hints.filter((_, i) => i !== index);
													handleFieldChange('hints', newHints);
												}} 
												className="text-red-600 hover:text-red-700"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
									<div className="flex gap-2">
										<input
											placeholder="Add hint..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													const newHints = [...displayProblem.hints, e.currentTarget.value];
													handleFieldChange('hints', newHints);
													e.currentTarget.value = '';
												}
											}}
											className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
										/>
										<button
											type="button"
											onClick={(e) => {
												const input = e.currentTarget.previousElementSibling as HTMLInputElement;
												if (input && input.value.trim()) {
													const newHints = [...displayProblem.hints, input.value];
													handleFieldChange('hints', newHints);
													input.value = '';
												}
											}}
											className="rounded-md bg-gray-600 px-3 py-2 text-xs text-white hover:bg-gray-700"
										>
											Add
										</button>
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
				{/* Tab Navigation for screens ≤ 1024px */}
				<div className="border-b border-gray-200 dark:border-gray-700 xl:hidden">
					<div className="flex">
						<button
							onClick={() => setActiveTab('testcases')}
							className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'testcases'
									? 'border-b-2 border-blue-600 text-blue-600'
									: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
								}`}
						>
							<FileText className="mr-2 inline h-4 w-4" />
							Test Cases ({testCases.length})
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

				{/* 2-Column Layout for screens > 1024px */}
				<div className="hidden xl:grid xl:grid-cols-2 xl:gap-6">
					{/* Test Cases Column */}
					<div className="p-6">
						<TestCasesSection
							testCases={testCases}
							problem={displayProblem}
							isEditMode={isEditMode}
							loading={loadingTestCases}
							error={testCasesError}
							pagination={testCasesPagination}
							onAddTestCase={handleAddTestCase}
							onEditTestCase={handleEditTestCase}
							onSaveTestCase={handleSaveTestCase}
							onCancelTestCase={handleCancelTestCase}
							onDeleteTestCase={handleDeleteTestCase}
							editingTestCaseId={editingTestCaseId}
							editedTestCase={editedTestCase}
							onTestCaseChange={(field, value) => {
								if (editedTestCase) {
									setEditedTestCase({ ...editedTestCase, [field]: value });
								}
							}}
						/>
					</div>

					{/* Language Templates Column */}
					<div className="p-6 border-l border-gray-200 dark:border-gray-700">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold flex items-center gap-2">
									<Code className="h-5 w-5" />
									Language Templates ({displayProblem.supportedLanguages.length})
								</h3>
								{isEditMode && (
									<div className="flex items-center gap-2">
										<select
											onChange={(e) => {
												const langId = Number(e.target.value);
												if (langId && !displayProblem.supportedLanguages.includes(langId)) {
													handleAddLanguage(langId);
												}
												e.target.value = '';
											}}
											className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
											defaultValue=""
										>
											<option value="" disabled>Add Language...</option>
											{languages
												.filter(lang => !displayProblem.supportedLanguages.includes(lang.id))
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
																<input
																	value={template.placeholder}
																	onChange={(e) => handleUpdateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
																	className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-900"
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
					</div>
				</div>

				{/* Tab Content for screens ≤ 1024px */}
				<div className="p-6 xl:hidden">
					{activeTab === 'testcases' ? (
						<TestCasesSection
							testCases={testCases}
							problem={displayProblem}
							isEditMode={isEditMode}
							loading={loadingTestCases}
							error={testCasesError}
							pagination={testCasesPagination}
							onAddTestCase={handleAddTestCase}
							onEditTestCase={handleEditTestCase}
							onSaveTestCase={handleSaveTestCase}
							onCancelTestCase={handleCancelTestCase}
							onDeleteTestCase={handleDeleteTestCase}
							editingTestCaseId={editingTestCaseId}
							editedTestCase={editedTestCase}
							onTestCaseChange={(field, value) => {
								if (editedTestCase) {
									setEditedTestCase({ ...editedTestCase, [field]: value });
								}
							}}
						/>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Language Templates</h3>
								{isEditMode && (
									<div className="flex items-center gap-2">
										<select
											onChange={(e) => {
												const langId = Number(e.target.value);
												if (langId && !displayProblem.supportedLanguages.includes(langId)) {
													handleAddLanguage(langId);
												}
												e.target.value = '';
											}}
											className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
											defaultValue=""
										>
											<option value="" disabled>Add Language...</option>
											{languages
												.filter(lang => !displayProblem.supportedLanguages.includes(lang.id))
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
																<input
																	value={template.placeholder}
																	onChange={(e) => handleUpdateTemplate(activeTemplateTab, 'placeholder', e.target.value)}
																	className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-900"
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

			{/* Modal */}
			<Modal
				isOpen={modal.isOpen}
				onClose={closeModal}
				onConfirm={modal.onConfirm}
				title={modal.title}
				message={modal.message}
				type={modal.type}
				showCancel={modal.showCancel}
				confirmText={modal.confirmText}
				cancelText={modal.cancelText}
			/>
		</div>
	);
}