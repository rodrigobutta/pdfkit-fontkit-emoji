const fs = require('fs');
const GraphemeSplitter = require("./helpers/graphemeSplitter");
const emojiUnicode = require("./helpers/emojiUnicode");

const REGEX_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const isCjk = str => REGEX_CJK.test(str);

const REGEX_EMOJI = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;
const isEmoji = str => !str.replace(REGEX_EMOJI, '').length || str.length > 1; // The normal test regex would cycle between true and false TODO

const svgFileName = (input, maxBlocks = 4) => {
    const emojiCode = emojiUnicode(input).split(' ').map(val => parseInt(val).toString(16)).slice(0, maxBlocks).join('_');
    return `emoji_u${emojiCode}.svg`;
}

module.exports = function magic(doc, text, x, y) {
    console.log('magic', text);
    // console.log('🙈', emojiUnicode('🙈'));
    // console.log('🙅🏻‍♀️', emojiUnicode('🙅🏻‍♀️'));
    const splitter = new GraphemeSplitter();
    const fontSize = 25;
    const svgVerticalCorrection = 0;
    const svgWidth = fontSize;
    const svgHeight = fontSize;
    let curX = x;
    let curY = y

    const graphemes = splitter.splitGraphemes(text);
    // console.log('graphemes', graphemes);
    
    graphemes.map(c => {
       
        // TODO PUT TESTS!!!
        // console.log('>>>>', c, c.length);        
        // console.log('CODE', c.charCodeAt(0));        
        // console.log('isEmoji a', isEmoji('a'));
        // console.log('isEmoji space', isEmoji(' '));
        // console.log('isEmoji YES', isEmoji('🙈'));
        // console.log('isEmoji NO CJK', isEmoji('編'));
        // console.log('isEmoji', isEmoji(c));
        // console.log('isEmoji', isEmoji(c));
        // console.log('isEmoji', isEmoji(c));
        // console.log('isEmoji', isEmoji(c));
        
        if(isEmoji(c)){
            let blocks = 4;
            let found = false;
            while(blocks > 0 && found === false){
                const svgName = svgFileName(c, blocks);
                const svgPath = `./assets/svg/${svgName}`;
                // console.log('Looking for', svgPath);
                if (fs.existsSync(svgPath)) {
                    const data = fs.readFileSync(svgPath, 'utf8');
                    doc.addSVG(data, curX, curY + svgHeight * svgVerticalCorrection, {width:svgWidth, height:svgHeight});
                    curX += svgWidth;
                    found=true;
                }
                else{
                    blocks--;
                }
            }
            
            if(!found){
                console.log('No SVG found for ', c , '(', svgFileName(c, 4), ')');
            }

        }
        else{

            doc.fontSize(fontSize);

            if(isCjk(text)){
                doc.font('./fonts/NotoSerifCJKsc-hinted/NotoSerifCJKsc-Regular.otf')
            }
            else{
                doc.font('./fonts/proxima_ssv/ProximaNova-Regular.otf')
            }
            
            const blockW = doc.widthOfString(c);
            // const blockH = doc.heightOfString(c);

            doc.text(c, curX, curY);

            curX += blockW;
            // curY += blockH;
        }


        
    });

    
};