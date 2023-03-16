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
