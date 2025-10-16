import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'classnames';

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, ...props }, ref) {
	return (
		<input
			ref={ref}
			className={clsx(
				'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 outline-none transition-shadow focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400',
				className,
			)}
			{...props}
		/>
	);
});

export default Input;


