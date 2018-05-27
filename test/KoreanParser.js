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
 * @returns decimal unicode number
 */
function johap(arrIn){
    var ret = 44032;
    var index1 = CHO.indexOf(arrIn[0]);
    var index2 = JUNG.indexOf(arrIn[1]);
    var index3 = JONG.indexOf(arrIn[2]);
    ret += (21*28*index1)+(28*index2)+(index3);
    return ret;
}

/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johapChar
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @returns decimal unicode number
 */
function johapChar(arrIn){
    var charIndex = johap(arrIn);
    return String.fromCharCode(charIndex);
}

/**
 * Calculate Unicode Hangul Johap from Hangul Jamo Unicode 
 * @function johapArr
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @param  {Array} arrIn - array with 3 unicode number fo hangul Jamo(Number)
 * @returns decimal unicode number
 */
function johapArr(chosungArr, jungsungArr, jongsungArr){

}