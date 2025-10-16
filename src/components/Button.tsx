import type{ ButtonHTMLAttributes } from 'react';
import clsx from 'classnames';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ className, variant = 'primary', ...props }: Props) {
	const base = 'rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none';
	const variants: Record<string, string> = {
		primary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
		secondary: 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
		ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
	};
	return <button className={clsx(base, variants[variant], className)} {...props} />;
}


