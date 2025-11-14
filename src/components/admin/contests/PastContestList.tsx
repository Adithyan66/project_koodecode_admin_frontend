import React from 'react';
import { Calendar,  Trophy, Clock } from 'lucide-react';
import type { Contest } from '../../../types/contest';
import {Card} from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';

interface PastContestListProps {
  contests: Contest[];
  selectedContest: Contest | null;
  onSelectContest: (contest: Contest) => void;
  loading?: boolean;
  error?: string | null;
}

const PastContestList: React.FC<PastContestListProps> = ({
  contests,
  selectedContest,
  onSelectContest,
  loading = false,
  error = null
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400 mb-2">Error loading contests</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{error}</div>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 mb-2">No past contests found</div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Past contests will appear here once they are completed.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contests.map((contest) => (
        <Card
          key={contest.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedContest?.id === contest.id
              ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => onSelectContest(contest)}
        >
          <div className="p-4">
            <div className="flex gap-3">
              {/* Thumbnail */}
              {contest.thumbnail && (
                <div className="flex-shrink-0">
                  <img
                    src={imageKitService.getContestThumbnailUrl(contest.thumbnail, 60, 60)}
                    alt={contest.title}
                    className="w-12 h-12 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {contest.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">
                      Contest #{contest.contestNumber}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    Ended
                  </span>
                </div>

                {/* Contest Info */}
                <div className="grid grid-cols-2 gap-3 mb-2 text-xs">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(contest.startTime)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDuration(contest.startTime, contest.endTime)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contest.stats.totalParticipants}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contest.stats.averageScore.toFixed(1)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {contest.stats.totalProblems}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Problems</div>
                  </div>
                </div>

                {/* Top Reward */}
                {contest.coinRewards.length > 0 && (
                  <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <Trophy className="w-3 h-3 mr-1 text-yellow-500" />
                    <span>Top reward: {contest.coinRewards[0].coins} coins</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PastContestList;
