// src/api.js
// --- API for Persistent Mining & Leaderboard ---
const PERSISTENT_API_URL = "https://lil-gargs.onrender.com";

export const getMiningData = async (walletAddress) => {
    try {
        const response = await fetch(`${PERSISTENT_API_URL}/api/mining?walletAddress=${walletAddress}`);
        if (response.status === 404) return null; // New user
        if (!response.ok) throw new Error('Failed to fetch user mining data.');
        return await response.json();
    } catch (error) {
        console.error("Error fetching mining data:", error);
        throw error;
    }
};

export const updateMiningData = async (walletAddress, miningBalance, miningRate) => {
    try {
        const response = await fetch(`${PERSISTENT_API_URL}/api/mining/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, miningBalance, miningRate }),
        });
        if (!response.ok) throw new Error('Failed to update user mining data.');
        return await response.json();
    } catch (error) {
        console.error("Error updating mining data:", error);
        throw error;
    }
};

export const getLeaderboardData = async () => {
    try {
        const response = await fetch(`${PERSISTENT_API_URL}/api/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard data.');
        const data = await response.json();
        return data.leaderboard || [];
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};


// --- API for Minting (Gensuki) ---
const GENSUKI_API_URL = "/api"; // Local proxy path
const GENSUKI_API_KEY = "C4nmyPkkyOnevkolNVqhV0czP";
const PROJECT_NAME = "LilGargsOGs";
const PROJECT_CHAIN = "Solana";
const COLLECTION_ADDRESS = "FP2bGBGHWrW4w82hsSDGc5zNLQ83CvEmW2shGkttS7aZ";

export const fetchLaunchpadData = async () => {
  try {
    const response = await fetch(`${GENSUKI_API_URL}/launchpad`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": GENSUKI_API_KEY },
      body: JSON.stringify({ projectName: PROJECT_NAME, projectChain: PROJECT_CHAIN }),
    });
    if (!response.ok) throw new Error(`Error fetching launchpad data: ${response.status}`);
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
        headers: { "Content-Type": "application/json", "x-api-key": GENSUKI_API_KEY },
        body: JSON.stringify({ collectionAddress: COLLECTION_ADDRESS, chain: PROJECT_CHAIN, projectName: PROJECT_NAME }),
      });
      if (!response.ok) throw new Error(`Error fetching collection assets: ${response.status}`);
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
      headers: { "Content-Type": "application/json", "x-api-key": GENSUKI_API_KEY },
      body: JSON.stringify({ userAddress, contractAddress: COLLECTION_ADDRESS, projectName: PROJECT_NAME }),
    });
    if (!response.ok) throw new Error(`Error fetching user assets: ${response.status}`);
    const data = await response.json();
    return data.tokens || [];
  } catch (error) {
    console.error("Failed to fetch user assets:", error);
    throw error;
  }
};

export const getMintTransaction = async (walletAddress, mintCount, group = "pb") => {
    try {
        const response = await fetch(`${GENSUKI_API_URL}/mint`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": GENSUKI_API_KEY },
            body: JSON.stringify({ group, walletAddress, projectName: PROJECT_NAME, projectChain: PROJECT_CHAIN, mintCount }),
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