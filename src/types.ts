export type GridCell = { value: string | number; visited: boolean };

export type State = {
  rows: number;
  columns: number;
  grid: GridCell[][];
  gameStatus: GameStatus;
  cellsLeft: number;
};

export enum GameStatus {
  Lose,
  Win,
  Play,
}

export enum ActionTypes {
  SetGridSize,
  SetGrid,
  SetGameStatus,
  DecreaseCellsLeft,
  Reset,
}

type SetGridSizeAction = {
  type: ActionTypes.SetGridSize;
  key: "rows" | "columns";
  payload: number;
};

type SetGridAction = {
  type: ActionTypes.SetGrid;
  grid: GridCell[][];
};

type SetGameStatusAction = {
  type: ActionTypes.SetGameStatus;
  gameStatus: GameStatus;
};

type ResetAction = {
  type: ActionTypes.Reset;
};

type SetCellsLeftAction = {
  type: ActionTypes.DecreaseCellsLeft;
};

export type Action =
  | SetGridSizeAction
  | SetGridAction
  | ResetAction
  | SetGameStatusAction
  | SetCellsLeftAction;
