import { useEffect, useState } from 'react';
import { fetchSubmissionDetail } from '../../api/submissions';
import type { SubmissionDetail } from '../../types/submissionDetail';

interface UseSubmissionDetailReturn {
	data: SubmissionDetail | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useSubmissionDetail(submissionId: string): UseSubmissionDetailReturn {
	const [data, setData] = useState<SubmissionDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetchSubmissionDetail(submissionId);
			setData(response.data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch submission detail');
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!submissionId) return;
		load();
	}, [submissionId]);

	return {
		data,
		loading,
		error,
		refetch: load,
	};
}
