export function useCollection(collectionId: string | undefined) {
	const [collection, setCollection] = useState<Collection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
}