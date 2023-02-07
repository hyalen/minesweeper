import { GridCell, State, GameStatus, ActionTypes, Action } from "./types";

/** the number of mines is static. But since it gets more difficult as the grid size grows,
 *  then the number of mines increases as well
 */
export const getMines = (rows: number, columns: number) => {
  const gridSize = rows * columns;

  /**
   * if (>= 6x6 && < 8x8)
   * else if (>= 8x8 && < 12x12)
   * else if (>=12x12 && < 16x16)
   * else >= 256
   */
  if (gridSize >= 36 && gridSize < 64) {
    return 6;
  } else if (gridSize >= 64 && gridSize < 144) {
    return 10;
  } else if (gridSize >= 144 && gridSize < 256) {
    return 30;
  }

  return 40;
};

/**
 * creates the UI grid attaching '#' as a non-visited cell
 * For a 3x3 grid for example, we'd have the following pattern:
  # # #
  # # #
  # # #
 */
const resetGrid = (rows: number, columns: number) => {
  const visitedGrid: GridCell[][] = [];

  // initializing the grids with empty values
  for (let i = 0; i < rows; i++) {
    visitedGrid[i] = [];

    for (let j = 0; j < columns; j++) {
      visitedGrid[i][j] = {
        value: "#",
        visited: false,
      };
    }
  }

  return visitedGrid;
};

export const setDefaultValues = (): State => {
  const rows = 6;
  const columns = 6;

  const grid = resetGrid(rows, columns);

  return {
    rows,
    columns,
    grid,
    gameStatus: GameStatus.Play,
    cellsLeft: rows * columns - getMines(rows, columns),
  };
};

export const MINIMUM_GRID_SIZE = 6;

/** we need to keep track of the grid sizes that's being set. It shouldn't accept
 *  empty or values out of bounds
 */
export const isGridSizeValid = (rows: number, columns: number) =>
  !isNaN(rows) &&
  !isNaN(columns) &&
  rows >= MINIMUM_GRID_SIZE &&
  columns >= MINIMUM_GRID_SIZE;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.SetGridSize: {
      const rows = action.key === "rows" ? action.payload : state.rows;
      const columns = action.key === "columns" ? action.payload : state.columns;

      // updating the grid with the new grid sizes
      const grid = resetGrid(rows, columns);

      return {
        ...state,
        grid: isGridSizeValid(rows, columns) ? grid : state.grid,
        gameStatus: GameStatus.Play,
        cellsLeft: rows * columns - getMines(rows, columns),
        [action.key]: action.payload,
      };
    }
    case ActionTypes.SetGrid: {
      return {
        ...state,
        grid: action.grid,
      };
    }
    case ActionTypes.SetGameStatus: {
      return {
        ...state,
        gameStatus: action.gameStatus,
      };
    }
    case ActionTypes.DecreaseCellsLeft: {
      return {
        ...state,
        cellsLeft: state.cellsLeft - 1,
      };
    }
    case ActionTypes.Reset: {
      return setDefaultValues();
    }
  }
};
