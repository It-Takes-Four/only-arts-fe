const formatNumber = (value: number) => {
		if (isNaN(value)) {
				return "0";
		}

		const absValue = Math.abs(value);
		if (absValue >= 1e6) {
				return `${(value / 1e6).toFixed(2)}M`;
		} else if (absValue >= 1e3) {
				return `${(value / 1e3).toFixed(2)}K`;
		} else {
				return value.toString();
		}
}