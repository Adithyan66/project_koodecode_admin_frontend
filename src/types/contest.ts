export type ContestState = 'ACTIVE' | 'UPCOMING' | 'ENDED';
export type ContestDifficulty = 'easy' | 'medium' | 'hard';

export interface CoinReward {
  rank: number;
  coins: number;
}

export interface ContestStats {
  totalParticipants: number;
  completedParticipants: number;
  inProgressParticipants: number;
  averageScore: number;
  totalProblems: number;
  maxPossibleScore: number;
  isActive: boolean;
  timeRemaining: number | null;
}

export interface ContestProblem {
  id: string;
  problemNumber: number;
  title: string;
  description: string;
  difficulty: ContestDifficulty;
  tags: string[];
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  isActive: boolean;
}

export interface TopPerformer {
  rank: number;
  username: string;
  profileImage: string;
  totalScore: number;
  timeTaken: string;
  attempts: number;
  status: string;
  coinsEarned: number;
}

export interface ContestStatus {
  currentState: ContestState;
  timeUntilStart: number | null;
  timeUntilEnd: number | null;
  timeUntilRegistrationDeadline: number | null;
  isRegistrationOpen: boolean;
  isActive: boolean;
  isEnded: boolean;
  canRegister: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
}

export interface Contest {
  id: string;
  contestNumber: number;
  title: string;
  description: string;
  createdBy: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  registrationDeadline: string;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: CoinReward[];
  state: ContestState;
  createdAt: string;
  updatedAt: string;
  stats: ContestStats;
  problems: ContestProblem[];
  topPerformers: TopPerformer[];
  status: ContestStatus;
}

export interface ContestParticipant {
  id: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  profileImage: string;
  assignedProblemId: string;
  registrationTime: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  rank: number;
  coinsEarned: number;
  status: string;
  attempts: number;
  timeTaken: number;
  submissions: ContestSubmission[];
}

export interface ContestSubmission {
  id: string;
  submittedAt: string;
  isCorrect: boolean;
  timeTaken: number;
  attemptNumber: number;
  penaltyApplied: number;
  status: string;
}

export interface ContestPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ActiveContestsResponse {
  success: boolean;
  message: string;
  data: {
    contests: Contest[];
  };
}

export interface UpcomingContestsResponse {
  success: boolean;
  message: string;
  data: {
    contests: Contest[];
  };
}

export interface PastContestsResponse {
  success: boolean;
  message: string;
  data: {
    contests: Contest[];
    pagination: ContestPagination;
  };
}

export interface ContestQuery {
  page?: number;
  limit?: number;
  search?: string;
  state?: ContestState;
}
