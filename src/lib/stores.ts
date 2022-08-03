import { writable, readable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import words from './data/wordlist.json';
import prompts from './data/promptList.json';
import type DrawerPiece__SvelteComponent_ from './DrawerPiece.svelte';

export const isPlayerDone = writable() as Writable<boolean>;

export const movedPieces = writable(new Map<number, string>());
export const movedCoords = writable(new Map<number, { x: number; y: number }>());

export const wordList = readable(words);
export const promptList = readable(prompts);

export const piecesInHand: DrawerPiece__SvelteComponent_[] = [];
