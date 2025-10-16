export interface LanguageApiMapEntry {
	name: string;
	extension: string;
}

export type LanguageApiMap = Record<string, LanguageApiMapEntry>;

export interface LanguageItem {
	id: number;
	name: string;
	extension: string;
}


