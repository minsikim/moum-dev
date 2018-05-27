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
    let index1 = CHO.indexOf(arrIn[0]);
    let index2 = JUNG.indexOf(arrIn[1]);
    let index3 = JONG.indexOf(arrIn[2]);
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
    for(let i = 0; i < chosungArr.length; i++){
        for(let j = 0; j < jungsungArr.length; j++){
            for (let k = 0; k < jongsungArr.length; k++) {
                
                charString += 
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
            break;
        }case 3: {
            break;
        }
    }
    positionArr.every((obj,idx,arr)=>{
        if(char == obj) {
            letterIndex = idx;
            return false;
        }else return true;
    })
    return letterIndex;
}