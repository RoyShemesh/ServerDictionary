import aws from 'aws-sdk';
import { ScanOutput } from 'aws-sdk/clients/dynamodb';
const REGION = 'eu-west-1';
const DynamoDBClient = new aws.DynamoDB.DocumentClient({ region: REGION });

export const getWord = async (word: string): Promise<aws.DynamoDB.ScanOutput> => {
	var params = {
		TableName: 'Dictionary',
		KeyConditionExpression: 'Word = :word ',
		ExpressionAttributeValues: {
			':word': word,
		},
	};
	const data: ScanOutput = await DynamoDBClient.query(params).promise();
	return data;
};

export const getWordByOnlyPos = async (pos: string): Promise<aws.DynamoDB.ScanOutput> => {
	const params = {
		TableName: 'Dictionary',
		FilterExpression: 'Pos = :pos',
		ExpressionAttributeValues: { ':pos': pos + '.' },
	};
	const data: ScanOutput = await DynamoDBClient.scan(params).promise();
	if (data.Count && data.Items) {
		const num = Math.floor(Math.random() * data.Count);
		return data.Items[num];
	}
	throw data;
};

export const getWordByPosAndLetter = async (
	pos: string,
	letter: string
): Promise<aws.DynamoDB.ScanOutput> => {
	const params = {
		TableName: 'Dictionary',
		ScanFilter: {
			Pos: {
				ComparisonOperator: 'EQ',
				AttributeValueList: [pos + '.'],
			},
			Word: {
				ComparisonOperator: 'BEGINS_WITH',
				AttributeValueList: [letter],
			},
		},
	};
	const data = await DynamoDBClient.scan(params).promise();
	if (data.Count && data.Items) {
		const num = Math.floor(Math.random() * data.Count);
		return data.Items[num];
	}
	throw data;
};

export const getWordByPos = async (word: string, pos: string): Promise<aws.DynamoDB.ScanOutput> => {
	const params = {
		TableName: 'Dictionary',
		KeyConditionExpression: 'Word = :word and Pos = :pos ',
		ExpressionAttributeValues: {
			':word': word,
			':pos': pos + '.',
		},
	};
	const data: ScanOutput = await DynamoDBClient.query(params).promise();
	return data;
};
