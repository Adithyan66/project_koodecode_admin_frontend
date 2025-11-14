import React from 'react';
import { 
  Calendar, 
  Clock, 
  // Users, 
  Trophy, 
  Target, 
  Award,
  // User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import type { Contest } from '../../../types/contest';
import {Card} from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';

interface ContestDetailViewProps {
  contest: Contest | null;
  loading?: boolean;
}

const ContestDetailView: React.FC<ContestDetailViewProps> = ({ 
  contest, 
  loading = false 
}) => {

  console.log("contesttttttttttttttttttttttttttttttt",contest);
  
  const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-2">No contest selected</div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Select a contest from the list to view its details.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contest Header */}
      <Card>
        <div className="p-6">
          {/* Thumbnail */}
          {contest.thumbnail && (
            <div className="mb-6 flex justify-center">
              <img
                src={imageKitService.getContestThumbnailUrl(contest.thumbnail, 200, 200)}
                alt={contest.title}
                className="w-32 h-32 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {contest.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {contest.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Contest #{contest.contestNumber}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contest.state === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : contest.state === 'UPCOMING'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {contest.state}
                </span>
              </div>
            </div>
          </div>

          {/* Contest Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">Start Time</div>
                <div className="text-xs">{formatDateTime(contest.startTime)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">End Time</div>
                <div className="text-xs">{formatDateTime(contest.endTime)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Target className="w-4 h-4 mr-2" />
              <div>
                <div className="font-medium">Duration</div>
                <div className="text-xs">{formatDuration(contest.startTime, contest.endTime)}</div>
              </div>
            </div>
          </div>

          {/* Contest Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {contest.stats.totalParticipants}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {contest.stats.completedParticipants}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {contest.stats.averageScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {contest.stats.totalProblems}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Problems</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Problems */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Problems ({contest.problems.length})
          </h3>
          <div className="space-y-3">
            {contest.problems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {problem.problemNumber}. {problem.title}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">
                    {problem.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{problem.totalSubmissions} submissions</span>
                    <span>{problem.acceptanceRate}% acceptance</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {problem.isActive ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Performers */}
      {contest.topPerformers && contest.topPerformers.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performers
            </h3>
            <div className="space-y-3">
              {contest.topPerformers.map((performer) => (
                <div key={performer.rank} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-bold">
                      {performer.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={performer.profileImage} 
                        alt={performer.username}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32x32?text=U';
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {performer.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {performer.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {performer.totalScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {performer.coinsEarned} coins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Contest Rules */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contest Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span>Time limit per problem: {contest.problemTimeLimit} minutes</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Target className="w-4 h-4 mr-2" />
              <span>Max attempts: {contest.maxAttempts}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>Wrong submission penalty: {contest.wrongSubmissionPenalty} points</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Award className="w-4 h-4 mr-2" />
              <span>Max possible score: {contest.stats.maxPossibleScore}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Coin Rewards */}
      {contest.coinRewards.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Coin Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contest.coinRewards.map((reward) => (
                <div key={reward.rank} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Rank {reward.rank}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    {reward.coins} coins
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContestDetailView;
