const OpenAI = require("openai");
const openai = new OpenAI();

async function translate(text) {
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
}
module.exports = translate;
