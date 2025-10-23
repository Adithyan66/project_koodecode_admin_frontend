import React from 'react';
import { Clock, Users, Trophy, Target } from 'lucide-react';
import type { Contest } from '../../../types/contest';
import { Card } from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';

interface ActiveContestCardProps {
  contest: Contest;
  onViewDetails?: (contest: Contest) => void;
}

const ActiveContestCard: React.FC<ActiveContestCardProps> = ({
  contest,
  onViewDetails
}) => {
  const formatTimeRemaining = (timeRemaining: number | null) => {
    if (!timeRemaining) return 'N/A';

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Thumbnail */}
          {contest.thumbnail && (
            <div className="flex-shrink-0">
              <img
                src={imageKitService.getContestThumbnailUrl(contest.thumbnail, 100, 100)}
                alt={contest.title}
                className="w-20 h-20 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {contest.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {contest.description}
                </p>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              </div>
            </div>

            {/* Contest Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <div>
                  <div className="font-medium">Ends in</div>
                  <div className="text-xs">{formatTimeRemaining(contest.stats.timeRemaining)}</div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                <div>
                  <div className="font-medium">Participants</div>
                  <div className="text-xs">{contest.stats.totalParticipants}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contest.stats.completedParticipants}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contest.stats.inProgressParticipants}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contest.stats.averageScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Avg Score</div>
              </div>
            </div>

            {/* Problems */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Problems ({contest.problems.length})
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Max Score: {contest.stats.maxPossibleScore}
                </span>
              </div>
              <div className="space-y-1">
                {contest.problems.slice(0, 2).map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {problem.problemNumber}. {problem.title}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {problem.acceptanceRate}%
                    </span>
                  </div>
                ))}
                {contest.problems.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{contest.problems.length - 2} more problems
                  </div>
                )}
              </div>
            </div>

            {/* Top Performers */}
            {contest.topPerformers && contest.topPerformers.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Top Performers
                  </span>
                </div>
                <div className="space-y-1">
                  {contest.topPerformers.slice(0, 3).map((performer) => (
                    <div key={performer.rank} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-800 text-xs flex items-center justify-center mr-2">
                          {performer.rank}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 truncate">
                          {performer.username}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {performer.totalScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(contest)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActiveContestCard;
