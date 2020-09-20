const Router = require('express');
const SpeechToTextService = require('./services/SpeechToTextService');
const app = Router()
const port = 3000

app.use(Router.json());
app.get('/', SpeechToTextService.get);
app.post('/speech-to-text', SpeechToTextService.post);

app.listen(port, '0.0.0.0', () => {
  console.log(`started`);
});