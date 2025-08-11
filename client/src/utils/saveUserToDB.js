import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { adminEmail } from "../config/adminList";
import { ROUND_HALF_DOWN } from "bignumber.js";

export async function saveUserToDB(user) {
    try {
        const role = adminEmail.includes(user.email) ? "admin" : "user";

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email,
            photo: user.photoURL || "",
            provider: user.providerData[0]?.providerId || "email",
            role: role,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            shippingAddress: {
                fullName: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            },
            orders: [],
        }, {merge: true }); // merge so exisiting users get updated

        console.log("User saved/updated in Firestore:", user.email);
    }
    catch (error)
    {
        console.error("Error saving user", error);
    }
}