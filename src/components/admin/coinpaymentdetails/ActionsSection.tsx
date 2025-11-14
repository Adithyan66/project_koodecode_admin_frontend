import { useState } from 'react';
import Button from '../../Button';
import type { CoinPurchaseDetail } from '../../../types/coinPurchase';
import { PurchaseStatus } from '../../../types/coinPurchase';

interface ActionsSectionProps {
	purchase: CoinPurchaseDetail;
	canReconcile: boolean;
	actionLoading: boolean;
	onReconcile: (notes?: string) => Promise<void>;
	onCancel: (notes?: string) => Promise<void>;
	onMarkAsFailed: (reason?: string) => Promise<void>;
	onSendReminder: () => Promise<void>;
	onNotifySuccess: () => Promise<void>;
	onNotifyFailure: () => Promise<void>;
	onAddNotes: (notes: string) => Promise<void>;
	onProcessRefund: (reason?: string) => Promise<void>;
}

export default function ActionsSection({
	purchase,
	canReconcile,
	actionLoading,
	onReconcile,
	onCancel,
	onMarkAsFailed,
	onSendReminder,
	onNotifySuccess,
	onNotifyFailure,
	onAddNotes,
	onProcessRefund,
}: ActionsSectionProps) {
	const [showModal, setShowModal] = useState(false);
	const [modalConfig, setModalConfig] = useState<{
		type: 'warning' | 'error' | 'info' | 'success';
		title: string;
		message: string;
		showTextarea?: boolean;
		textareaLabel?: string;
		onConfirm?: (notes: string) => void;
	}>({
		type: 'warning',
		title: '',
		message: '',
	});

	const [showNotesModal, setShowNotesModal] = useState(false);
	const [notes, setNotes] = useState('');
	const [modalNotes, setModalNotes] = useState('');

	const openModal = (
		type: 'warning' | 'error' | 'info' | 'success',
		title: string,
		message: string,
		showTextarea = false,
		textareaLabel?: string,
		onConfirm?: (notes: string) => void
	) => {
		setModalNotes('');
		setModalConfig({ type, title, message, showTextarea, textareaLabel, onConfirm });
		setShowModal(true);
	};

	const handleReconcileClick = () => {
		openModal(
			'warning',
			'Reconcile Purchase',
			'Are you sure you want to manually mark this purchase as completed?',
			true,
			'Reconciliation Notes (optional)',
			(notes: string) => onReconcile(notes.trim() || undefined)
		);
	};

	const handleCancelClick = () => {
		openModal(
			'warning',
			'Cancel Purchase',
			'Are you sure you want to cancel this purchase?',
			true,
			'Reason for Cancellation (optional)',
			(notes: string) => onCancel(notes.trim() || undefined)
		);
	};

	const handleMarkAsFailedClick = () => {
		openModal(
			'error',
			'Mark as Failed',
			'Are you sure you want to mark this purchase as failed?',
			true,
			'Failure Reason (optional)',
			(notes: string) => onMarkAsFailed(notes.trim() || undefined)
		);
	};

	const handleProcessRefundClick = () => {
		openModal(
			'error',
			'Process Refund',
			'Are you sure you want to process a refund for this purchase?',
			true,
			'Refund Reason (optional)',
			(notes: string) => onProcessRefund(notes.trim() || undefined)
		);
	};

	const submitNotes = () => {
		onAddNotes(notes);
		setShowNotesModal(false);
		setNotes('');
	};

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{canReconcile && (
					<Button variant="primary" onClick={handleReconcileClick} disabled={actionLoading}>
						✓ Reconcile Purchase
					</Button>
				)}
				{purchase.status === PurchaseStatus.PENDING && !canReconcile && (
					<Button variant="secondary" onClick={handleCancelClick} disabled={actionLoading}>
						Cancel Purchase
					</Button>
				)}
				{purchase.status === PurchaseStatus.PENDING && (
					<Button variant="secondary" onClick={handleMarkAsFailedClick} disabled={actionLoading}>
						Mark as Failed
					</Button>
				)}
				{purchase.status === PurchaseStatus.PENDING && (
					<Button variant="secondary" onClick={onSendReminder} disabled={actionLoading}>
						Send Reminder
					</Button>
				)}
				{purchase.status === PurchaseStatus.COMPLETED && (
					<Button variant="secondary" onClick={onNotifySuccess} disabled={actionLoading}>
						Notify Success
					</Button>
				)}
				{purchase.status === PurchaseStatus.COMPLETED && !purchase.refundedAt && (
					<Button variant="secondary" onClick={handleProcessRefundClick} disabled={actionLoading}>
						Process Refund
					</Button>
				)}
				{purchase.status === PurchaseStatus.FAILED && (
					<Button variant="secondary" onClick={onNotifyFailure} disabled={actionLoading}>
						Notify Failure
					</Button>
				)}
				<Button 
					variant="ghost" 
					onClick={() => setShowNotesModal(true)} 
					disabled={actionLoading}
				>
					Add Notes
				</Button>
			</div>

			{/* Confirmation Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
					<div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
						{/* Header */}
						<div className={`flex items-center justify-between border-b px-6 py-4 dark:border-gray-700 ${
							modalConfig.type === 'error' ? 'border-red-200' : 
							modalConfig.type === 'warning' ? 'border-yellow-200' : 
							'border-gray-200'
						}`}>
							<h3 className={`text-lg font-semibold ${
								modalConfig.type === 'error' ? 'text-red-600' : 
								modalConfig.type === 'warning' ? 'text-yellow-600' : 
								'text-blue-600'
							}`}>
								{modalConfig.title}
							</h3>
							<button
								onClick={() => setShowModal(false)}
								disabled={actionLoading}
								className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
							>
								✕
							</button>
						</div>

						{/* Body */}
						<div className="p-6">
							<p className="mb-4 text-gray-700 dark:text-gray-300">
								{modalConfig.message}
							</p>
							
							{modalConfig.showTextarea && (
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										{modalConfig.textareaLabel}
									</label>
									<textarea
										className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
										rows={4}
										placeholder="Enter notes or reason..."
										value={modalNotes}
										onChange={(e) => setModalNotes(e.target.value)}
									/>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
							<Button
								variant="secondary"
								onClick={() => setShowModal(false)}
								disabled={actionLoading}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={async () => {
									// Pass modalNotes to the onConfirm callback
									await modalConfig.onConfirm?.(modalNotes);
									setShowModal(false);
									setTimeout(() => setModalNotes(''), 100);
								}}
								disabled={actionLoading}
								className={modalConfig.type === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
							>
								{actionLoading ? 'Processing...' : 'Confirm'}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Notes Modal */}
			{showNotesModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={() => setShowNotesModal(false)} />
					<div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
						<h3 className="mb-4 text-lg font-semibold">Add Reconciliation Notes</h3>
						<textarea
							className="mb-4 w-full rounded border p-2 dark:bg-gray-900 dark:text-white"
							rows={5}
							placeholder="Enter notes..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
						<div className="flex justify-end gap-3">
							<Button variant="secondary" onClick={() => setShowNotesModal(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={submitNotes} disabled={actionLoading}>
								{actionLoading ? 'Saving...' : 'Save Notes'}
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

