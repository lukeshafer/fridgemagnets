import { writable, readable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

export const isPlayerDone = writable() as Writable<boolean>;

// export const cardBounds = readable(null, set => {
//   const card
// })
