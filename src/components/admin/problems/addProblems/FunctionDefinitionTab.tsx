import React, { useEffect, useState } from 'react';
import { Code, Plus, X, Languages, FileText } from 'lucide-react';
import type {
  Parameter,
  Language,
  ProblemTemplate,
  LanguageTemplate,
} from '../../../../types/problemCreate';

// Keep logic identical to provided version; minor fixes for types/imports and UI classes
export const SUPPORTED_TYPES: string[] = [
  'number',
  'string',
  'boolean',
  'number[]',
  'string[]',
  'boolean[]',
  'number[][]',
  'string[][]',
  'TreeNode',
  'ListNode',
  'object',
];

type Props = {
  functionName: string;
  setFunctionName: React.Dispatch<React.SetStateAction<string>>;
  returnType: string;
  setReturnType: React.Dispatch<React.SetStateAction<string>>;
  parameters: Parameter[];
  setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
  languages: Language[];
  selectedLanguageIds: number[];
  setSelectedLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
  templates: ProblemTemplate;
  setTemplates: React.Dispatch<React.SetStateAction<ProblemTemplate>>;
  isLoadingLanguages: boolean;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
};

const FunctionDefinitionTab: React.FC<Props> = ({
  functionName,
  setFunctionName,
  returnType,
  setReturnType,
  parameters,
  setParameters,
  languages,
  selectedLanguageIds,
  setSelectedLanguageIds,
  templates,
  setTemplates,
  isLoadingLanguages,
}) => {
  const [activeTemplateTab, setActiveTemplateTab] = useState<number | null>(null);

  const getLanguageKey = (languageName: string): string => {
    const name = languageName.toLowerCase();
    if (name.includes('c++') || name.includes('cpp')) return 'cpp';
    if (name.includes('c') && !name.includes('c++') && !name.includes('c#')) return 'c';
    if (name.includes('java') && !name.includes('javascript')) return 'java';
    if (name.includes('python')) return 'python';
    if (name.includes('javascript') || name.includes('node')) return 'javascript';
    if (name.includes('typescript')) return 'typescript';
    if (name.includes('c#') || name.includes('csharp')) return 'csharp';
    if (name.includes('go')) return 'go';
    if (name.includes('rust')) return 'rust';
    if (name.includes('kotlin')) return 'kotlin';
    if (name.includes('swift')) return 'swift';
    return 'generic';
  };

  const generateFunctionSignature = (
    languageKey: string,
    funcName: string,
    retType: string,
    params: Parameter[],
  ) => {
    if (!funcName || params.some((p) => !p.name || !p.type)) return '';

    const typeMap: { [key: string]: { [lang: string]: string } } = {
      number: {
        typescript: 'number',
        javascript: 'number',
        java: 'int',
        python: 'int',
        cpp: 'int',
        c: 'int',
        csharp: 'int',
        go: 'int',
        rust: 'i32',
        kotlin: 'Int',
        swift: 'Int',
        generic: 'int',
      },
      string: {
        typescript: 'string',
        javascript: 'string',
        java: 'String',
        python: 'str',
        cpp: 'string',
        c: 'char*',
        csharp: 'string',
        go: 'string',
        rust: 'String',
        kotlin: 'String',
        swift: 'String',
        generic: 'string',
      },
      boolean: {
        typescript: 'boolean',
        javascript: 'boolean',
        java: 'boolean',
        python: 'bool',
        cpp: 'bool',
        c: 'int',
        csharp: 'bool',
        go: 'bool',
        rust: 'bool',
        kotlin: 'Boolean',
        swift: 'Bool',
        generic: 'bool',
      },
      'number[]': {
        typescript: 'number[]',
        javascript: 'number[]',
        java: 'int[]',
        python: 'List[int]',
        cpp: 'vector<int>',
        c: 'int*',
        csharp: 'int[]',
        go: '[]int',
        rust: 'Vec<i32>',
        kotlin: 'IntArray',
        swift: '[Int]',
        generic: 'int[]',
      },
      'string[]': {
        typescript: 'string[]',
        javascript: 'string[]',
        java: 'String[]',
        python: 'List[str]',
        cpp: 'vector<string>',
        c: 'char**',
        csharp: 'string[]',
        go: '[]string',
        rust: 'Vec<String>',
        kotlin: 'Array<String>',
        swift: '[String]',
        generic: 'string[]',
      },
    };

    const validParams = params.filter((p) => p.name.trim() && p.type);
    const paramStrings = validParams
      .map((p) => {
        const mappedType = typeMap[p.type]?.[languageKey] || p.type;
        switch (languageKey) {
          case 'typescript':
          case 'javascript':
            return `${p.name}: ${mappedType}`;
          case 'java':
          case 'csharp':
          case 'cpp':
          case 'c':
          case 'kotlin':
            return `${mappedType} ${p.name}`;
          case 'python':
          case 'rust':
          case 'swift':
            return `${p.name}: ${mappedType}`;
          case 'go':
            return `${p.name} ${mappedType}`;
          default:
            return `${mappedType} ${p.name}`;
        }
      })
      .join(', ');

    const mappedReturnType = typeMap[retType]?.[languageKey] || retType;

    switch (languageKey) {
      case 'typescript':
        return `function ${funcName}(${paramStrings}): ${mappedReturnType}`;
      case 'javascript':
        return `function ${funcName}(${paramStrings})`;
      case 'java':
        return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'python':
        return `def ${funcName}(self, ${paramStrings}) -> ${mappedReturnType}:`;
      case 'cpp':
      case 'c':
        return `${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'csharp':
        return `public ${mappedReturnType} ${funcName}(${paramStrings})`;
      case 'go':
        return `func ${funcName}(${paramStrings}) ${mappedReturnType}`;
      case 'rust':
        return `fn ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
      case 'kotlin':
        return `fun ${funcName}(${paramStrings}): ${mappedReturnType}`;
      case 'swift':
        return `func ${funcName}(${paramStrings}) -> ${mappedReturnType}`;
      default:
        return `${mappedReturnType} ${funcName}(${paramStrings})`;
    }
  };

  const generateDefaultTemplate = (
    language: Language,
    funcName: string,
    retType: string,
    params: Parameter[],
  ): LanguageTemplate => {
    const languageKey = getLanguageKey(language.name);
    const placeholder = 'USER_FUNCTION_PLACEHOLDER';
    const signature = generateFunctionSignature(languageKey, funcName, retType, params);

    const validParams = params.filter((p) => p.name.trim() && p.type);

    switch (languageKey) {
      case 'c':
        return {
          templateCode: `#include <stdio.h>
#include <stdlib.h>

${placeholder}

int main() {
    // Read input from stdin
${validParams.map((p) => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
    // Call your function
    // TODO: Call ${funcName} and print result
    
    return 0;
}`,
          userFunctionSignature: signature,
          placeholder,
        };

      case 'cpp':
        return {
          templateCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

${placeholder}

int main() {
    // Read input from stdin
${validParams.map((p) => `    // TODO: Read ${p.name} (${p.type})`).join('\n')}
    
    // Call your function
    // TODO: Call ${funcName} and print result
    
    return 0;
}`,
          userFunctionSignature: signature,
          placeholder,
        };

      case 'java':
        return {
          templateCode: `import java.util.*;
import java.io.*;

public class Solution {
    ${placeholder}
    
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // Read input from stdin
${validParams.map((p) => `        // TODO: Read ${p.name} (${p.type})`).join('\n')}
        
        Solution solution = new Solution();
        // TODO: Call ${funcName} and print result
        
        br.close();
    }
}`,
          userFunctionSignature: signature,
          placeholder,
        };

      case 'python':
        return {
          templateCode: `import sys
from typing import List, Optional

class Solution:
    ${placeholder}

if __name__ == "__main__":
    # Read input from stdin
    lines = sys.stdin.read().strip().split('\\n')
    
    # TODO: Parse input
${validParams.map((p) => `    # ${p.name}: ${p.type}`).join('\n')}
    
    # Create solution instance and call function
    solution = Solution()
    # TODO: Call ${funcName} and print result`,
          userFunctionSignature: signature,
          placeholder,
        };

      case 'javascript':
      case 'nodejs':
        return {
          templateCode: `const readline = require('readline');

${placeholder}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line.trim());
}).on('close', () => {
    // Parse input
${validParams.map((p) => `    // TODO: Parse ${p.name} (${p.type})`).join('\n')}
    
    // Call function and print result
    // TODO: Call ${funcName} and print result
});`,
          userFunctionSignature: signature,
          placeholder,
        };

      default:
        return {
          templateCode: `${placeholder}

// TODO: Implement main function and input/output handling
// Read from stdin, call your function, and print the result`,
          userFunctionSignature: signature,
          placeholder,
        };
    }
  };

  // Initialize and cleanup templates
  useEffect(() => {
    setTemplates((prev) => {
      const newTemplates = { ...prev } as ProblemTemplate;
      selectedLanguageIds.forEach((langId) => {
        if (!newTemplates[langId]) {
          const language = languages.find((l) => l.id === langId);
          if (language) {
            newTemplates[langId] = generateDefaultTemplate(
              language,
              functionName,
              returnType,
              parameters,
            );
          }
        }
      });

      Object.keys(newTemplates).forEach((langIdStr) => {
        const langId = parseInt(langIdStr, 10);
        if (!selectedLanguageIds.includes(langId)) {
          delete newTemplates[langId];
        }
      });

      return newTemplates;
    });
  }, [selectedLanguageIds, languages, functionName, returnType, parameters, setTemplates]);

  // Update signatures when function definition changes
  useEffect(() => {
    setTemplates((prev) => {
      const newTemplates = { ...prev } as ProblemTemplate;
      selectedLanguageIds.forEach((langId) => {
        const language = languages.find((l) => l.id === langId);
        if (language && newTemplates[langId]) {
          const languageKey = getLanguageKey(language.name);
          const newSignature = generateFunctionSignature(
            languageKey,
            functionName,
            returnType,
            parameters,
          );
          newTemplates[langId] = {
            ...newTemplates[langId],
            userFunctionSignature: newSignature,
          };
        }
      });
      return newTemplates;
    });
  }, [functionName, returnType, parameters, selectedLanguageIds, languages, setTemplates]);

  const addParameter = () => {
    const newId = Date.now().toString();
    setParameters((prev) => [
      ...prev,
      { id: newId, name: '', type: 'number', description: '' },
    ]);
  };

  const removeParameter = (id: string) => {
    setParameters((prev) => {
      if (prev.length > 1) return prev.filter((param) => param.id !== id);
      return prev;
    });
  };

  const updateParameter = (id: string, field: keyof Parameter, value: string) => {
    setParameters((prev) =>
      prev.map((param) => (param.id === id ? { ...param, [field]: value } : param)),
    );
  };

  const handleLanguageToggle = (languageId: number) => {
    setSelectedLanguageIds((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId],
    );
  };

  const updateTemplate = (
    languageId: number,
    field: keyof LanguageTemplate,
    value: string,
  ) => {
    setTemplates((prev) => ({
      ...prev,
      [languageId]: {
        ...prev[languageId],
        [field]: value,
      },
    }));
  };

  const selectedLanguages = languages.filter((lang) =>
    selectedLanguageIds.includes(lang.id),
  );

  return (
    <div className="space-y-6">
      {/* Basic Function Definition */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h2 className="mb-6 flex items-center text-xl font-bold text-gray-800">
          <Code className="mr-3 h-6 w-6 text-blue-600" />
          Function Definition
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Function Name *
            </label>
            <input
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="twoSum"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Return Type *
            </label>
            <select
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SUPPORTED_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Parameters</h3>
          <button
            type="button"
            onClick={addParameter}
            className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Parameter
          </button>
        </div>

        <div className="space-y-4">
          {parameters.map((param, index) => (
            <div key={param.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-700">Parameter {index + 1}</h4>
                {parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(param.id)}
                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="nums"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Type</label>
                  <select
                    value={param.type}
                    onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SUPPORTED_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                  <input
                    type="text"
                    value={param.description}
                    onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Array of integers"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Supported Languages</h3>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-gray-600">
            {selectedLanguageIds.length} selected
          </div>
        </div>

        {isLoadingLanguages ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
            Loading languages...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {languages.map((language) => (
              <label
                key={language.id}
                className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguageIds.includes(language.id)}
                  onChange={() => handleLanguageToggle(language.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {language.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Templates Section - Simple Input Boxes */}
      {selectedLanguages.length > 0 ? (
        <div className="rounded-xl border-2 border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-700">
              <FileText className="mr-2 h-5 w-5" />
              Language Templates
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({selectedLanguages.length} languages)
              </span>
            </h3>
          </div>

          {/* Language Template Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-6">
            {selectedLanguages.map((language) => (
              <button
                key={language.id}
                onClick={() =>
                  setActiveTemplateTab(
                    activeTemplateTab === language.id ? null : language.id,
                  )
                }
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTemplateTab === language.id
                    ? 'border-blue-500 bg-white text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>

          {/* Simple Template Editor */}
          {activeTemplateTab && templates[activeTemplateTab] ? (
            <div className="p-6">
              {(() => {
                const language = languages.find((l) => l.id === activeTemplateTab);
                const template = templates[activeTemplateTab];
                if (!language || !template) return null;

                return (
                  <div className="space-y-6">
                    <h4 className="mb-4 text-lg font-medium text-gray-700">
                      {language.name} Template Configuration
                    </h4>

                    {/* Function Signature Input Box */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Function Signature
                      </label>
                      <input
                        type="text"
                        value={template.userFunctionSignature}
                        onChange={(e) =>
                          updateTemplate(
                            activeTemplateTab,
                            'userFunctionSignature',
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., int* twoSum(int* nums, int numsSize, int target, int* returnSize)"
                        style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
                      />
                    </div>

                    {/* Template Code Box */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Template Code
                        <span className="ml-2 text-xs text-gray-500">
                          (Use {template.placeholder} as placeholder)
                        </span>
                      </label>
                      <textarea
                        value={template.templateCode}
                        onChange={(e) =>
                          updateTemplate(activeTemplateTab, 'templateCode', e.target.value)
                        }
                        className="h-64 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter template code for ${language.name}...

Example:
#include <stdio.h>
#include <stdlib.h>

${template.placeholder}

int main() {
    // Read input
    // Call function
    // Print result
    return 0;
}`}
                        style={{
                          fontFamily:
                            'Monaco, Consolas, "Lucida Console", monospace',
                          lineHeight: '1.4',
                        }}
                      />
                    </div>

                    {/* Placeholder Input */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={template.placeholder}
                        onChange={(e) =>
                          updateTemplate(activeTemplateTab, 'placeholder', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="USER_FUNCTION_PLACEHOLDER"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg">Click on a language tab above to edit its template</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-500">
          <Languages className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-lg">Select languages to create templates</p>
        </div>
      )}
    </div>
  );
};

export default FunctionDefinitionTab;


