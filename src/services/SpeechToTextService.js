const speech = require("@google-cloud/speech");
const textToSpeech = require('@google-cloud/text-to-speech');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const download = function(url) {

  const fileName = uuidv4().concat('.ogg');

  const httpOrS = String(url).includes('https') ? https : http;

  return new Promise(
    function(resolve, reject) {
        var file = fs.createWriteStream(fileName);
        httpOrS.get(url, function(response) {
            response.pipe(file).on('finish', function() {
              file.close();
              resolve(fileName);
            });
          }).on('error', function(err) { // Handle errors
            fs.unlink(fileName); // Delete the file async. (But we don't check the result)
            reject(err);
          });
    }
  );

};

class SpeechToText {
  async post(req, res) {
    try {
      const client = new speech.SpeechClient();

      const { audioFile } = req.body;
      const fileLocal = await download( audioFile );
      const file = fs.readFileSync(fileLocal);
      const audioBytes = file.toString('base64');

      fs.unlinkSync(fileLocal);
      
      const audio = {
        content: audioBytes,
      };

      const config = {
        encoding: "OGG_OPUS",
        languageCode: "pt-BR",
        model: "default",
        enableAutomaticPunctuation: true,
        sampleRateHertz: 48000,
        enableWordTimeOffsets: false,
      };

      const request = {
        audio: audio,
        config: config,
      };

      const [response] = await client.recognize(request);

      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      console.log(`Transcription: ${transcription}`);


      return res.json({
        transcription,
      });


    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Erro de interno.",
      });
    }
  }

  async textToSpeech(req, res) {
    const { text } = req.body;

    if (!text || text.trim().length == 0) {
      return res.status(400).json({
        result: "Texto inválido",
      });
    }

    console.log(`Texto recebido: ${text}`);

    const client = new textToSpeech.TextToSpeechClient();

    const audioConfig = {
      audioEncoding: "OGG_OPUS",
      pitch: 0,
      speakingRate: 1,
    };

    const voice = {
      languageCode: "pt-BR",
      name: "pt-BR-Wavenet-A",
    };

    const input = {
      text,
    };

    const request = {
      audioConfig,
      voice,
      input,
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    res.setHeader("Content-disposition", "attachment; filename=output.ogg");
    res.setHeader("Content-type", "audio/ogg");
    res.write(response.audioContent, "binary");
    res.end();
  }

  async get(req, res) {
    return res.json({
      result: "Iniciado",
    });
  }

}

module.exports = new SpeechToText();
