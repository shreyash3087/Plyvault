import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMxv8nuvdFQJ7U14lkQyykW_-YtHIiJ1E",
  authDomain: "plyvault.firebaseapp.com",
  projectId: "plyvault",
  storageBucket: "plyvault.appspot.com",
  messagingSenderId: "1081149809025",
  appId: "1:1081149809025:web:b0c8433eb99b86c1764880",
  measurementId: "G-R3G39ZGKJY"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImageToFirebase = async (imageFile) => {
  try {
    const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }
};
