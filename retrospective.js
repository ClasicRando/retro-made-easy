import {
    doc, setDoc, addDoc, getDoc, getDocs, collection, query, where, limit, deleteDoc,
    getFirestore, onSnapshot, updateDoc, writeBatch, increment, arrayUnion, Firestore,
    FieldPath
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
