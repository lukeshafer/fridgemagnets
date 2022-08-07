import { writable, readable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import words from './data/wordlist.json';
import prompts from './data/promptList.json';
import type DrawerPiece__SvelteComponent_ from './game-components/DrawerPiece.svelte';
import type { Client, Room } from 'colyseus.js';
import type { MyRoomState } from './schema/MyRoomState';
import { Player } from './schema/Player';

// Single Round State
export const isPlayerDone = writable() as Writable<boolean>;
export const movedPieces = writable(new Map<number, string>());
export const movedCoords = writable(new Map<number, { x: number; y: number }>());
export const piecesInHand: DrawerPiece__SvelteComponent_[] = [];

// Global Game State (will be moved to server)
export const wordList = readable(words);
export const promptList = readable(prompts);

// Client Game State
export const client = writable() as Writable<Client>;
export const room = writable() as Writable<Room<MyRoomState>>;

// Player state
export const player = writable(new Player()) as Writable<Player>;

// Game state
export const gamePhase = writable('lobby') as Writable<string>;
