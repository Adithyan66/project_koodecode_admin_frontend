import { type InputHTMLAttributes } from 'react';
import clsx from 'classnames';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

export default function Toggle({ label, className, ...props }: Props) {
  return (
    <label className={clsx('inline-flex cursor-pointer items-center', className)}>
      <div className="relative">
        <input type="checkbox" className="peer sr-only" {...props} />
        <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-500"></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
