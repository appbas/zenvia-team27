const speech = require('@google-cloud/speech');
const fs = require('fs');

class SpeechToText {

  async post(req, res) {
    
    try {
      const client = new speech.SpeechClient();

      // console.log(req.body);
      const { bytes } = req.body;
      // const file = fs.readFileSync(audioFile);
      // const file = fs.readlinkSync(audioFile);
      // const audioBytes = file.toString('base64');

      // console.log(audioBytes);

      if (!bytes || bytes.trim().length == 0) {
        return res.status(400).json({
          result: 'Nenhum bytes informado',
        });
      }

      const audio = {
        content: bytes,
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

      const [response] = await client.recognize(request);

      const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
      
      return res.json({
        transcription,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro de interno.'
      });
    }

  }
}

module.exports = new SpeechToText();
