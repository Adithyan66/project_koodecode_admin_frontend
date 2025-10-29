import { Card, CardContent } from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';

interface CreatorInfoCardProps {
	creator?: {
		id: string;
		username: string;
		email: string;
		profilePicKey?: string;
	};
	createdBy: string;
	createdByUsername: string;
}

export function CreatorInfoCard({ creator, createdBy, createdByUsername }: CreatorInfoCardProps) {
	return (
		<Card>
			<CardContent className="p-6">
				<h3 className="mb-4 text-lg font-semibold">Creator</h3>
				<div className="flex items-center gap-4">
					{creator?.profilePicKey ? (
						<img
							src={imageKitService.getAvatarUrl(creator.profilePicKey, 60)}
							alt={creator.username}
							className="h-15 w-15 rounded-full"
						/>
					) : (
						<div className="flex h-15 w-15 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
							<span className="text-xl">{createdByUsername.charAt(0).toUpperCase()}</span>
						</div>
					)}
					<div>
						<p className="font-medium">{createdByUsername}</p>
						{creator?.email && <p className="text-sm text-slate-600 dark:text-slate-400">{creator.email}</p>}
						<p className="font-mono text-xs text-slate-500 dark:text-slate-500">{createdBy}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

