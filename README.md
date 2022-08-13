# Fridge Magnets

An online word game based on the amazing
[Ransom Notes](https://www.veryspecialgames.com/products/ransom-notes-the-ridiculous-word-magnet-game)

## Project Description

This is a monorepo which contains the full game code. This includes the:

- Game client (built with [SvelteKit](https://kit.svelte.dev))
- Game server (built with [Colyseus](https://colyseus.io))

**This project is still very much in an early development state, so please take that with caution!**

Last year, my wife bought the _Ransom Notes_ card game based on a very convincing ad. Unfortunately, we also have a lot of internet friends

## Plans

### Top priorities for a functional game:

- **Private rooms and room codes**
  - Right now, there is one join button which either joins an open room or creates a new one, meaning there are no private rooms.
- **Prompts**
  - I'm trying to avoid using Ransom Notes' prompts as they are covered under copyright. If you would like to contribute prompts, please keep that in mind!
- **More and better words**
- **Voting during the showcase round**
  - I'm thinking thumbs up and thumbs down
- **Scoring**
  - Requires voting to be implemented

### Secondary priorities

- **Animations and sounds**
  - The game works without these, but it would be much better with them!
- **Timers**
  - Everything depends on the host (whoever created the room) right now
- **Better Styling**
  - Definitely subjective - the current styling is _fine_. It just could be better imo!

### Low priorities

- Edit player name after join
- Alternate game modes
  - User-made prompts
  - Different prompt for each player
  - Quiplash-style head-to-head prompts
  - A drawing mode?
    - Players make a drawing or two, then they get split into pieces and distributed among players, who then combine pieces to respond to prompts
- Re-assign host manually (already happens automatically if host disconnects)

## Running your own game instance

_Not recommended unless you know what you're doing (at least until I get more features finalized!)_ :smile:

You can run your own instance by cloning this server, and running the following commands in the repo root:

```bash
pnpm run build
pnpm run start
```

This will serve the client and server on your local machine on ports 4723 and 2567, respectively.

_**PLEASE NOTE:** Right now, the client by default points to the public game server for Fridge Magnets. You will need to update the src/routes/index.svelte file manually if you want to run the server. This will be fixed in a future update_
