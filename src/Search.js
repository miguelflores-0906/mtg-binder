import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

export default function Search() {
  const [cardSearch, setCardSearch] = useState('');
  const [cardPrints, setCardPrints] = useState([]);
  const [preferredPrinting, setPreferredPrinting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCardPrints = async (searchTerm) => {
    const cardName = searchTerm || cardSearch;
    if (!cardName) {
      setError('Enter a card name.');
      return;
    }
    setLoading(true);
    setError(null);
    setPreferredPrinting(null);
    setCardPrints([]);

    try {
      const response = await fetch(`https://api.scryfall.com/cards/search?unique=prints&q=!"${encodeURIComponent(cardName)}`);
      
      if (response.status == 404) {
        throw new Error('Card not found');
      }
      if (!response.ok) {
        throw new Error('Network error');
      }
      const data = await response.json();
      if (data.data.length === 0) {
        setError('No prints found for this card.');
      }

      setCardPrints(data.data);
      setPreferredPrinting(data.data[0]);
    }
    catch (err) {
      setError(`Error fetching card prints: ${err.message}`);
      console.error(err);
      setCardPrints([]);
      setPreferredPrinting(null);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardPrints();
  }, []);

  // limit the api calls to Scryfall
  const limitter  (func, delay) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  return (
    <div>
      <div>
        <h1>Add Cards to your binder</h1>
      </div>
    </div>
  );
}