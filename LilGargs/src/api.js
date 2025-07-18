// src/api.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

//FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyD6JRqQrEfp6FSvomocDgWUcknt8yWcL10",
  authDomain: "lilgargs-52cb8.firebaseapp.com",
  projectId: "lilgargs-52cb8",
  storageBucket: "lilgargs-52cb8.appspot.com",
  messagingSenderId: "764938969567",
  appId: "1:764938969567:web:e5c64b9a64dfa259d8246a",
  measurementId: "G-RLJCJTPSXD",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// --- END: FIREBASE CONFIGURATION ---

// --- API for Persistent Mining & Leaderboard using Firebase ---

export const getMiningData = async (walletAddress) => {
  try {
    const userDocRef = doc(db, "users", walletAddress);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // This is a new user
      return null;
    }
  } catch (error) {
    console.error("Error fetching mining data from Firebase:", error);
    throw error;
  }
};

export const updateMiningData = async (
  walletAddress,
  miningBalance,
  miningRate
) => {
  try {
    const userDocRef = doc(db, "users", walletAddress);
    const dataToSave = {
      walletAddress,
      miningBalance,
      miningRate,
      sessionStartTime: new Date().toISOString(), // Use current time as the last saved time
    };

    await setDoc(userDocRef, dataToSave, { merge: true });
    return { success: true, message: "Data saved to Firebase." };
  } catch (error) {
    console.error("Error updating mining data in Firebase:", error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("miningBalance", "desc"), limit(100));

    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    let rank = 1;
    querySnapshot.forEach((doc) => {
      leaderboard.push({
        rank: rank++,
        ...doc.data(),
      });
    });
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard from Firebase:", error);
    throw error;
  }
};

// --- API for Minting & NFT Data (Gensuki) ---
const GENSUKI_API_URL = "/api";
const GENSUKI_API_KEY = "C4nmyPkkyOnevkolNVqhV0czP";
const PROJECT_NAME = "LilGargsOGs";
const PROJECT_CHAIN = "Solana";
const COLLECTION_ADDRESS = "FP2bGBGHWrW4w82hsSDGc5zNLQ83CvEmW2shGkttS7aZ";

export const fetchLaunchpadData = async () => {
  try {
    const response = await fetch(`${GENSUKI_API_URL}/launchpad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GENSUKI_API_KEY,
      },
      body: JSON.stringify({
        projectName: PROJECT_NAME,
        projectChain: PROJECT_CHAIN,
      }),
    });
    if (!response.ok)
      throw new Error(`Error fetching launchpad data: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch launchpad data:", error);
    throw error;
  }
};

export const fetchCollectionAssets = async () => {
  try {
    const response = await fetch(`${GENSUKI_API_URL}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GENSUKI_API_KEY,
      },
      body: JSON.stringify({
        collectionAddress: COLLECTION_ADDRESS,
        chain: PROJECT_CHAIN,
        projectName: PROJECT_NAME,
      }),
    });
    if (!response.ok)
      throw new Error(`Error fetching collection assets: ${response.status}`);
    const data = await response.json();
    return data.nfts || [];
  } catch (error) {
    console.error("Failed to fetch collection assets:", error);
    throw error;
  }
};

export const fetchUserAssets = async (userAddress) => {
  if (!userAddress) return [];
  try {
    const response = await fetch(`${GENSUKI_API_URL}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GENSUKI_API_KEY,
      },
      body: JSON.stringify({
        userAddress,
        contractAddress: COLLECTION_ADDRESS,
        projectName: PROJECT_NAME,
      }),
    });
    if (!response.ok)
      throw new Error(`Error fetching user assets: ${response.status}`);
    const data = await response.json();
    return data.tokens || [];
  } catch (error) {
    console.error("Failed to fetch user assets:", error);
    throw error;
  }
};

export const getMintTransaction = async (
  walletAddress,
  mintCount,
  group = "pb"
) => {
  try {
    const response = await fetch(`${GENSUKI_API_URL}/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GENSUKI_API_KEY,
      },
      body: JSON.stringify({
        group,
        walletAddress,
        projectName: PROJECT_NAME,
        projectChain: PROJECT_CHAIN,
        mintCount,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get mint transaction");
    }
    return await response.json();
  } catch (error) {
    console.error("Mint API call failed:", error);
    throw error;
  }
};
