import Button from '../../Button';
import { Card, CardHeader, CardContent } from '../../Card';
import type { PurchaseUser } from '../../../types/coinPurchase';
import { imageKitService } from '../../../services/ImageKitService';

interface UserInfoCardProps {
	user: PurchaseUser;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
	const handleUserClick = () => {
		window.open(`/users/${user.id}`, '_blank');
	};

	const profilePicUrl = user.profilePicKey
		? imageKitService.getAvatarUrl(user.profilePicKey, 1000)
		: null;

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">User Information</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-col items-center gap-3">
					{profilePicUrl && (
						<img
							src={profilePicUrl}
							alt={user.fullName}
							className="h-24 w-24 rounded-full object-cover"
						/>
					)}
					<div className="text-center">
						<p className="font-medium">{user.fullName}</p>
						<p className="text-sm text-gray-600">@{user.userName}</p>
					</div>
				</div>
				<p className="text-sm text-gray-600 text-center">{user.email}</p>
				<Button
					variant="secondary"
					className="w-full"
					onClick={handleUserClick}
				>
					View User Details
				</Button>
			</CardContent>
		</Card>
	);
}

