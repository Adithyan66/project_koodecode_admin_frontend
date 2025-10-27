import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../Card';

interface StaleWarningBannerProps {
	isStale: boolean;
}

export default function StaleWarningBanner({ isStale }: StaleWarningBannerProps) {
	if (!isStale) return null;

	return (
		<Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
			<CardContent className="flex items-center gap-3 p-4">
				<AlertTriangle className="h-5 w-5 text-yellow-600" />
				<div>
					<p className="font-semibold text-yellow-800 dark:text-yellow-400">Stale Purchase</p>
					<p className="text-sm text-yellow-700 dark:text-yellow-300">
						This purchase has been pending for more than 30 minutes. Consider marking it as failed.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

