import React from 'react';
import {
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../../Card';

interface Problem {
  id: string;
  problemNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ProblemsTabProps {
  problems: Problem[];
  selectedProblems: Problem[];
  problemSearch: string;
  loadingProblems: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  formErrors: {
    problemIds?: string;
  };
  handleProblemToggle: (problem: Problem) => void;
  handleSearchChange: (search: string) => void;
  handlePageChange: (page: number) => void;
}

const ProblemsTab: React.FC<ProblemsTabProps> = ({
  problems,
  selectedProblems,
  problemSearch,
  loadingProblems,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  formErrors,
  handleProblemToggle,
  handleSearchChange,
  handlePageChange
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Problems</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose problems for this contest ({totalItems} problems available)
        </p>
      </div>
      <div className="px-6 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search problems by name or number..."
            value={problemSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Selected Problems */}
        {selectedProblems.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Problems ({selectedProblems.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200 dark:bg-blue-900 dark:text-blue-200"
                >
                  <span>#{problem.problemNumber}</span>
                  <span>{problem.title}</span>
                  <button
                    type="button"
                    onClick={() => handleProblemToggle(problem)}
                    className="text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problems List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Problems (Page {currentPage} of {totalPages})
            </label>
          </div>
          
          {loadingProblems ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading problems...</span>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md dark:border-gray-600">
              {problems.map((problem) => {
                const isSelected = selectedProblems.find((p) => p.id === problem.id);
                return (
                  <div
                    key={problem.id}
                    className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 dark:border-gray-700 ${
                      isSelected ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleProblemToggle(problem)}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => handleProblemToggle(problem)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      {isSelected && (
                        <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">#{problem.problemNumber}</span>
                        <span className="text-gray-700 dark:text-gray-300">{problem.title}</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {problems.length === 0 && !loadingProblems && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No problems found matching your search
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span>
                  Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} to{' '}
                  {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} problems
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {formErrors.problemIds && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {formErrors.problemIds}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProblemsTab;
