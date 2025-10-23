import React from 'react';
import { Clock, Calendar, Users, Trophy, Edit, Trash2 } from 'lucide-react';
import type { Contest } from '../../../types/contest';
import {Card} from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';

interface UpcomingContestCardProps {
  contest: Contest;
  onViewDetails?: (contest: Contest) => void;
  onEdit?: (contest: Contest) => void;
  onDelete?: (contest: Contest) => void;
}

const UpcomingContestCard: React.FC<UpcomingContestCardProps> = ({ 
  contest, 
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const formatTimeUntilStart = (timeUntilStart: number | null) => {
    if (!timeUntilStart) return 'N/A';
    
    const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const startDateTime = formatDateTime(contest.startTime);
  const endDateTime = formatDateTime(contest.endTime);

  return (
    <Card className="h-full">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Thumbnail */}
          {contest.thumbnail && (
            <div className="flex-shrink-0">
              <img
                src={imageKitService.getContestThumbnailUrl(contest.thumbnail, 80, 80)}
                alt={contest.title}
                className="w-16 h-16 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {contest.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {contest.description}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ml-2">
                Upcoming
              </span>
            </div>

            {/* Time Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                <Clock className="w-3 h-3 mr-1" />
                <span>Starts in: {formatTimeUntilStart(contest.status.timeUntilStart)}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{startDateTime.date} at {startDateTime.time}</span>
              </div>
            </div>

            {/* Contest Details */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="w-3 h-3 mr-1" />
                <span>{contest.stats.totalProblems} problems</span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Trophy className="w-3 h-3 mr-1" />
                <span>{contest.coinRewards.length} rewards</span>
              </div>
            </div>

            {/* Duration */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Duration: {Math.floor((new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / (1000 * 60 * 60))}h
            </div>

            {/* Registration Status */}
            <div className="mb-3">
              {contest.status.isRegistrationOpen ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Registration Open
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  Registration Closed
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(contest)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors"
                >
                  View Details
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(contest)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(contest)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpcomingContestCard;
