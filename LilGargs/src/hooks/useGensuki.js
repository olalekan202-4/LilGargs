// src/hooks/useGensuki.js
import { useState, useEffect, useCallback } from 'react';
import {
  fetchLaunchpadData,
  fetchCollectionAssets,
  fetchUserAssets,
} from '../api';

export const useGensuki = (userWalletAddress) => {
  const [launchpadInfo, setLaunchpadInfo] = useState(null);
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both the full collection and the user's owned NFTs
      const [launchpadData, collectionData] = await Promise.all([
        fetchLaunchpadData(),
        fetchCollectionAssets(),
      ]);
      
      setLaunchpadInfo(launchpadData);
      setCollectionNfts(collectionData);

      if (userWalletAddress) {
        const userData = await fetchUserAssets(userWalletAddress);

        // --- NEW DATA ENRICHMENT LOGIC ---
        // Create a map of the full collection data for easy and fast lookups.
        // We assume 'mintAddress' or a similar unique ID exists on both data sets.
        const collectionMap = new Map(collectionData.map(nft => [nft.mintAddress || nft.publicKey, nft]));

        // Map over the user's summarized NFT data and enrich it with details from the full collection.
        const hydratedUserData = userData.map(ownedNft => {
            const fullNftData = collectionMap.get(ownedNft.mintAddress || ownedNft.publicKey);
            
            if (fullNftData) {
                // If we find a match, merge the properties.
                // The full data from the collection (like description) will overwrite the missing fields.
                return { ...ownedNft, ...fullNftData };
            }
            // If no match is found for some reason, return the original data.
            return ownedNft;
        });

        setOwnedNfts(hydratedUserData);

      } else {
        setOwnedNfts([]);
      }

    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      console.error("Error loading Gensuki data:", err);
    } finally {
      setLoading(false);
    }
  }, [userWalletAddress]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = () => {
      loadData();
  }

  return { launchpadInfo, collectionNfts, ownedNfts, loading, error, refresh };
};