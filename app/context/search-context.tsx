import { createContext, useContext, useState } from 'react';

interface SearchContextProps {
  searchArtResults: any[];
  searchCollectionResults: any[];
  setSearchArtResults: (results: any[]) => void;
  setSearchCollectionResults: (results: any[]) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchArtResults, setSearchArtResults] = useState<any[]>([]);
  const [searchCollectionResults, setSearchCollectionResults] = useState<any[]>([]);

  return (
    <SearchContext.Provider value={{ searchArtResults, setSearchArtResults, searchCollectionResults, setSearchCollectionResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearchContext must be used within a SearchProvider');
  return context;
};
