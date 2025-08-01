import { Button } from "../common/button";
import { SearchInput } from "../common/search-input";

interface HeaderSearchProps {
  onSearch: (value: string) => void;
}

export function HeaderSearch({ onSearch }: HeaderSearchProps) {
  return (
    <div className="flex-1 flex justify-center max-w-3xl mx-auto">
      {/* Desktop Search */}
      <div className="hidden md:block w-full max-w-lg">
        <SearchInput onSearch={onSearch} className="w-full" />
      </div>
    </div>
  );
}
