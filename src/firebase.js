import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, update, get, remove } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyAna6t9OKbPQ96tM6GMsIs0-pwvDOJraFc",
  authDomain: "student-check-system-39d00.firebaseapp.com",
  databaseURL: "https://student-check-system-39d00-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "student-check-system-39d00",
  storageBucket: "student-check-system-39d00.firebasestorage.app",
  messagingSenderId: "282394062920",
  appId: "1:282394062920:web:3813e6f315262a0b33287d"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export const studentsRef = ref(db, 'students/')

export { db, ref, set, onValue, update, get, remove }
