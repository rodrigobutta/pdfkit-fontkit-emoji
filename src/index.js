var fs = require("fs");
var http = require("http");
var fontkit = require("fontkit");
const makeSvg = require("./makeSvg");
const makePdf = require("./makePdf");

async function handler(req, res) {

  await makePdf();

  // const font = fontkit.openSync("./fonts/birds_of_paradise.ttf");
  // const font = fontkit.openSync("./fonts/NotoColorEmoji.ttf");
  const font = fontkit.openSync("./fonts/NotoEmoji-Regular.ttf");
  await makeSvg(font, "Ro🙈👋🤚🖐✋🖖👌🤏✌️🤞🤟🤘🤙👈👉👆🖕");

  res.write(`
    <html>
      <body>
        ${fs.readFileSync("./text.svg", "utf-8")}
      </body>
    </html>
  `);
  res.end();
}

http.createServer(handler).listen(9090);
