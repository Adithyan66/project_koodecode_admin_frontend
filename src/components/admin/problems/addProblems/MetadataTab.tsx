import { Building, Lightbulb, Minus, Plus, Tag } from 'lucide-react';
import React from 'react';

type Props = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  hints: string[];
  setHints: React.Dispatch<React.SetStateAction<string[]>>;
  companies: string[];
  setCompanies: React.Dispatch<React.SetStateAction<string[]>>;
  errors: { [key: string]: string };
};

const MetadataTab: React.FC<Props> = ({
  tags,
  setTags,
  hints,
  setHints,
  companies,
  setCompanies,
  errors,
}) => {
  const addToArray = (
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => [...prev, '']);
  };

  const removeFromArray = (
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    if (array.length > 1) {
      setter((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateArray = (
    array: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-300">
            <Tag className="mr-2 h-5 w-5" />
            Tags *
          </h2>
          <button
            type="button"
            onClick={() => addToArray(tags, setTags)}
            className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </button>
        </div>

        {errors.tags && <p className="mb-3 text-sm text-red-500 dark:text-red-400">{errors.tags}</p>}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateArray(tags, setTags, index, e.target.value)}
                className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
                placeholder="Array, Hash Table, Two Pointers"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray(tags, setTags, index)}
                  className="text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-300">
            <Lightbulb className="mr-2 h-5 w-5" />
            Hints (Optional)
          </h2>
          <button
            type="button"
            onClick={() => addToArray(hints, setHints)}
            className="flex items-center rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hint
          </button>
        </div>

        <div className="space-y-3">
          {hints.map((hint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={hint}
                onChange={(e) => updateArray(hints, setHints, index, e.target.value)}
                className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
                placeholder="A really brute force way would be to search for all possible pairs of numbers..."
              />
              {hints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray(hints, setHints, index)}
                  className="text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-300">
            <Building className="mr-2 h-5 w-5" />
            Companies (Optional)
          </h2>
          <button
            type="button"
            onClick={() => addToArray(companies, setCompanies)}
            className="flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={company}
                onChange={(e) => updateArray(companies, setCompanies, index, e.target.value)}
                className="flex-1 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
                placeholder="Google, Microsoft, Amazon, Apple"
              />
              {companies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray(companies, setCompanies, index)}
                  className="text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetadataTab;
