import { MyRoomState } from "../schema/MyRoomState"

/**
 *  Resets player states after a round:
 * 	- Removes cards already played
 * 	- Deals replacement card
  */
export const resetPlayers = (state: MyRoomState) => {
	state.players.forEach((player) => {
		for (let i = 0; i < player.submission.length; i++) {
			let pieceToRemove = player.submission.pop();
			const pieceIndex = player.hand.findIndex((pieceInHand) => {
				return pieceInHand.id === pieceToRemove.id;
			});
			player.hand.splice(pieceIndex, 1);
			const card = state.deck.deal();
			if (card) {
				player.hand.push(card);
			}
		}
		player.status = 'editing';
	});
}
