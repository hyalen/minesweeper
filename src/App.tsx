import { useEffect, useMemo, useReducer } from "react";
import "./App.css";
import {
  getMines,
  isGridSizeValid,
  MINIMUM_GRID_SIZE,
  reducer,
  setDefaultValues,
} from "./store";
import { ActionTypes, GameStatus } from "./types";

function App() {
  const [state, dispatch] = useReducer(reducer, setDefaultValues());
  const { rows, columns, gameStatus, grid, cellsLeft } = state;

  useEffect(() => {
    if (cellsLeft === 0) {
      dispatch({
        type: ActionTypes.SetGameStatus,
        gameStatus: GameStatus.Win,
      });
    }
  }, [cellsLeft]);

  // original board with all of the values mapped
  const board = useMemo(() => {
    const board: string[][] | number[][] = [];
    const mines: number[][] = [];
    const numOfMines = getMines(rows, columns);

    if (isGridSizeValid(rows, columns)) {
      // initializing the grids with empty values
      for (let i = 0; i < rows; i++) {
        board[i] = [];

        for (let j = 0; j < columns; j++) {
          board[i][j] = 0;
        }
      }

      // inserting each mine in a random position
      for (let i = 0; i < numOfMines; i++) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * columns);

        if (board[row][col] !== "*") {
          board[row][col] = "*";
          mines.push([row, col]);
        } else {
          i--;
        }
      }

      // counting the number of mines adjacent to each cell
      for (let i = 0; i < mines.length; i++) {
        const row = mines[i][0];
        const col = mines[i][1];
        for (
          let r = Math.max(0, row - 1);
          r <= Math.min(row + 1, rows - 1);
          r++
        ) {
          for (
            let c = Math.max(0, col - 1);
            c <= Math.min(col + 1, columns - 1);
            c++
          ) {
            if (board[r][c] !== "*") {
              (board[r][c] as number)++;
            }
          }
        }
      }
    }

    return board;
  }, [rows, columns]);

  const revealCell = (row: number, col: number) => {
    const rowsLength = board.length;
    const columnsLength = board[0].length;
    const queue = [[row, col]];

    // the board that will be displayed into the UI
    const visited = [...grid];

    if (board[row][col] === "*") {
      visited[row][col] = {
        value: "*",
        visited: true,
      };
      dispatch({
        type: ActionTypes.SetGameStatus,
        gameStatus: GameStatus.Lose,
      });
    } else {
      while (queue.length > 0) {
        const queueEl = queue.shift();
        const queueRow = queueEl![0];
        const queueCol = queueEl![1];
        const item = visited[queueRow][queueCol];

        // if the cell clicked is a number greater than 0, it means that we have a mine adjacent to that cell
        // so we need to stop the execution and just updated the visited array with the current board value
        if (board[queueRow][queueCol] > 0) {
          dispatch({ type: ActionTypes.DecreaseCellsLeft });
          item.value = board[queueRow][queueCol];
          item.visited = true;
        } else {
          dispatch({ type: ActionTypes.DecreaseCellsLeft });
          item.value = 0;
          item.visited = true;

          // looping through all 8 adjacent directions
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              // i and j equals 0 are the user's click coordinates, so we'll skip that
              if (i === 0 && j === 0) {
                continue;
              }

              const r = queueRow + i;
              const c = queueCol + j;

              // if the cell is at the edges, skip the adjacent cells that are out of bounds
              if (r < 0 || r >= rowsLength || c < 0 || c >= columnsLength) {
                continue;
              }

              // if the adjacent cell was not visited yet, enqueue() then mark it as visited
              if (!visited[r][c].visited) {
                queue.push([r, c]);
                visited[r][c] = {
                  value: 0,
                  visited: true,
                };
              }
            }
          }
        }
      }
    }

    dispatch({ type: ActionTypes.SetGrid, grid: visited });
  };

  return (
    <>
      <div className="app">
        <div className="control">
          <div>
            <label htmlFor="numRows">Choose the number of rows:</label>
            <input
              type="number"
              id="numRows"
              value={rows}
              onChange={(evt) => {
                dispatch({
                  type: ActionTypes.SetGridSize,
                  key: "rows",
                  payload: parseInt(evt.target.value),
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="numCols">Choose the number of columns:</label>
            <input
              type="number"
              id="numCols"
              value={columns}
              disabled={columns >= 30}
              onChange={(evt) => {
                dispatch({
                  type: ActionTypes.SetGridSize,
                  key: "columns",
                  payload: parseInt(evt.target.value),
                });
              }}
            />
          </div>
        </div>
        <div className="reset-button">
          <button onClick={() => dispatch({ type: ActionTypes.Reset })}>
            Reset
          </button>
        </div>
        <p>Please provide a value equal or greater than {MINIMUM_GRID_SIZE}.</p>
        <div className="center">
          {grid.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  return (
                    <div
                      className={`cell ${cell.visited ? "visited" : ""}`}
                      key={rowIndex + colIndex}
                      onClick={() => {
                        if (gameStatus === GameStatus.Play && !cell.visited) {
                          revealCell(rowIndex, colIndex);
                        }
                      }}
                    >
                      {cell.value !== "#" ? cell.value : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="game-status">
        {gameStatus === GameStatus.Lose && (
          <p className="text-red">You lost. Try again 💣</p>
        )}
        {gameStatus === GameStatus.Win && (
          <p className="text-red">You won! Congratulations 😃</p>
        )}
      </div>
    </>
  );
}

export default App;
