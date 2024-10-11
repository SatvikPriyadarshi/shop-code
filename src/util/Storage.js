import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import firebaseAppconfig from "./firebase-config"; 

const storage = getStorage(firebaseAppconfig); 

const uploadFile = async (file, path) => {
    const bucket = ref(storage, path);
    const snapshot = await uploadBytes(bucket, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}

export default uploadFile;
