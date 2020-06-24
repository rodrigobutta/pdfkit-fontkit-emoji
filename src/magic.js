

const REGEX_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const isCjk = (str) => REGEX_CJK.test(str);

module.exports = function magic(doc, text, x, y) {
    console.log('magic', text);
    console.log('isCjk', isCjk(text));
    
    if(isCjk(text)){
        doc.font('./fonts/NotoSerifCJKsc-hinted/NotoSerifCJKsc-Regular.otf')
    }
    else{
        
    }
    
    doc.fontSize(25)
    .text(text, x, y);

};