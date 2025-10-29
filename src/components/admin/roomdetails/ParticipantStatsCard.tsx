import { Card, CardContent } from '../../Card';

interface ParticipantStatsCardProps {
	participantCount: number;
	onlineParticipants: number;
}

export function ParticipantStatsCard({ participantCount, onlineParticipants }: ParticipantStatsCardProps) {
	return (
		<Card>
			<CardContent className="p-6">
				<h3 className="mb-4 text-lg font-semibold">Participants</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
						<p className="text-2xl font-bold">{participantCount}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-slate-600 dark:text-slate-400">Online</p>
						<p className="text-2xl font-bold text-green-600">{onlineParticipants}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

