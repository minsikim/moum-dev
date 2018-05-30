// ********************************** //
// HANGUL JAMO                        //
// ********************************** //
const CHO = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
],
JUNG = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    'ㅣ'
],
JONG = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
    'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
    'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johap
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @returns {Number} decimal unicode number
 */
function johap(arrIn){
    let ret = 44032;
    let index1,index2,index3 = 0;
    if(typeof arrIn[0] == 'number'){
        index1 = arrIn[0];
        index2 = arrIn[1];
        index3 = arrIn[2];
    }else if(typeof arrIn[0] == 'string'){
        index1 = CHO.indexOf(arrIn[0]);
        index2 = JUNG.indexOf(arrIn[1]);
        index3 = JONG.indexOf(arrIn[2]);
    }
    ret += (21*28*index1)+(28*index2)+(index3);
    return ret;
}

/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johapChar
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @returns {String} hangul character as string
 */
function johapChar(arrIn){
    let charIndex = johap(arrIn);
    return String.fromCharCode(charIndex);
}

/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johapArr
 * @param  {Array} chosungArr - array of letter inside chosung
 * @param  {Array} jungsungArr - array of letter inside jungsung
 * @param  {Array} jongsungArr - array of letter inside jongsung
 * @returns {String} string of johaped characters
 */
function johapArr(chosungArr, jungsungArr, jongsungArr){
    let charString = ''
    if(chosungArr.length == 0 || chosungArr == undefined) chosungArr = [...CHO];
    if(jungsungArr.length == 0 || jungsungArr == undefined) jungsungArr = [...JUNG];
    if(jongsungArr.length == 0 || jongsungArr == undefined) jongsungArr = [...JONG];
    for(let i = 0; i < chosungArr.length; i++){
        for(let j = 0; j < jungsungArr.length; j++){
            for (let k = 0; k < jongsungArr.length; k++) {
                var choIndex = getLetterIndex(chosungArr[i],1);
                var jungIndex = getLetterIndex(jungsungArr[j],2);
                var jongIndex = getLetterIndex(jongsungArr[k],3);
                charString += johapChar([choIndex,jungIndex,jongIndex]);
            }
        }
    }
    return charString;
}
/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johapArr
 * @param  {Array} char - letter
 * @param  {Array} charPosition - 1/2/3 = chosung/jungsung/jongsung
 * @returns index of the letter by cho/jung/jongsung
 */
function getLetterIndex(char, charPosition){
    let letterIndex = 0;
    let positionArr = null;
    switch(charPosition){
        case 1: {
            positionArr = CHO;
            break;
        }case 2: {
            positionArr = JUNG;
            break;
        }case 3: {
            positionArr = JONG;
            break;
        }
    }
    letterIndex = positionArr.indexOf(char)
    return letterIndex;
}