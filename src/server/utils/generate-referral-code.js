const generateReferralCode = () => {
	const alphanumeric =
		"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const idLength = 10;
	let generatedCode = "";

	while (generatedCode.length < idLength) {
		generatedCode += alphanumeric.charAt(
			Math.floor(Math.random() * alphanumeric.length)
		);
	}

	return generatedCode;
};

export default generateReferralCode;
