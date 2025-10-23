import type { Parameter, LanguageTemplate, Example } from './problemCreate';

export interface ProblemConstraint {
  parameterName: string;
  type: string;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  _id?: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
  isSample: boolean;
}

export interface CreatedBy {
  fullName: string;
  email: string;
  userName: string;
  role: string;
}

export interface SubmissionStats {
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
}

export interface ProblemDetail {
  problemNumber: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  description: string;
  constraints: ProblemConstraint[];
  examples: ProblemExample[];
  hints: string[];
  companies: string[];
  isActive: boolean;
  functionName: string;
  returnType: string;
  parameters: Parameter[];
  supportedLanguages: number[];
  templates: Record<number, LanguageTemplate>;
  createdBy: CreatedBy;
  submissionStats: SubmissionStats;
}

export interface TestCase {
  id: string;
  problemId: string;
  inputs: Record<string, any>;
  expectedOutput: any;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestCasesResponse {
  success: boolean;
  message: string;
  data: {
    testCases: TestCase[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProblemDetailResponse {
  success: boolean;
  message: string;
  data: ProblemDetail;
}

export interface UpdateProblemPayload {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  constraints?: ProblemConstraint[];
  examples?: ProblemExample[];
  hints?: string[];
  companies?: string[];
  isActive?: boolean;
  functionName?: string;
  returnType?: string;
  parameters?: Parameter[];
  supportedLanguages?: number[];
  templates?: Record<number, LanguageTemplate>;
}

export interface CreateTestCasePayload {
  inputs: Record<string, any>;
  expectedOutput: any;
  isSample: boolean;
}

export interface UpdateTestCasePayload {
  inputs?: Record<string, any>;
  expectedOutput?: any;
  isSample?: boolean;
}