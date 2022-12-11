export const getCookie = (key: string) => {
	const cookieString = document.cookie;
	const cookieArray = cookieString.split(';');
	for (const cookie of cookieArray) {
		const [checkKey, value] = cookie.split('=');
		if (checkKey === key) return value;
	}
	return '';
};
