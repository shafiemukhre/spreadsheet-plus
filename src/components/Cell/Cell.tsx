import { useSpreadsheetStore } from "store";
import { useRef, useState } from "react";
import { isIntegerString, isFormulaValidated } from "@utils/validation";
import styles from "./Cell.module.scss";
import { ROWS, COLS } from "constants";

type CellProps = {
  rowIndex: number;
  colIndex: number;
  cellData: { NumericString: string; FormulaString: string };
};

function Cell({ rowIndex, colIndex, cellData }: CellProps) {
  // get states and actions from the store
  const setCellValue = useSpreadsheetStore((state) => state.setCellValue);
  const setCellFormula = useSpreadsheetStore((state) => state.setCellFormula);
  const getCellValue = useSpreadsheetStore((state) => state.getCellValue);
  const getCellFormula = useSpreadsheetStore((state) => state.getCellFormula);
  const prevActiveCell = useSpreadsheetStore((state) => state.prevActiveCell);
  const updateActiveCell = useSpreadsheetStore(
    (state) => state.updateActiveCell
  );
  const getIsActiveState = useSpreadsheetStore(
    (state) => state.getIsActiveState
  );

  // local states
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClickCell() {
    // set previous cell's isActive state to false
    // then update the current cell's isActive state to true
    updateActiveCell(rowIndex, colIndex);
    // store the coordinates of the current cell
    prevActiveCell.row = rowIndex;
    prevActiveCell.col = colIndex;
  }

  function handleDoubleClick() {
    setIsEditing(true);
  }

  function calculateValue(formula: string): string {
    const formulaArray: string[] = formula.substring(1).split("+");
    let sum: number = 0;

    formulaArray.forEach((cell) => {
      const colString: string = cell.charAt(0).toUpperCase(); // handle column with 1 char only
      const rowString: string = cell.substring(1); // handle row with >= 1 digits and 1 char column only

      const row: number = parseInt(rowString) - 1;
      const col: number = colString.charCodeAt(0) - 65;

      sum += parseInt(getCellValue(row, col));
    });

    return sum.toString();
  }

  function handleUpdateSpreadsheet(rowIndex: number, colIndex: number) {
    // update the rest of the cells that depend on the current cell
    // this doesn't handle circular references
    // O(n^2) worst-case time complexity, where is n is the number of nodes/vertices/cells
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const cellFormula = getCellFormula(i, j);
        if (
          cellFormula.startsWith("=") &&
          cellFormula.includes(
            String.fromCharCode(colIndex + 65) + (rowIndex + 1)
          )
        ) {
          const oldValue = getCellValue(i, j);
          const newValue = calculateValue(cellFormula);
          if (oldValue !== newValue) setCellValue(i, j, newValue);
        }
      }
    }
  }

  function handleUpdateCell(
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    const target = event.target as HTMLInputElement;

    // update only the current cell based on the formula
    let newValue: string;
    if (target.value.startsWith("=") && isFormulaValidated(target.value)) {
      newValue = calculateValue(target.value);
    } else if (isIntegerString(target.value)) {
      newValue = target.value;
    } else {
      newValue = "#ERROR!";
    }

    setCellValue(rowIndex, colIndex, newValue);

    // update the rest of the cells that depend on the current cell
    handleUpdateSpreadsheet(rowIndex, colIndex);

    setIsEditing(false);
  }

  return (
    <td
      key={colIndex}
      className={`${styles.cell} ${
        getIsActiveState(rowIndex, colIndex) ? styles.active : ""
      }`}
      onClick={handleClickCell}
      onDoubleClick={handleDoubleClick}
    >
      {!isEditing ? (
        <span>{cellData.NumericString}</span>
      ) : (
        <input
          type="text"
          ref={inputRef}
          value={getCellFormula(rowIndex, colIndex)}
          onChange={(e) => setCellFormula(rowIndex, colIndex, e.target.value)}
          onBlur={handleUpdateCell}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdateCell(e);
            }
          }}
          className={`${isEditing ? styles.editable : ""}`}
        />
      )}
    </td>
  );
}

export default Cell;
