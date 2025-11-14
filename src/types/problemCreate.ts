export type SupportedScalar = 'number' | 'string' | 'boolean';
export type SupportedArray = 'number[]' | 'string[]' | 'boolean[]' | 'number[][]' | 'string[][]';
export type SupportedSpecial = 'TreeNode' | 'ListNode';
export type SupportedType = SupportedScalar | SupportedArray | SupportedSpecial;

export interface Parameter {
	id: string;
	name: string;
	type: SupportedType | string;
	description: string;
}

export interface ParameterValue {
	[key: string]: any;
}

export interface Example {
	id: string;
	inputs: ParameterValue;
	expectedOutput: any;
	explanation: string;
}

export interface TestCase {
	id: string;
	inputs: ParameterValue;
	expectedOutput: any;
	isSample: boolean;
}

export interface ElementConstraints {
	minValue?: number;
	maxValue?: number;
	minLength?: number;
	maxLength?: number;
}

export interface ParameterConstraint {
	parameterName: string;
	type: SupportedType | string;
	minValue?: number;
	maxValue?: number;
	minLength?: number;
	maxLength?: number;
	allowedChars?: string;
	arrayMinLength?: number;
	arrayMaxLength?: number;
	elementConstraints?: ElementConstraints;
}

export interface LanguageTemplate {
	userFunctionSignature: string;
	templateCode: string;
	placeholder: string;
}

export type ProblemTemplate = Record<number, LanguageTemplate>;

export interface Language {
	id: number;
	name: string;
	extension: string;
}


