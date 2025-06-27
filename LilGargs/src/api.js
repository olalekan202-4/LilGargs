// src/api.js
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

// Use the local proxy path.
const API_URL = "/api";

const API_KEY = "C4nmyPkkyOnevkolNVqhV0czP";

// Correct Project Name confirmed by support.
const PROJECT_NAME = "LilGargsOGs";

const PROJECT_CHAIN = "Solana";
const COLLECTION_ADDRESS = "FP2bGBGHWrW4w82hsSDGc5zNLQ83CvEmW2shGkttS7aZ";

/**
 * Fetches launchpad data for the project.
 * @returns {Promise<Object>} The launchpad data.
 */
export const fetchLaunchpadData = async () => {
  try {
    const response = await fetch(`${API_URL}/launchpad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        projectName: PROJECT_NAME,
        projectChain: PROJECT_CHAIN,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching launchpad data: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch launchpad data:", error);
    throw error;
  }
};

/**
 * Fetches all assets for the collection.
 * @returns {Promise<Array>} A list of NFTs in the collection.
 */
export const fetchCollectionAssets = async () => {
    try {
      const response = await fetch(`${API_URL}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          collectionAddress: COLLECTION_ADDRESS,
          chain: PROJECT_CHAIN,
          continuation: null,
          projectName: PROJECT_NAME,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching collection assets: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Raw response from /api/assets:", data); // For debugging
      
      return data.nfts || [];

    } catch (error) {
      console.error("Failed to fetch collection assets:", error);
      throw error;
    }
};

/**
 * Fetches assets owned by a specific user for the collection.
 * @param {string} userAddress The user's wallet address.
 * @returns {Promise<Array>} A list of NFTs owned by the user.
 */
export const fetchUserAssets = async (userAddress) => {
  if (!userAddress) return [];
  try {
    const response = await fetch(`${API_URL}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        userAddress: userAddress,
        contractAddress: COLLECTION_ADDRESS,
        projectName: PROJECT_NAME,
      }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching user assets: ${response.status} ${response.statusText} - ${errorText}`);
    }
     const data = await response.json();
     console.log("Raw response from /api/wallets:", data);

    // --- THIS IS THE CORRECTED LINE ---
    // The API response sends the NFT array in the 'tokens' property.
    return data.tokens || [];

  } catch (error) {
    console.error("Failed to fetch user assets:", error);
    throw error;
  }
};


/**
 * Initiates the minting process by getting a transaction from the backend.
 * @param {string} walletAddress The user's wallet address.
 * @param {number} mintCount The number of NFTs to mint.
 * @param {string} group The minting phase (e.g., 'pb', 'wl').
 * @returns {Promise<Object>} The transaction data from the API.
 */
export const getMintTransaction = async (walletAddress, mintCount, group = "pb") => {
    try {
        const response = await fetch(`${API_URL}/mint`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
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