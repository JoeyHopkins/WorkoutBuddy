// Helper function to darken a color
const darkenColor = (color, percent) => {
  color = color.slice(1);
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const darkenedR = Math.floor(r * (1 - percent / 100));
  const darkenedG = Math.floor(g * (1 - percent / 100));
  const darkenedB = Math.floor(b * (1 - percent / 100));
  const darkenedColor = `#${padDigits(darkenedR)}${padDigits(darkenedG)}${padDigits(darkenedB)}`;
  return darkenedColor;
};

// Function to pad a number with leading zeros if necessary
const padDigits = (number) => {
  return number.toString(16).padStart(2, '0');
};

//e91e63
//209ce3

export const primary = '#209ce3';
export const altPrimary = darkenColor(primary, 20)

export const highlight = '#FF0000'; //red
export const white = '#ffffff';

export const background = white;