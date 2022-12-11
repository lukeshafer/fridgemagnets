const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateRoomIdSingle() {
	let result = '';
	for (let i = 0; i < 4; i++) {
		result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
	}
	return result;
}

// 1. Get room IDs already registered with the Presence API.
// 2. Generate room IDs until you generate one that is not already used.
// 3. Register the new room ID with the Presence API.
export async function generateRoomId(currentIds: string[]) {
	let id;
	do {
		id = generateRoomIdSingle();
	} while (currentIds.includes(id));
	return id;
}
