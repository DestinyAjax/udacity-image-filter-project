import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

	const app = express();
	const port = process.env.PORT || 8082;
  
	app.use(bodyParser.json());

	app.get('/', (req, res) => {
		res.send('Welcome to the cloud!');
	});

	app.get('/filteredimage', async (req: Request, res: Response) => {
		const queries = req.query;

		if (!queries.image_url) return res.status(400).send('Please provide a valid public accessible image url');

		const imageUrl = queries.image_url;
		const imageResponse = await filterImageFromURL(imageUrl);

		res.on('finish', async () => {
			await deleteLocalFiles([imageResponse]);
			const imageUrlTokens = imageResponse.split('/');
			const imagePrefix = imageUrlTokens[imageUrlTokens.length - 1];
			console.log(`File [.../${imagePrefix}] is successfully deleted from local dir`);
		});
		
		return res.status(200).sendFile(imageResponse);
	})

	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();