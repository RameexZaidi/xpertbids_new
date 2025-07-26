export function flagEmoji(cc) {
  // cc is the ISO-2 code, e.g. "PK", "US", etc.
  return cc
    .toUpperCase()
    .split('')
    .map(char => {
      // Regional Indicator Symbol Letter A starts at U+1F1E6
      return String.fromCodePoint(0x1F1E6 + (char.charCodeAt(0) - 65));
    })
    .join('');
}