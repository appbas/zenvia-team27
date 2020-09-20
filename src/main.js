const speech = require('@google-cloud/speech');
const fs = require('fs');


async function main() {
  const client = new speech.SpeechClient();

  const filename = 'voice2.ogg';
  const file = fs.readFileSync(filename);
  const audioBytes = file.toString('base64');

  // console.log(audioBytes);

  const audio = {
    content: audioBytes,
  };

  const config = {
    "encoding":"OGG_OPUS",
      "sampleRateHertz": 16000,
      "languageCode": "pt-BR",
      "enableWordTimeOffsets": false
  };

  const request = {
    audio: audio,
    config: config,
  };

  const r = await client.recognize(request);
  console.log(r);
  const [response] = r;

  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  console.log(`Transcription: ${transcription}`);
}

main().catch(console.error);