export interface Textbook {
  id: string;
  name: string;
  uri: string;
  extractedText: string;
  uploadedAt: Date;
}

export type RootStackParamList = {
  'Authpage/SignupScreen': undefined;
  'Authpage/LoginScreen': undefined;
  Classes: undefined;
  Profile: undefined;
  // Add other screens...
}; 
