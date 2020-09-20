const Router = require('express');
const SpeechToTextService = require('./services/SpeechToTextService');
const app = Router()
const port = process.env.PORT || 3000;

app.use(Router.json());
app.get('/', SpeechToTextService.get);
app.post('/speech-to-text', SpeechToTextService.post);

app.listen(port, () => {
  console.log(`started`);
});