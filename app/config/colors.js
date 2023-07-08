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

export const primary = '#209ce3';
export const altPrimary = darkenColor(primary, 20)

export const secondary = '#008a45';
export const altSecondary = darkenColor(secondary, 20)

export const highlight = '#FF0000'; //red
export const white = '#ffffff';
export const black = '#000000';

export const background = white;
export const backgroundGray = '#b9b9b9';

export const green = '#5eff94';
export const yellow = '#ffea5d';
export const red = '#ff675d';

//keep a primary and seconday as first and second respoctively
export const linegraphColors = [
  primary,
  altSecondary,
]


//Calendar Colors
export const customActivityColor = '#fc8542';
export const customActivitySelectedColor = '#fc8542';
export const defaultActivityColor = '#b1b6af';
export const defaultActivitySelectedColor = '#b1b6af';
