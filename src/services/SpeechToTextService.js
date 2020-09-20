const speech = require("@google-cloud/speech");
const textToSpeech = require('@google-cloud/text-to-speech');

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
          result: "Nenhum bytes informado",
        });
      }

      const audio = {
        content: bytes,
      };

      const config = {
        encoding: "OGG_OPUS",
        sampleRateHertz: 16000,
        languageCode: "pt-BR",
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

      return res.json({
        transcription,
      });
    } catch (error) {
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
