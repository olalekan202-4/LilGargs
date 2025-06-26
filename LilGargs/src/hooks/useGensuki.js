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
        setOwnedNfts(userData);
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
