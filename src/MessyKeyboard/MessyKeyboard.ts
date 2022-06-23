let MessyKeyboard: any;

try {
  //@ts-ignore
  const Keyboard = require('react-native-ui-lib/keyboard');
  MessyKeyboard = Keyboard;
} catch {
  console.warn(
    'react-native-ui-lib/keyboard not found. Please install it to use this feature.'
  );
}

export default MessyKeyboard;
