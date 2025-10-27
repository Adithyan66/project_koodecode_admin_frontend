import { Card, CardHeader, CardContent } from '../../Card';
import type { Note } from '../../../types/coinPurchase';

interface NotesHistoryCardProps {
	notes?: Note[];
}

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export default function NotesHistoryCard({ notes }: NotesHistoryCardProps) {
	if (!notes || notes.length === 0) return null;

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">Activity Notes</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{notes.map((note, index) => (
						<div key={index} className="border-l-4 border-blue-500 pl-4">
							<p className="text-sm text-gray-700 dark:text-gray-300">{note.text}</p>
							<div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
								<span>By: {note.createdByUserName}</span>
								<span>•</span>
								<span>{formatDate(note.createdAt)}</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

