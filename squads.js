import {
    doc, setDoc, addDoc, getDoc, getDocs, collection, query, where, limit, deleteDoc,
    getFirestore, onSnapshot, updateDoc, writeBatch, increment, arrayUnion, Firestore,
    FieldPath
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

export class Squad {
    /**
     * 
     * @param {string} id
     * @param {Array<{uid: string, display: string}>} members
     * @param {string} name
     */
    constructor(id, members, name) {
        /** @type {string} */
        this.id = id;
        /** @type {Array<{uid: string, display: string}>} */
        this.members = members;
        /** @type {string} */
        this.name = name;
    }
}

/**
 * 
 * @param {Firestore} db
 * @param {string} squadId
 * @param {string} squadName
 * @returns {Promise<Array<Squad>>}
 */
export async function getSquad(db, squadId, squadName) {
    try {
        const membersRef = collection(db, "squads", squadId, "members");
        const membersQuery = query(membersRef);
        const memberSnapshot = await getDocs(membersQuery);
        const members = memberSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {uid: doc.id, display: data.display};
        });
        return new Squad(squadId, members, squadName);
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

/**
 * 
 * @param {string} userId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getSquads(db, userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        const userSquads = userSnapshot.data().squads;

        const result = [];
        for (const squad of userSquads) {
            const squadsRef = doc(db, "squads", squad);
            const squadsSnapshot = await getDoc(squadsRef);
            result.push({
                id: squadsSnapshot.id,
                name: squadsSnapshot.get("name")
            });
        }
        return result;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

export class Success {
    constructor() {

    }
}

export class Issue {
    constructor() {
        
    }
}

export class ActionItem {
    constructor() {
        
    }
}

export class Retrospective {
    /**
     * 
     * @param {string} id
     * @param {Date} date
     * @param {boolean} isDone
     * @param {Array<Success>} successes
     * @param {Array<Issue>} issues
     * @param {Array<ActionItem>} actionItems
     */
    constructor(id, date, isDone, successes, issues, actionItems) {
        /** @type {string} */
        this.id = id;
        /** @type {Date} */
        this.date = date;
        /** @type {boolean} */
        this.isDone = isDone;
        /** @type {Array<Success>} */
        this.successes = successes || [];
        /** @type {Array<Issue>} */
        this.issues = issues || [];
        /** @type {Array<ActionItem>} */
        this.actionItems = actionItems || [];
    }
}

/**
 * 
 * @param {string} userId
 * @returns {Promise<Array<Retrospective>>}
 */
export async function getRetrospectives(db, squadId) {
    try {
        const retrospectivesRef = collection(db, "squads", squadId, "retrospectives");
        const retrospectivesQuery = query(retrospectivesRef);
        const querySnapshot = await getDocs(retrospectivesQuery);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return new Retrospective(
                doc.id,
                data.date.toDate(),
                data.isDone,
                data.successes,
                data.issues,
                data.actionItems
            );
        });
    } catch (ex) {
        console.error(ex);
        return [];
    }
}
