import type { Parameter, LanguageTemplate } from '../types/problemCreate';
import type { Language } from '../types/problemCreate';

export const getLanguageKey = (languageName: string): string => {
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
  'boolean[]': {
    typescript: 'boolean[]',
    javascript: 'boolean[]',
    java: 'boolean[]',
    python: 'List[bool]',
    cpp: 'vector<bool>',
    c: 'int*',
    csharp: 'bool[]',
    go: '[]bool',
    rust: 'Vec<bool>',
    kotlin: 'BooleanArray',
    swift: '[Bool]',
    generic: 'bool[]',
  },
  'number[][]': {
    typescript: 'number[][]',
    javascript: 'number[][]',
    java: 'int[][]',
    python: 'List[List[int]]',
    cpp: 'vector<vector<int>>',
    c: 'int**',
    csharp: 'int[][]',
    go: '[][]int',
    rust: 'Vec<Vec<i32>>',
    kotlin: 'Array<IntArray>',
    swift: '[[Int]]',
    generic: 'int[][]',
  },
  'string[][]': {
    typescript: 'string[][]',
    javascript: 'string[][]',
    java: 'String[][]',
    python: 'List[List[str]]',
    cpp: 'vector<vector<string>>',
    c: 'char***',
    csharp: 'string[][]',
    go: '[][]string',
    rust: 'Vec<Vec<String>>',
    kotlin: 'Array<Array<String>>',
    swift: '[[String]]',
    generic: 'string[][]',
  },
};

export const generateFunctionSignature = (
  languageKey: string,
  funcName: string,
  retType: string,
  params: Parameter[],
): string => {
  if (!funcName || params.some((p) => !p.name || !p.type)) return '';

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

export const generateDefaultTemplate = (
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
