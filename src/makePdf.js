const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
var fs = require("fs");
const magic = require("./magic");

PDFDocument.prototype.addSVG = function(svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
};

module.exports = function makePdf() {
    console.log('makePDF');

    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('./output.pdf'));

    doc.font('./fonts/proxima_ssv/ProximaNova-Regular.otf')
    doc.text(' ',0,0); // NEEDED because doc without any text gives error on first svg print

    // magic(doc, 'Rodrigo Eduardo Butta', 0, 100);
    magic(doc, 'Some super emojis 🙈 merged🙅🏻‍♀️with🙅🏾‍♀text', 0, 150);
    // magic(doc, '🙈👋🤚🖐✋🖖👌🤏🤞🤟🤘🤙👈👉👆🖕', 0, 200);
    // magic(doc, '✋', 0, 250);
    
    // magic(doc, 'CJK Tests', 0, 300); // Occidental
    // magic(doc, '廣國理頭當油笑市上造史人去節信全就人前', 0, 350); // Chinese
    // magic(doc, '回編ム過得けフド庁62第1気わやお金盛かみ美株クケキニ可象ぴげりち両善ぐ安', 0, 400); // Japanese v1

    // doc.font('./fonts/NotoEmoji-Regular.ttf').text('🙈👋🤚🖐✋🖖👌🤏✌️🤞🤟🤘🤙👈👉👆🖕', 0, 500); // BW Emoji

    // doc.addPage()
    // .fillColor("blue")
    // .text('Here is a link!', 100, 100)
    // .underline(100, 100, 160, 27, {color: "#0000FF"})
    // .link(100, 100, 160, 27, 'http://google.com/');

    doc.end();

};