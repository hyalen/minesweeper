# Minesweeper

Simple Mineswepper implementation. Made with React, TypeScript and bootstrapped with [ViteJS](https://vitejs.dev/).

## Getting Started

First, install the dependencies and run the development server:

```bash
yarn install
yarn dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) with your browser to see the result.

You can interact by changing the rows, columns and trying to win the game.

## State management architecture used

- As soon as the application starts, `setDefaultValues()` - `/src/store.ts`, is passed as an initial state for the `useReducer()` hook. Then it sets:

  - `rows` and `columns` (the grid size);
  - the `grid` that's shown at the UI;
  - `gameStatus` (that stores if the user won, lost or is currently playing the game)
  - `cellsLeft`, which decreases along the user's plays. If it reaches zero, with no mines found, then the user won the game. The calculation of this variable is: `rows * columns - number of mines`

- After each click, the `revealCell()` function is triggered. Then it uses a `queue()` data structure in order to keep track of the visited adjacent cells.

- If you click on a mine (represented by `*` in the UI), you lose the game.
