var fs = require("fs");

module.exports = function makeSvg(font, text) {
  const sWidth = 800;
  const sHeight = 60;
  // height of canvas
  const height = 1200;

  const run = font.layout(text);
  const y = font.unitsPerEm;

  let aw = 0; // the total width of the canvas
  const svg = run.glyphs.map((g, i) => {
    g = `<g transform="translate(${aw},0)"><path d="${g.path.toSVG()}" fill="#ffb82b"/></g>`;
    aw += run.positions[i].xAdvance; // increases the overall canvas width letter by letter.

    return g;
  });

  return new Promise((resolve, reject) => {
    var stream = fs.createWriteStream("./text.svg");
    stream.on("close", resolve);
    stream.on("error", reject);

    stream.once("open", function(fd) {
      stream.write(
        `<svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="${sWidth}" 
          height="${sHeight}" 
          viewBox="0 0 ${aw} ${height}">
            <g transform="translate(0, ${y}) scale(1,-1)">
              ${svg.join("")}
            </g>
          </svg>`
      );
      stream.end();
    });
  });
};
