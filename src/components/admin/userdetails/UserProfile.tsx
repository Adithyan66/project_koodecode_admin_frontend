import { Card, CardContent } from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';
import type { UserDetail } from '../../../types/user';
import { 
	// User, 
	Mail, 
	MapPin, 
	Calendar, 
	// Globe, 
	Github, 
	Linkedin,
	Shield,
	ShieldCheck,
	ShieldX,
	Clock
} from 'lucide-react';

interface UserProfileProps {
	user: UserDetail;
}

export default function UserProfile({ user }: UserProfileProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusIcon = () => {
		if (user.isBlocked) {
			return <ShieldX className="h-5 w-5 text-red-500" />;
		}
		if (user.emailVerified) {
			return <ShieldCheck className="h-5 w-5 text-green-500" />;
		}
		return <Shield className="h-5 w-5 text-yellow-500" />;
	};

	const getStatusText = () => {
		if (user.isBlocked) {
			return 'Blocked';
		}
		if (user.emailVerified) {
			return 'Verified';
		}
		return 'Unverified';
	};

	const getStatusColor = () => {
		if (user.isBlocked) {
			return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900 dark:text-red-200';
		}
		if (user.emailVerified) {
			return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900 dark:text-green-200';
		}
		return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
	};

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex flex-col items-center text-center space-y-4">
					{/* Profile Picture */}
					<div className="relative">
						{user.profilePicKey ? (
							<img
								src={imageKitService.getImageBySize(user.profilePicKey, 'medium')}
								alt={`${user.fullName}'s profile`}
								className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
							/>
						) : (
							<div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
								{user.fullName.charAt(0).toUpperCase()}
							</div>
						)}
						{/* Online Status Indicator */}
						{user.lastLogin && (
							<div className="absolute -bottom-1 -right-1">
								<div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
									<div className="h-2 w-2 rounded-full bg-white"></div>
								</div>
							</div>
						)}
					</div>

					{/* User Info */}
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{user.fullName}
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400">
							@{user.userName}
						</p>
						
						{/* Status Badge */}
						<div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor()}`}>
							{getStatusIcon()}
							{getStatusText()}
						</div>
					</div>

					{/* Bio */}
					{user.bio && (
						<p className="text-gray-600 dark:text-gray-400 max-w-md">
							{user.bio}
						</p>
					)}

					{/* Contact Info */}
					<div className="grid grid-cols-1 gap-3 w-full max-w-md">
						<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
							<Mail className="h-4 w-4" />
							<span>{user.email}</span>
						</div>
						
						{user.location && (
							<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
								<MapPin className="h-4 w-4" />
								<span>{user.location}</span>
							</div>
						)}
						
						{user.birthdate && (
							<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
								<Calendar className="h-4 w-4" />
								<span>Born {formatDate(user.birthdate)}</span>
							</div>
						)}
						
						{user.lastLogin && (
							<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
								<Clock className="h-4 w-4" />
								<span>Last active {formatDateTime(user.lastLogin)}</span>
							</div>
						)}
					</div>

					{/* Social Links */}
					{(user.githubUrl || user.linkedinUrl) && (
						<div className="flex gap-4">
							{user.githubUrl && (
								<a
									href={user.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
								>
									<Github className="h-4 w-4" />
									GitHub
								</a>
							)}
							{user.linkedinUrl && (
								<a
									href={user.linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
								>
									<Linkedin className="h-4 w-4" />
									LinkedIn
								</a>
							)}
						</div>
					)}

					{/* Account Details */}
					<div className="grid grid-cols-2 gap-4 w-full max-w-md text-sm">
						<div className="text-center">
							<p className="text-gray-500 dark:text-gray-400">Provider</p>
							<p className="font-medium capitalize">{user.provider}</p>
						</div>
						<div className="text-center">
							<p className="text-gray-500 dark:text-gray-400">Member Since</p>
							<p className="font-medium">{formatDate(user.createdAt)}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
