import * as bootstrap from "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.esm.min.js"
// Import the functions you need from the SDKs you need
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getSquads, getRetrospectives } from "./squads.js"
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
let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};
/** @type */
const dateFormat = new Intl.DateTimeFormat("en-US", options);

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
 * @param {() => Promise<void>} create
 * @returns {HTMLDivElement}
 */
function newAddCard(create) {
    const column = document.createElement("div");
    column.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card", "border-dark", "h-100", "w-100", "text-center");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-dark");

    const addButton = document.createElement("button");
    addButton.classList.add("btn", "btn-primary");
    addButton.addEventListener("click", create);

    const addIcon = document.createElement("i");
    addIcon.classList.add("fa-solid", "fa-plus");
    addButton.appendChild(addIcon);
    cardBody.appendChild(addButton);

    card.appendChild(cardBody);
    column.appendChild(card);
    return column;
}

/**
 * @param {string} title
 * @param {string} content
 * @param {() => Promise<void> | null} enter
 * @returns {HTMLDivElement}
 */
function newCard(title, content, enter=undefined) {
    const column = document.createElement("div");
    column.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card", "border-dark", "h-100", "w-100", "text-center");

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

    if (enter) {
        const cardEnter = document.createElement("button");
        cardEnter.setAttribute("href", "#");
        cardEnter.classList.add("btn", "btn-primary");
        cardEnter.innerText = "Select";
        cardEnter.addEventListener("click", enter);
        cardBody.appendChild(cardEnter);
    }

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        currentUserLabel.innerText = user.isAnonymous ? "Anonymous User" : user.email;
        setCardView("Squads")

        const squads = await getSquads(db, currentUser.uid);
        for (const squad of squads) {
            cardGroup.appendChild(newCard(squad.name, "", async () => {
                await openSquad(squad.id, squad.name);
            }));
        }
        cardGroup.appendChild(newAddCard(async () => {
            console.log("Add squad");
        }));
    } else {
        currentUser = null;
        showLogin();
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

/**
 * 
 */
function showLogin() {
    hideElement(currentUserLabel);
    hideElement(signOutButton);
    hideElement(cardGroup);
    showElement(loginButton);
}

/**
 * 
 * @param {string} title 
 */
function setCardView(title) {
    showElement(currentUserLabel);
    showElement(signOutButton);
    showElement(cardGroup);
    cardGroupTitle.innerText = title;
    clearChildren(cardGroup);
    hideElement(loginButton);
}

/**
 * 
 * @param {string} squadId
 * @param {string} name
 */
async function openSquad(squadId, name) {
    setCardView(name);

    const retrospectives = await getRetrospectives(db, squadId);
    const needNew = retrospectives.findIndex(r => !r.isDone) == -1;
    for (const retro of retrospectives) {
        const content = retro.isDone ? "Done!" : "In progress";
        cardGroup.appendChild(newCard(dateFormat.format(retro.date), content));
    }
    if (needNew) {
        newAddCard(async () => console.log("create new retro"));
    }
}
