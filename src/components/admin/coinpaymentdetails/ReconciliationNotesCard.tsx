import { Card, CardHeader, CardContent } from '../../Card';

interface ReconciliationNotesCardProps {
	notes?: string;
}

export default function ReconciliationNotesCard({ notes }: ReconciliationNotesCardProps) {
	if (!notes) return null;

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">Reconciliation Notes</CardHeader>
			<CardContent>
				<p className="text-sm whitespace-pre-wrap">{notes}</p>
			</CardContent>
		</Card>
	);
}

