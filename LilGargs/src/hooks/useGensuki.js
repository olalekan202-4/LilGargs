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

      const [launchpadData, collectionData] = await Promise.all([
        fetchLaunchpadData(),
        fetchCollectionAssets(),
      ]);
      
      setLaunchpadInfo(launchpadData);
      setCollectionNfts(collectionData);

      if (userWalletAddress) {
        const userData = await fetchUserAssets(userWalletAddress);

        // --- UPDATED & CORRECTED DATA ENRICHMENT LOGIC ---

        // 1. Create a map of the full collection data, using its `mintAddress` as the key.
        const collectionMap = new Map(collectionData.map(nft => [nft.mintAddress, nft]));

        // 2. Map over the user's owned NFT data. For each owned NFT, use its `publicKey`
        //    to find the matching full-detail NFT from the collection map.
        const hydratedUserData = userData.map(ownedNft => {
            const fullNftData = collectionMap.get(ownedNft.publicKey); // Match ownedNft.publicKey with collectionMap's mintAddress
            
            if (fullNftData) {
                // If a match is found, merge the objects to add the missing description and other details.
                return { ...ownedNft, ...fullNftData };
            }
            // If no match is found, return the original data.
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