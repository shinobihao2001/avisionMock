const OpenAI = require("openai");
const openai = new OpenAI();
const v2 = require("@google-cloud/translate").v2;
require("dotenv").config();

translateClient = new v2.Translate({
  projectId: process.env.PROJECT_ID,
  key: process.env.API_KEY,
});

module.exports = {
  async translateChatGPT(text) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Dịch câu tiếng Anh sau đây thành tiếng Việt Nam: ${text}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log("Dịch xong");
      return completion.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }
  },

  async translateGoogle(text) {
    try {
      let [translations] = await translateClient.translate(text, "vi");
      // translations = Array.isArray(translations)
      //   ? translations
      //   : [translations];
      // console.log(typeof translations);
      //console.log("Translations:");
      //console.log(`Tiếng Việt :  ${translations}`);
      return translations.toString();
    } catch (error) {
      console.log(error);
    }
  },

  async translateHtmlGoogle(html) {
    try {
      let [translations] = await translateClient.translate(html, "vi");
      // translations = Array.isArray(translations)
      //   ? translations
      //   : [translations];
      // console.log(typeof translations);
      console.log(translations);
      //console.log("Translations:");
      //==console.log(`Tiếng Việt :  ${translations}`);
      return translations;
    } catch (error) {
      console.log(error);
    }
  },
};
