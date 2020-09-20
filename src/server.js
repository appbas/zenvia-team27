const Router = require('express');
const SpeechToTextService = require('./services/SpeechToTextService');
const app = Router()
const port = process.env.PORT || 3000;

app.use(Router.json());
app.get('/', SpeechToTextService.get);
app.post('/speech-to-text', SpeechToTextService.post);
app.post('/text-to-speech', SpeechToTextService.textToSpeech);

app.listen(port, () => {
  console.log(`started`);
});