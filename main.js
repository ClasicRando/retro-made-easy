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
let currentUser;

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
/** @type {HTMLDivElement} */
const cardGroup = document.getElementById("grpCardSection");
/** @type {HTMLHeadingElement} */
const cardGroupTitle = document.getElementById("txtCardGroupTitle");

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

/**
 * @param {string} entryName
 * @returns {HTMLDivElement}
 */
function newAddCard(entryName) {
    const column = document.createElement("div");
    column.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card", "border-dark", "h-100", "w-100");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-dark");

    const addIconSpan = document.createElement("div");
    addIconSpan.classList.add("w-100", "text-center");

    const addIcon = document.createElement("i");
    addIcon.classList.add("fa-solid", "fa-plus");
    addIconSpan.appendChild(addIcon);
    cardBody.appendChild(addIconSpan);

    const cardContent = document.createElement("p");
    cardContent.classList.add("card-text", "text-center");
    cardContent.innerText = entryName;
    cardBody.appendChild(cardContent);

    card.appendChild(cardBody);
    column.appendChild(card);
    return column;
}

/**
 * @param {string} title
 * @param {string} content
 * @returns {HTMLDivElement}
 */
function newCard(title, content) {
    const column = document.createElement("div");
    column.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card", "border-dark", "h-100", "w-100");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-dark");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = title;
    cardBody.appendChild(cardTitle);

    const cardContent = document.createElement("p");
    cardContent.classList.add("card-text");
    cardContent.innerText = content;
    cardBody.appendChild(cardContent);

    card.appendChild(cardBody);
    column.appendChild(card);
    return column;
}

/**
 * @param {HTMLElement} element
 */
function clearChildren(element) {
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}

class Squad {
    /**
     * 
     * @param {string} squadId
     * @param {Array<{name: string, uid: string?}>} members 
     * @param {string} name 
     * @param {string} owner 
     */
    constructor(squadId, members, name, owner) {
        /** @type {string} */
        this.squadId = squadId;
        /** @type {Array<{name: string, uid: string?}>} */
        this.members = members;
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.owner = owner;
    }
}

/**
 * 
 * @param {string} userId
 * @returns {Promise<Array<T>>}
 */
async function getSquads(userId) {
    try {
        const squadsRef = collection(db, "squads");
        const squadsQuery = query(squadsRef, where("owner", "==", userId));
        const querySnapshot = await getDocs(squadsQuery);
        return querySnapshot.docs.map((doc) => doc.data());
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        currentUserLabel.innerText = user.isAnonymous ? "Anonymous User" : user.email;
        showElement(currentUserLabel);
        showElement(signOutButton);
        showElement(cardGroup);
        cardGroupTitle.innerText = "Squads";
        clearChildren(cardGroup);

        const squads = await getSquads(currentUser.uid);
        for (const squad of squads) {
            const members = squad.members.map((m) => m.name).join(", ");
            cardGroup.appendChild(newCard(squad.name, members));
        }
        cardGroup.appendChild(newAddCard("Squad"));
        hideElement(loginButton);
    } else {
        currentUser = null;
        hideElement(currentUserLabel);
        hideElement(signOutButton);
        hideElement(cardGroup);
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
