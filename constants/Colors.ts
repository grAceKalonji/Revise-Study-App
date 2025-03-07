const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';
const primaryColor = '#ffff';
const secondaryColor = '#000';

export default {
  primary: primaryColor,

  secondary: secondaryColor,
  
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
