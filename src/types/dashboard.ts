export interface DashboardResponse {
	users: {
		total: number;
		newUsersThisMonth: number;
		newUsersLastMonth: number;
		verificationRate: number;
		providers: Array<{
			provider: string;
			count: number;
		}>;
		recentSignups: DashboardUser[];
	};
	revenue: {
		currency: string;
		currentMonth: DashboardRevenueSummary;
		previousMonth: DashboardRevenueSummary;
		monthlyTrend: Array<{
			month: string;
			revenue: number;
		}>;
		statusBreakdown: Array<{
			status: string;
			count: number;
			amount: number;
		}>;
		paymentMethods: Array<{
			method: string;
			count: number;
			amount: number;
		}>;
		highRiskOrders: Array<{
			id: string;
			userName: string;
			amount: number;
			status: string;
			createdAt: string;
		}>;
	};
	problems: {
		summary: {
			totalProblems: number;
			activeCount: number;
			inactiveCount: number;
			difficultyDistribution: {
				easy: number;
				medium: number;
				hard: number;
			};
			averageAcceptanceRate: number;
			totalSubmissionsAcrossAll: number;
		};
		topProblemsBySolves: DashboardProblem[];
		recentlyPublished: Array<{
			slug: string;
			title: string;
			difficulty: string;
			status: string;
			createdAt: string;
		}>;
		lowAcceptanceProblems: Array<{
			slug: string;
			title: string;
			acceptanceRate: number;
			totalSubmissions: number;
		}>;
	};
	submissions: {
		summary: {
			totalSubmissions: number;
			acceptedCount: number;
			rejectedCount: number;
			pendingCount: number;
			problemSubmissionsCount: number;
			contestSubmissionsCount: number;
		};
		statusTrend: Array<{
			date: string;
			accepted: number;
			rejected: number;
			pending: number;
		}>;
		languageDistribution: Array<{
			language: string;
			count: number;
			percentage: number;
		}>;
		pendingQueue: Array<{
			id: string;
			problemTitle: string;
			userName: string;
			language: string;
			submittedAt: string;
			retryCount: number;
		}>;
	};
	contests: {
		active: Array<{
			id: string;
			title: string;
			startTime: string;
			endTime: string;
			participants: number;
			completionRate: number;
			averageScore: number;
		}>;
		upcoming: Array<{
			id: string;
			title: string;
			startTime: string;
			registrationDeadline: string;
			registeredParticipants: number;
			capacity: number;
		}>;
		recentResults: Array<{
			id: string;
			title: string;
			endedAt: string;
			participants: number;
			avgScore: number;
			topPerformers: Array<{
				rank: number;
				userName: string;
				score: number;
			}>;
		}>;
	};
	rooms: {
		summary: {
			totalRooms: number;
			active: number;
			waiting: number;
			inactive: number;
			publicCount: number;
			privateCount: number;
			totalParticipants: number;
			onlineParticipants: number;
		};
		recentRooms: Array<{
			id: string;
			name: string;
			status: string;
			isPrivate: boolean;
			participantCount: number;
			lastActivity: string;
		}>;
	};
	notifications: {
		subscribers: {
			total: number;
			newThisMonth: number;
			osDistribution: Array<{
				os: string;
				count: number;
			}>;
		};
		recentCampaigns: Array<{
			id: string;
			title: string;
			sent: number;
			failed: number;
			sentAt: string;
		}>;
	};
	badges: {
		summary: {
			totalBadges: number;
			activeBadges: number;
			recentAwards: number;
			rarityBreakdown: Array<{
				rarity: string;
				count: number;
			}>;
		};
		recentAwards: Array<{
			badgeId: string;
			badgeName: string;
			userName: string;
			awardedAt: string;
		}>;
	};
	store: {
		summary: {
			activeItems: number;
			inactiveItems: number;
			totalInventoryValue: number;
			topSellers: Array<{
				itemId: string;
				name: string;
				price: number;
				salesThisMonth: number;
			}>;
		};
		recentUpdates: Array<{
			itemId: string;
			field: string;
			oldValue: string | number;
			newValue: string | number;
			updatedAt: string;
		}>;
	};
}

export interface DashboardUser {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	provider: string;
	emailVerified: boolean;
	createdAt: string;
	profilePicKey?: string;
	profileImageUrl?: string;
}

export interface DashboardProblem {
	slug: string;
	title: string;
	difficulty: string;
	totalSubmissions: number;
	acceptedSubmissions: number;
	acceptanceRate: number;
}

export interface DashboardRevenueSummary {
	month: string;
	revenue: number;
	orders: number;
	averageOrderValue: number;
}

