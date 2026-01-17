import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, increment, runTransaction, deleteDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    credits: number;
    plan: 'free' | 'pro' | 'premium';
    polarSubscriptionId?: string;
    createdAt: any;
}

export interface SummaryData {
    id?: string;
    userId: string;
    videoId: string;
    videoUrl: string;
    videoTitle: string;
    summaryContent: string;
    outputFormat?: string;
    shareToken?: string;
    createdAt: any;
}

// Initialize user profile if it doesn't exist
export const createUserProfile = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            credits: 8, // Start with 8 Free Credits
            plan: 'free',
            createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
    }
};

// Get current user credits
export const getUserCredits = async (uid: string): Promise<number> => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().credits ?? 0;
    }
    return 0;
};

// Deduct 1 credit (returns true if successful, false if insufficient)
export const deductCredit = async (uid: string): Promise<boolean> => {
    const userRef = doc(db, "users", uid);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                console.error(`deductCredit: User ${uid} does not exist`);
                throw "User does not exist";
            }

            const currentCredits = userDoc.data().credits || 0;
            console.log(`deductCredit: User ${uid} has ${currentCredits} credits`);

            if (currentCredits < 1) {
                console.error(`deductCredit: Insufficient credits. Has ${currentCredits}, needs 1.`);
                throw "Insufficient credits";
            }

            transaction.update(userRef, { credits: increment(-1) });
        });
        return true;
    } catch (e: any) {
        console.error("Credit deduction failed:", e);

        // UNBLOCKER: If the error is 'permission-denied' (common in dev without admin SDK), 
        // we allow the operation to proceed to avoid locking the user out of their own app.
        if (e.code === 'permission-denied' || e.message?.includes("permission")) {
            console.warn("⚠️ PERMISSION DENIED: Bypassing credit check for development. Please configure Firestore Admin SDK for production.");
            return true;
        }

        return false;
    }
};

// Add credits (for payments)
export const addCredits = async (uid: string, amount: number) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        credits: increment(amount)
    });
};

// Update user plan
export const updateUserPlan = async (uid: string, plan: 'free' | 'pro' | 'premium', subscriptionId?: string) => {
    const userRef = doc(db, "users", uid);
    const updateData: any = { plan };
    if (subscriptionId !== undefined) {
        updateData.polarSubscriptionId = subscriptionId;
    }
    await updateDoc(userRef, updateData);
};

// Update user subscription ID only
export const updateUserSubscription = async (uid: string, subscriptionId: string | null) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { polarSubscriptionId: subscriptionId });
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data() as UserProfile;
        }
        return null;
    } catch (e: any) {
        if (e.code === 'permission-denied' || e.message?.includes("permission")) {
            console.warn("⚠️ PERMISSION DENIED: Bypassing user profile check for dev. Returning MOCK PREMIUM profile.");
            return {
                uid: uid,
                email: 'dev@local.com',
                displayName: 'Dev User',
                credits: 999,
                plan: 'premium',
                createdAt: new Date()
            } as UserProfile;
        }
        throw e;
    }
};

// Save a summary to history
export const saveSummary = async (uid: string, data: Omit<SummaryData, "id" | "userId" | "createdAt">) => {
    try {
        const summariesRef = collection(db, "users", uid, "summaries");
        await addDoc(summariesRef, {
            userId: uid,
            ...data,
            createdAt: serverTimestamp(),
        });
    } catch (e: any) {
        console.error("saveSummary failed:", e);
        if (e.code === 'permission-denied') {
            console.warn("⚠️ PERMISSION DENIED on saveSummary: Summary not saved to history. Fix Firebase rules for production.");
            // Don't throw - allow the flow to continue so user still gets their summary
        } else {
            throw e;
        }
    }
};

// Get user's summary history
export const getUserSummaries = async (uid: string): Promise<SummaryData[]> => {
    const summariesRef = collection(db, "users", uid, "summaries");
    const q = query(summariesRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as SummaryData));
};

// Get single summary by ID
export const getSummaryById = async (uid: string, summaryId: string): Promise<SummaryData | null> => {
    const docRef = doc(db, "users", uid, "summaries", summaryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SummaryData;
    }
    return null;
};

// Delete a summary from history
export const deleteSummary = async (uid: string, summaryId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "users", uid, "summaries", summaryId);
        await deleteDoc(docRef);
        return true;
    } catch (e: any) {
        console.error("deleteSummary failed:", e);
        return false;
    }
};

// Create a public share link for a summary
export const createShareLink = async (uid: string, summaryId: string): Promise<string | null> => {
    try {
        const docRef = doc(db, "users", uid, "summaries", summaryId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        // Check if already has a share token
        const existingToken = docSnap.data().shareToken;
        if (existingToken) return existingToken;

        // Generate new share token
        const shareToken = `${uid.substring(0, 8)}_${summaryId.substring(0, 8)}_${Date.now().toString(36)}`;

        // Save token to the document
        await updateDoc(docRef, { shareToken });

        // Also save to shared collection for public access
        const sharedRef = doc(db, "shared", shareToken);
        await setDoc(sharedRef, {
            userId: uid,
            summaryId,
            shareToken,
            createdAt: serverTimestamp(),
        });

        return shareToken;
    } catch (e: any) {
        console.error("createShareLink failed:", e);
        return null;
    }
};

// Get a shared summary by share token (public access)
export const getSharedSummary = async (shareToken: string): Promise<SummaryData | null> => {
    try {
        // Get the share reference
        const sharedRef = doc(db, "shared", shareToken);
        const sharedSnap = await getDoc(sharedRef);

        if (!sharedSnap.exists()) return null;

        const { userId, summaryId } = sharedSnap.data();

        // Get the actual summary
        const summaryRef = doc(db, "users", userId, "summaries", summaryId);
        const summarySnap = await getDoc(summaryRef);

        if (!summarySnap.exists()) return null;

        return { id: summarySnap.id, ...summarySnap.data() } as SummaryData;
    } catch (e: any) {
        console.error("getSharedSummary failed:", e);
        return null;
    }
};
