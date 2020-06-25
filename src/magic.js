const fs = require('fs');
const GraphemeSplitter = require("./helpers/graphemeSplitter");

const REGEX_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const isCjk = str => REGEX_CJK.test(str);

const REGEX_EMOJI = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;
const isEmoji = str => !str.replace(REGEX_EMOJI, '').length || str.length > 1; // The normal test regex would cycle between true and false TODO

/**
 * Get the unicode code points of an emoji in base 16.
 *
 * @function
 * @param {String} input The emoji character.
 * @returns {String} An array with the unicode code points.
 */
const emojiUnicode = input => {

    if (input.length === 1) {
        return input.charCodeAt(0).toString();
    }
    else if (input.length > 1) {
        const pairs = [];
        for (var i = 0; i < input.length; i++) {
            if (
                // high surrogate
                input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff
            ) {
                if (
                    input.charCodeAt(i + 1) >= 0xdc00 && input.charCodeAt(i + 1) <= 0xdfff
                ) {
                    // low surrogate
                    pairs.push(
                        (input.charCodeAt(i) - 0xd800) * 0x400
                    + (input.charCodeAt(i + 1) - 0xdc00) + 0x10000
                    );
                }
            } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
                // modifiers and joiners
                pairs.push(input.charCodeAt(i))
            }
        }
        return pairs.join(' ');
    }

    return '';
};

/**
 * Fork the asset filename using the char (complex) unicode code points and the noto-emoji raw format
 *
 * @function
 * @param {String} input The emoji character.
 * @param {Number} maxBlocks Some chars could have more than 4 combinated code points, so limit the result according to noto-emoji max of 4
 * @param {String} prefix The beginning of the filename, default for noto-emoji is emoji_
 * @param {String} divider The char/s to concatenate every code poin
 * @param {String} extension The default is svg
 * @returns {String} An string with the filename, including it extension
 */
const svgFileName = (input, maxBlocks = 4, prefix = 'emoji_', divider = '_', extension = 'svg') => {
    const emojiCode = emojiUnicode(input).split(' ').map(val => parseInt(val).toString(16)).slice(0, maxBlocks).join(divider);
    return `${prefix}u${emojiCode}.${extension}`;
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