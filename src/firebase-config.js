import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAAOb8zoRIb0L97wSjlxiE_U-oTcFYCIkk",
  authDomain: "telangana-special.firebaseapp.com",
  projectId: "telangana-special",
  storageBucket: "telangana-special.firebasestorage.app",
  messagingSenderId: "772599525202",
  appId: "1:772599525202:web:d14ce4ca4a139c8385d48b",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
export const VAPID_KEY = "BBChwBVk1D7SsePpjS3bJbVTx_PzbIo64XzZf6SgIAn4pEmieAXi89WEDjAQ3AThAMcWWsqG1oia9FR26F9_BDQ";