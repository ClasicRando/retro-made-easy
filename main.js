import * as bootstrap from "bootstrap"
// Import the functions you need from the SDKs you need
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInAnonymously
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
    doc, setDoc, addDoc, getDoc, getDocs, collection, query, where, limit, deleteDoc,
    getFirestore, onSnapshot, updateDoc, writeBatch, increment, arrayUnion
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBS4JkBiLizTvjH1vAn1YIINUsis8PS22U",
    authDomain: "retro-made-easy.firebaseapp.com",
    projectId: "retro-made-easy",
    storageBucket: "retro-made-easy.appspot.com",
    messagingSenderId: "744778453184",
    appId: "1:744778453184:web:e96bbb825e1503e3341d25",
    measurementId: "G-S5VQBEJKCF"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/** @type HtmlButtonElement */
const loginButton = document.getElementById("btnLogin");
/** @type HtmlButtonElement */
const signOutButton = document.getElementById("btnSignOut");
/** @type HtmlButtonElement */
const currentUserLabel = document.getElementById("txtCurrentUser");
/** @type {HTMLDivElement} */
const signInModalElement = document.getElementById("modSignIn");
const signInModal = new bootstrap.Modal(signInModalElement);
/** @type {HTMLFormElement} */
const signInForm = document.getElementById("formSignIn");
/** @type {HTMLButtonElement} */
const signInButton = document.getElementById("btnSignIn");
/** @type {HTMLSpanElement} */
const singInErrorLabel = document.getElementById("txtSignInError");

/**
 * 
 * @param {HTMLElement} element 
 */
function showElement(element) {
    element.classList.remove("d-none");
}

/**
 * 
 * @param {HTMLElement} element 
 */
function hideElement(element) {
    element.classList.add("d-none");
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserLabel.innerText = user.isAnonymous ? "Anonymous User" : user.email;
        showElement(currentUserLabel);
        showElement(signOutButton);
        hideElement(loginButton);
    } else {
        showElement(loginButton);
    }
});

signInButton.addEventListener("click", async () => {
    const formData = new FormData(signInForm);
    const email = formData.get("email").trim();
    const password = formData.get("password").trim();
    if (!email || !password) {
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        signInModal.hide();
    } catch (error) {
        singInErrorLabel.innerText = error.message;
        console.error(error);
    }
});
