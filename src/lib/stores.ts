import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type DrawerPiece__SvelteComponent_ from './game-components/DrawerPiece.svelte';
import type { Client, Room } from 'colyseus.js';
import type { MyRoomState } from './schema/MyRoomState';
import { Player } from './schema/Player';

type pieceObj = {
	word: string;
	position: DOMRect | undefined;
};

// Single Round State
export const isPlayerDone = writable() as Writable<boolean>;
export const playedPieces = writable(new Map<number, pieceObj>());
export const movedCoords = writable(new Map<number, { x: number; y: number }>());
export const piecesInHand: DrawerPiece__SvelteComponent_[] = [];
export const card = writable() as Writable<HTMLDivElement>;

// Client Game State
export const client = writable() as Writable<Client>;
export const room = writable() as Writable<Room<MyRoomState>>;

// Player state
export const player = writable(new Player()) as Writable<Player>;

// Game state
export const gamePhase = writable('lobby') as Writable<string>;
