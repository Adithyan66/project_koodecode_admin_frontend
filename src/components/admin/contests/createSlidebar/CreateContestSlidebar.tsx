import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  X,
  Loader2
} from 'lucide-react';
import { useCreateContest } from '../../../../hooks/data/useCreateContest';
import { useContest } from '../../../../hooks/data/useContest';
import BasicInfoTab from './BasicInfoTab';
import ProblemsTab from './ProblemsTab';
import SettingsTab from './SettingsTab';
import RewardsTab from './RewardsTab';

interface CreateContestSlidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editContestId?: string | null;
  editMode?: boolean;
}

const CreateContestSlidebar: React.FC<CreateContestSlidebarProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editContestId,
  editMode = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoadingContest, setIsLoadingContest] = useState(false);
  const [hasLoadedContest, setHasLoadedContest] = useState(false);
  
  const { actions: { getContestById } } = useContest();
  
  const {
    // Form state
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    
    // Image upload state
    thumbnailImage,
    setThumbnailImage,
    isUploading,
    uploadProgress,
    
    // Problem selection state
    problems,
    selectedProblems,
    setSelectedProblems,
    problemSearch,
    loadingProblems,
    
    // Pagination state
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    
    // Coin rewards state
    coinRewards,
    
    // Submission state
    isSubmitting,
    
    // Actions
    handleThumbnailUpload,
    handleProblemToggle,
    handleSearchChange,
    handlePageChange,
    addCoinReward,
    removeCoinReward,
    updateCoinReward,
    handleInputChange,
    validateForm,
    submitContest,
    resetForm,
    setOriginalContestData,
  } = useCreateContest();

  // Load contest data when in edit mode
  useEffect(() => {
    if (editMode && editContestId && isOpen && !hasLoadedContest) {
      const loadContestData = async () => {
        setIsLoadingContest(true);
        try {
          const contest = await getContestById(editContestId);
          
          // Convert string dates to Date objects
          const startTime = contest.startTime ? new Date(contest.startTime) : null;
          const endTime = contest.endTime ? new Date(contest.endTime) : null;
          const registrationDeadline = contest.registrationDeadline ? new Date(contest.registrationDeadline) : null;
          
          // Create contest data object
          const contestFormData = {
            title: contest.title,
            description: contest.description,
            problemIds: contest.problems?.map(p => p.id) || [],
            startTime,
            endTime,
            registrationDeadline,
            problemTimeLimit: contest.problemTimeLimit,
            maxAttempts: contest.maxAttempts,
            wrongSubmissionPenalty: contest.wrongSubmissionPenalty,
            coinRewards: contest.coinRewards || [],
            thumbnail: contest.thumbnail || '',
          };

          // Update form data with contest data
          setFormData(contestFormData);
          
          // Set original data for comparison
          setOriginalContestData(contestFormData);
          
          // Set thumbnail image if exists
          if (contest.thumbnail) {
            setThumbnailImage(contest.thumbnail);
          }
          
          // Set selected problems
          if (contest.problems) {
            setSelectedProblems(contest.problems);
          }
          
          setHasLoadedContest(true);
        } catch (error) {
          toast.error('Failed to load contest data');
          console.error('Error loading contest:', error);
        } finally {
          setIsLoadingContest(false);
        }
      };
      
      loadContestData();
    }
  }, [editMode, editContestId, isOpen, hasLoadedContest]);

  // Reset loaded contest flag when edit mode or contest ID changes
  useEffect(() => {
    setHasLoadedContest(false);
  }, [editMode, editContestId]);

  const handleNext = () => {
    const tabs = ['basic', 'problems', 'settings', 'rewards'];
    const currentIndex = tabs.indexOf(activeTab);
    
    // Only validate the current tab when moving to next tab
    const errors = validateForm(formData, activeTab, formData.coinRewards);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix errors in the current tab before proceeding.');
      return;
    }

    setFormErrors({});
    setActiveTab(tabs[currentIndex + 1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all tabs before submitting
    const errors = validateForm(formData, 'all', formData.coinRewards);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix all errors before submitting.');
      return;
    }
    
    try {
      await submitContest(editContestId || undefined, editMode);
      
      // Reset form and close slidebar
      resetForm();
      setHasLoadedContest(false);
      
      // Trigger data reload first, then close
      onSuccess(); // This will trigger data reload in the parent component
      
      // Close slidebar immediately
      onClose();
    } catch (error: any) {
      toast.error(error.message || (editMode ? 'Failed to update contest' : 'Failed to create contest'));
    }
  };

  const handleClose = () => {
    resetForm();
    setActiveTab('basic');
    setHasLoadedContest(false);
    onClose();
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Calendar },
    { id: 'problems', label: 'Problems', icon: Users },
    { id: 'settings', label: 'Settings', icon: Clock },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
  ];

  if (!isOpen) return null;

  // Show loading state while loading contest data
  if (isLoadingContest) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600 dark:text-gray-300">Loading contest data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Slidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Edit Contest' : 'Create New Contest'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {editMode ? 'Update contest details and settings' : 'Set up a new coding contest for participants'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="h-full">
              <div className="p-6 space-y-6">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <BasicInfoTab
                    formData={{
                      title: formData.title,
                      description: formData.description,
                      thumbnail: formData.thumbnail || ''
                    }}
                    formErrors={formErrors}
                    thumbnailImage={thumbnailImage}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    handleInputChange={(e, field) => handleInputChange(e, field as any)}
                    handleThumbnailUpload={handleThumbnailUpload}
                    setThumbnailImage={setThumbnailImage}
                    setFormData={setFormData}
                  />
                )}

                {/* Problems Selection Tab */}
                {activeTab === 'problems' && (
                  <ProblemsTab
                    problems={problems}
                    selectedProblems={selectedProblems}
                    problemSearch={problemSearch}
                    loadingProblems={loadingProblems}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    formErrors={formErrors}
                    handleProblemToggle={handleProblemToggle}
                    handleSearchChange={handleSearchChange}
                    handlePageChange={handlePageChange}
                  />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <SettingsTab
                    formData={formData}
                    formErrors={formErrors}
                    handleInputChange={(e, field) => handleInputChange(e, field as any)}
                  />
                )}

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                  <RewardsTab
                    coinRewards={coinRewards}
                    formErrors={formErrors}
                    addCoinReward={addCoinReward}
                    removeCoinReward={removeCoinReward}
                    updateCoinReward={updateCoinReward}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>

                <div className="flex space-x-4">
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'problems', 'settings', 'rewards'];
                        const currentIndex = tabs.indexOf(activeTab);
                        setActiveTab(tabs[currentIndex - 1]);
                      }}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Previous
                    </button>
                  )}

                  {activeTab !== 'rewards' ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingContest || selectedProblems.length === 0 || Object.keys(formErrors).length > 0}
                      className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {editMode ? 'Updating Contest...' : 'Creating Contest...'}
                        </>
                      ) : (
                        editMode ? 'Update Contest' : 'Create Contest'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestSlidebar;
