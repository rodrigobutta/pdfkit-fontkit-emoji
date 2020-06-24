var fs = require("fs");
var http = require("http");
var fontkit = require("fontkit");
const writeSvg = require("./getSvg");

async function handler(req, res) {
  // const font = fontkit.openSync("./src/birds_of_paradise.ttf");
  // const font = fontkit.openSync("./src/NotoColorEmoji.ttf");
  const font = fontkit.openSync("./src/NotoEmoji-Regular.ttf");
  await writeSvg(font, "Ro🙈👋🤚🖐✋🖖👌🤏✌️🤞🤟🤘🤙👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏🙌👐🤲🤝🙏✍️💅🤳💪🦾🦵🦿🦶👂🦻👃🧠🦷🦴👀👁👅👄💋🩸");

  res.write(`
    <html>
      <body>
        ${fs.readFileSync("./src/text.svg", "utf-8")}
      </body>
    </html>
  `);
  res.end();
}

http.createServer(handler).listen(9090);
