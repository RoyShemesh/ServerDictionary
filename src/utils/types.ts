import { WorkDocs } from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';

export interface Word {
	word: string;
	pos: string;
	defentions: string[];
}

export type WordWithoutDefention = Omit<Word, 'defention'>;
