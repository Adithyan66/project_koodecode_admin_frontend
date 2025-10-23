import React from 'react';
import { useContest } from '../hooks/data/useContest';
import { 
  ActiveContestCard, 
  UpcomingContestCard, 
  PastContestList, 
  ContestDetailView,
  CreateContestSlidebar
} from '../components/admin/contests';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

export default function Contests() {
  const {
    state: { 
      activeContests, 
      upcomingContests, 
      pastContests, 
      selectedContest, 
      error, 
      loading 
    },
    actions,
    pastContestsPagination: { 
      page, 
      totalPages, 
      hasNextPage, 
      hasPreviousPage, 
      goToNextPage, 
      goToPreviousPage 
    },
    pastContestsFilters: { search, setSearch }
  } = useContest();

  const [showContestModal, setShowContestModal] = React.useState(false);
  const [modalContest, setModalContest] = React.useState(null);
  const [showCreateSlidebar, setShowCreateSlidebar] = React.useState(false);
  const [editContestId, setEditContestId] = React.useState<string | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [contestToDelete, setContestToDelete] = React.useState<any>(null);

  const handleViewContestDetails = (contest: any) => {
    setModalContest(contest);
    setShowContestModal(true);
  };

  const handleCloseModal = () => {
    setShowContestModal(false);
    setModalContest(null);
  };

  const handleCreateSuccess = () => {
    // Refresh the contest data
    actions.refetch();
  };

  const handleEditContest = (contest: any) => {
    setEditContestId(contest.id);
    setEditMode(true);
    setShowCreateSlidebar(true);
  };

  const handleDeleteContest = (contest: any) => {
    setContestToDelete(contest);
    setShowDeleteModal(true);
  };

  const confirmDeleteContest = async () => {
    if (contestToDelete) {
      try {
        await actions.deleteContestById(contestToDelete.id);
        setShowDeleteModal(false);
        setContestToDelete(null);
      } catch (error) {
        console.error('Error deleting contest:', error);
      }
    }
  };

  const handleCloseSlidebar = () => {
    setShowCreateSlidebar(false);
    setEditContestId(null);
    setEditMode(false);
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-2">Error loading contests</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Contest Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor active contests, upcoming events, and review past contest results.
          </p>
        </div>
        <button
          onClick={() => setShowCreateSlidebar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Contest
        </button>
      </div>

      {/* Top Section - Active and Upcoming Contests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Contests - Top Left */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Contests ({activeContests.length})
          </h2>
          {activeContests.length > 0 ? (
            <div className="space-y-4">
              {activeContests.map((contest) => (
                <ActiveContestCard
                  key={contest.id}
                  contest={contest}
                  onViewDetails={handleViewContestDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 mb-2">No active contests</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Active contests will appear here when they are running.
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Contests - Top Right */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Contests ({upcomingContests.length})
          </h2>
          {upcomingContests.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {upcomingContests.slice(0, 3).map((contest) => (
                <UpcomingContestCard
                  key={contest.id}
                  contest={contest}
                  onViewDetails={handleViewContestDetails}
                  onEdit={handleEditContest}
                  onDelete={handleDeleteContest}
                />
              ))}
              {upcomingContests.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    +{upcomingContests.length - 3} more upcoming contests
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 mb-2">No upcoming contests</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Upcoming contests will appear here when they are scheduled.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Past Contests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Past Contests ({pastContests.length})
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search past contests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Past Contests List - Left Side */}
          <div className="lg:col-span-1">
            <PastContestList
              contests={pastContests}
              selectedContest={selectedContest}
              onSelectContest={actions.setSelectedContest}
              loading={loading}
              error={error}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={!hasPreviousPage}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={!hasNextPage}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Contest Details - Right Side */}
          <div className="lg:col-span-2">
            <ContestDetailView
              contest={selectedContest}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Contest Details Modal */}
      {showContestModal && modalContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 mx-4 w-full max-w-4xl max-h-[90vh] rounded-lg bg-white shadow-xl dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contest Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-6">
              <ContestDetailView contest={modalContest} />
            </div>
          </div>
        </div>
      )}

      {/* Create Contest Slidebar */}
      <CreateContestSlidebar
        isOpen={showCreateSlidebar}
        onClose={handleCloseSlidebar}
        onSuccess={handleCreateSuccess}
        editContestId={editContestId}
        editMode={editMode}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setContestToDelete(null);
        }}
        onConfirm={confirmDeleteContest}
        title="Delete Contest"
        message={`Are you sure you want to delete the contest "${contestToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
        type="error"
      />
    </div>
  );
}


