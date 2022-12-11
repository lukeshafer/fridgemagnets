export const setCookie = (key: string, value: string, expDays = 0) => {
	const cookieString = `${key}=${value};`;

	if (document) {
		document.cookie = `${cookieString}; path=/;`;
	}
	return '';
};
