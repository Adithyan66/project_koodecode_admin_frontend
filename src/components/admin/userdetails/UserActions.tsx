import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../Card';
import Button from '../../Button';
import Modal from '../../Modal';
import type { UserDetail } from '../../../types/user';
import { 
	Shield, 
	ShieldX, 
	Key, 
	Trash2, 
	Mail, 
	RefreshCw,
	AlertTriangle
} from 'lucide-react';

interface UserActionsProps {
	user: UserDetail;
	onBlockUser: () => Promise<void>;
	onUnblockUser: () => Promise<void>;
	onResetPassword: () => Promise<void>;
	onDeleteUser: () => Promise<void>;
	onSendNotification: (message: string) => Promise<void>;
	onRefresh: () => Promise<void>;
	actionLoading: boolean;
	actionError: string | null;
}

export default function UserActions({
	user,
	onBlockUser,
	onUnblockUser,
	onResetPassword,
	onDeleteUser,
	onSendNotification,
	onRefresh,
	actionLoading,
	actionError
}: UserActionsProps) {
	const [showBlockModal, setShowBlockModal] = useState(false);
	const [showUnblockModal, setShowUnblockModal] = useState(false);
	const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showNotificationModal, setShowNotificationModal] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');

	const handleBlockUser = async () => {
		await onBlockUser();
		setShowBlockModal(false);
	};

	const handleUnblockUser = async () => {
		await onUnblockUser();
		setShowUnblockModal(false);
	};

	const handleResetPassword = async () => {
		await onResetPassword();
		setShowResetPasswordModal(false);
	};

	const handleDeleteUser = async () => {
		await onDeleteUser();
		setShowDeleteModal(false);
	};

	const handleSendNotification = async () => {
		if (notificationMessage.trim()) {
			await onSendNotification(notificationMessage);
			setNotificationMessage('');
			setShowNotificationModal(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Admin Actions
					</h3>
				</CardHeader>
				<CardContent>
					{actionError && (
						<div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
							<div className="flex items-center gap-2">
								<AlertTriangle className="h-4 w-4" />
								<span className="text-sm">{actionError}</span>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{/* Block/Unblock User */}
						{user.isBlocked ? (
							<Button
								onClick={() => setShowUnblockModal(true)}
								disabled={actionLoading}
								className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
							>
								<Shield className="h-4 w-4" />
								Unblock User
							</Button>
						) : (
							<Button
								onClick={() => setShowBlockModal(true)}
								disabled={actionLoading}
								className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
							>
								<ShieldX className="h-4 w-4" />
								Block User
							</Button>
						)}

						{/* Reset Password */}
						<Button
							onClick={() => setShowResetPasswordModal(true)}
							disabled={actionLoading}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
						>
							<Key className="h-4 w-4" />
							Reset Password
						</Button>

						{/* Send Notification */}
						<Button
							onClick={() => setShowNotificationModal(true)}
							disabled={actionLoading}
							className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
						>
							<Mail className="h-4 w-4" />
							Send Notification
						</Button>

						{/* Delete User */}
						<Button
							onClick={() => setShowDeleteModal(true)}
							disabled={actionLoading}
							className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white"
						>
							<Trash2 className="h-4 w-4" />
							Delete User
						</Button>

						{/* Refresh Data */}
						<Button
							onClick={onRefresh}
							disabled={actionLoading}
							className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white md:col-span-2"
						>
							<RefreshCw className="h-4 w-4" />
							Refresh All Data
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Block User Modal */}
			<Modal
				isOpen={showBlockModal}
				onClose={() => setShowBlockModal(false)}
				onConfirm={handleBlockUser}
				title="Block User"
				message={`Are you sure you want to block ${user.fullName}? This will prevent them from accessing the platform.`}
				type="warning"
				confirmText="Block User"
				cancelText="Cancel"
			/>

			{/* Unblock User Modal */}
			<Modal
				isOpen={showUnblockModal}
				onClose={() => setShowUnblockModal(false)}
				onConfirm={handleUnblockUser}
				title="Unblock User"
				message={`Are you sure you want to unblock ${user.fullName}? They will regain access to the platform.`}
				type="info"
				confirmText="Unblock User"
				cancelText="Cancel"
			/>

			{/* Reset Password Modal */}
			<Modal
				isOpen={showResetPasswordModal}
				onClose={() => setShowResetPasswordModal(false)}
				onConfirm={handleResetPassword}
				title="Reset Password"
				message={`Are you sure you want to reset the password for ${user.fullName}? A new password will be generated and sent to their email.`}
				type="warning"
				confirmText="Reset Password"
				cancelText="Cancel"
			/>

			{/* Delete User Modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteUser}
				title="Delete User Account"
				message={`Are you sure you want to permanently delete ${user.fullName}'s account? This action cannot be undone and will remove all user data.`}
				type="error"
				confirmText="Delete Account"
				cancelText="Cancel"
			/>

			{/* Send Notification Modal */}
			<Modal
				isOpen={showNotificationModal}
				onClose={() => setShowNotificationModal(false)}
				onConfirm={handleSendNotification}
				title="Send Notification"
				message={
					<div className="space-y-4">
						<p>Send a notification to {user.fullName}:</p>
						<textarea
							value={notificationMessage}
							onChange={(e) => setNotificationMessage(e.target.value)}
							placeholder="Enter your message here..."
							className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
						/>
					</div>
				}
				type="info"
				confirmText="Send Notification"
				cancelText="Cancel"
				showCancel={true}
			/>
		</>
	);
}
