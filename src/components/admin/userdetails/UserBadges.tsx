import { Card, CardContent, CardHeader } from '../../Card';
import type { Badge } from '../../../types/user';
import { Award, Trophy, Star, Target } from 'lucide-react';

interface UserBadgesProps {
	badges: Badge[];
}

export default function UserBadges({ badges }: UserBadgesProps) {
	const getBadgeIcon = (badgeType: string) => {
		switch (badgeType.toLowerCase()) {
			case 'achievement':
				return <Award className="h-4 w-4" />;
			case 'streak':
				return <Trophy className="h-4 w-4" />;
			case 'contest':
				return <Star className="h-4 w-4" />;
			default:
				return <Target className="h-4 w-4" />;
		}
	};

	const getBadgeColor = (badgeType: string) => {
		switch (badgeType.toLowerCase()) {
			case 'achievement':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
			case 'streak':
				return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700';
			case 'contest':
				return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
			default:
				return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (!badges || badges.length === 0) {
		return (
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Award className="h-5 w-5" />
						Badges & Achievements
					</h3>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p className="text-gray-500 dark:text-gray-400">
							No badges earned yet
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<h3 className="text-lg font-semibold flex items-center gap-2">
					<Award className="h-5 w-5" />
					Badges & Achievements ({badges.length})
				</h3>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{badges.map((badge) => (
						<div
							key={badge.badgeId}
							className={`p-4 rounded-lg border ${getBadgeColor(badge.badgeType)}`}
						>
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0">
									{getBadgeIcon(badge.badgeType)}
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-semibold text-sm mb-1">
										{badge.name}
									</h4>
									<p className="text-xs mb-2 opacity-80">
										{badge.description}
									</p>
									<div className="text-xs opacity-70">
										<p className="mb-1">
											<strong>Criteria:</strong> {badge.criteria.description}
										</p>
										<p>
											<strong>Awarded:</strong> {formatDate(badge.awardedAt)}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
