import { Card, CardContent, CardHeader } from '../../Card';
import type { UserDetail } from '../../../types/user';
import { 
	Trophy, 
	Target, 
	Coins, 
	Code, 
	TrendingUp, 
	Calendar,
	Zap,
	BarChart3
} from 'lucide-react';

interface UserStatsProps {
	user: UserDetail;
}

export default function UserStats({ user }: UserStatsProps) {
	const stats = [
		{
			label: 'Ranking',
			value: user.ranking?.toLocaleString() || 'N/A',
			icon: Trophy,
			color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-200',
		},
		{
			label: 'Contest Rating',
			value: user.contestRating?.toLocaleString() || 'N/A',
			icon: TrendingUp,
			color: 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200',
		},
		{
			label: 'Acceptance Rate',
			value: user.acceptanceRate ? `${user.acceptanceRate.toFixed(1)}%` : 'N/A',
			icon: Target,
			color: 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-200',
		},
		{
			label: 'Coin Balance',
			value: user.coinBalance?.toLocaleString() || 'N/A',
			icon: Coins,
			color: 'text-purple-600 bg-purple-50 dark:bg-purple-900 dark:text-purple-200',
		},
		{
			label: 'Total Problems',
			value: user.totalProblems?.toLocaleString() || 'N/A',
			icon: Code,
			color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:text-indigo-200',
		},
		{
			label: 'Active Days',
			value: user.activeDays?.toLocaleString() || 'N/A',
			icon: Calendar,
			color: 'text-orange-600 bg-orange-50 dark:bg-orange-900 dark:text-orange-200',
		},
	];

	const problemStats = [
		{
			difficulty: 'Easy',
			count: user.easyProblems || 0,
			color: 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-200',
		},
		{
			difficulty: 'Medium',
			count: user.mediumProblems || 0,
			color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-200',
		},
		{
			difficulty: 'Hard',
			count: user.hardProblems || 0,
			color: 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200',
		},
	];

	return (
		<div className="space-y-6">
			{/* Main Stats Grid */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Performance Statistics
					</h3>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{stats.map((stat, index) => {
							const IconComponent = stat.icon;
							return (
								<div key={index} className="text-center">
									<div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${stat.color}`}>
										<IconComponent className="h-6 w-6" />
									</div>
									<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
										{stat.value}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{stat.label}
									</p>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Problem Difficulty Breakdown */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Code className="h-5 w-5" />
						Problem Difficulty Breakdown
					</h3>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{problemStats.map((stat, index) => (
							<div key={index} className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{stat.difficulty}
								</span>
								<div className="flex items-center gap-2">
									<span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										{stat.count}
									</span>
									<div className={`w-3 h-3 rounded-full ${stat.color.split(' ')[0]} ${stat.color.split(' ')[1]}`}></div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Streak Information */}
			{user.streak && (
				<Card>
					<CardHeader>
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Zap className="h-5 w-5" />
							Activity Streak
						</h3>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-orange-600">
									{user.streak.currentCount}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Current Streak
								</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-blue-600">
									{user.streak.maxCount}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Best Streak
								</p>
							</div>
						</div>
						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Last active: {new Date(user.streak.lastActiveDate).toLocaleDateString()}
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
