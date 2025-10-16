import { useParams } from 'react-router-dom';

export default function ProblemDetail() {
	const { slug } = useParams();
	return (
		<div>
			<h1 className="mb-2 text-2xl font-bold">Problem: {slug}</h1>
			<p className="text-slate-600 dark:text-slate-300">Detail view coming soon.</p>
		</div>
	);
}


