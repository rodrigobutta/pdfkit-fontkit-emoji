// const utfInfo = require( 'utf-info' );
const fs = require('fs');
const GraphemeSplitter = require("grapheme-splitter");
const emojiUnicode = require("./emojiUnicode");

const REGEX_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const isCjk = (str) => REGEX_CJK.test(str);


module.exports = function magic(doc, text, x, y) {
    console.log('magic', text);
    // console.log('isCjk', isCjk(text));
    // console.log('🙈', emojiUnicode('🙈'));
    // console.log('🙅🏻‍♀️', emojiUnicode('🙅🏻‍♀️'));
    
    const fontSize = 25;
    const svgVerticalCorrection = 0;

    doc.fontSize(fontSize);

    let curX = x;
    let curY = y

    var splitter = new GraphemeSplitter();

    var graphemes = splitter.splitGraphemes(text);
    console.log('graphemes', graphemes);
    
    graphemes.map((c, ix) => {
        console.log('>>>>', c);        
        if(c.length>1){
            const emojiCode = emojiUnicode(c);
            const svgName = `emoji_u${emojiCode}.svg`;

            var data = fs.readFileSync(`./assets/svg/${svgName}`, 'utf8');

            const svgWidth = fontSize;
            const svgHeight = fontSize;
            doc.addSVG(data, curX, curY + svgHeight * svgVerticalCorrection, {width:svgWidth, height:svgHeight});

            curX += svgWidth;
            
        }
        else{

            if(isCjk(text)){
                doc.font('./fonts/NotoSerifCJKsc-hinted/NotoSerifCJKsc-Regular.otf')
            }
            else{
                doc.font('./fonts/proxima_ssv/ProximaNova-Regular.otf')
            }
            
            const blockW = doc.widthOfString(c);
            const blockH = doc.heightOfString(c);

            doc.text(c, curX, curY);

            curX += blockW;
            // curY += blockH;
        }


        
    });

    
};