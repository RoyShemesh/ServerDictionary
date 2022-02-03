import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {
	getWord,
	getWordByOnlyPos,
	getWordByPosAndLetter,
	getWordByPos,
} from './controllers/dictionaryController';
import { AttributeMap, ScanOutput } from 'aws-sdk/clients/dynamodb';
import { Word, WordWithoutDefention } from './utils/types';
const app = express();
app.use(express.json());
app.use(cors());
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/:word', async (req, res) => {
	try {
		const word = req.params.word;
		let data: ScanOutput = await getWord(word);
		let listOfWords: AttributeMap[] | undefined;
		if (data.Items?.length === 0) throw new Error('Word not found');
		if (data.Count !== undefined && data.Count > 1) {
			listOfWords = data.Items?.map((word) => {
				delete word['Definitions'];
				return word;
			});
		} else {
			listOfWords = data.Items;
		}
		res.send(data.Items);
	} catch (error) {
		console.log(error);
		res.status(404).send('Word not found');
	}
});

app.get('/part-of-speech/:part', async (req, res) => {
	try {
		const { letter } = req.query;
		const part = req.params.part;
		let data: ScanOutput;
		if (!letter) {
			data = await getWordByOnlyPos(part);
		} else {
			data = await getWordByPosAndLetter(part, letter as string);
		}
		res.send(data);
	} catch (error) {
		console.log(error);
		res.status(404).send('Part not exist');
	}
});

app.get('/:word/:pos', async (req, res) => {
	try {
		const { word, pos } = req.params;
		let data: ScanOutput = await getWordByPos(word, pos);
		if (data.Items?.length === 0) throw new Error('Word not found');
		res.send(data);
	} catch (error) {
		console.log(error);
		res.status(404).send('Word not found');
	}
});
export default app;
