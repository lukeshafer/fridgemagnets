import * as fs from 'fs';

export const POST = async ({ request }: { request: Request }) => {
	const data = await request.formData();
	const prompt = data.get('prompt');

	if (!prompt) {
		return {
			status: 400,
			body: {
				confirmation: 'Missing prompt'
			}
		};
	}

	// Append prompt to file and return confirmation
	// file is './prompts.json'
	fs.appendFile('./src/routes/submit/prompts.txt', `${prompt}\n`, (err) => {
		if (err) {
			return {
				status: 500,
				body: {
					confirmation: 'Error writing to file'
				}
			};
		}
	});

	const confirmation = 'Prompt submitted! Feel free to submit another.';

	return {
		status: 202,
		body: {
			confirmation
		}
	};
};
