import { create } from "zustand";
import { CellData } from "types";
import { ROWS, COLS } from "constants";

type SpreadsheetStore = {
  spreadsheetData: {
    NumericString: string;
    FormulaString: string;
    isActive: boolean;
  }[][];
  setCellValue: (
    row: number,
    col: number,
    newValue: string,
    callback?: () => void
  ) => void;
  setCellFormula: (row: number, col: number, newFormula: string) => void;
  getCellValue: (row: number, col: number) => string;
  getCellFormula: (row: number, col: number) => string;
  prevActiveCell: { row: number; col: number };
  updateActiveCell: (newRow: number, newCol: number) => void;
  getIsActiveState: (row: number, col: number) => boolean;
};

let initialSpreadSheetData: CellData[][] = [];

for (let i = 0; i < ROWS; i++) {
  let row: CellData[] = [];
  for (let j = 0; j < COLS; j++) {
    row.push({ NumericString: "", FormulaString: "", isActive: false });
  }
  initialSpreadSheetData.push(row);
}

export const useSpreadsheetStore = create<SpreadsheetStore>((set, get) => ({
  spreadsheetData: initialSpreadSheetData,
  setCellValue: (row, col, newValue) => {
    set((state) => {
      // Create a deep copy of the current spreadsheet data using structuredClone
      const newSpreadsheetData = self.structuredClone(state.spreadsheetData);
      newSpreadsheetData[row][col].NumericString = newValue;
      return { spreadsheetData: newSpreadsheetData };
    });
  },
  setCellFormula: (row, col, newFormula) => {
    set((state) => {
      // Create a deep copy of the current spreadsheet data using structuredClone
      const newSpreadsheetData = self.structuredClone(state.spreadsheetData);
      newSpreadsheetData[row][col].FormulaString = newFormula;
      return { spreadsheetData: newSpreadsheetData };
    });
  },
  getCellValue: (row, col) => {
    return get().spreadsheetData[row][col].NumericString;
  },
  getCellFormula: (row, col) => {
    return get().spreadsheetData[row][col].FormulaString;
  },
  prevActiveCell: { row: -1, col: -1 },
  updateActiveCell: (newRow, newCol) => {
    set((state) => {
      const newSpreadsheetData = self.structuredClone(state.spreadsheetData);

      // set previous cell's isActive state to false
      const prevRow = get().prevActiveCell.row;
      const prevCol = get().prevActiveCell.col;
      if (prevRow !== -1 && prevCol !== -1) {
        newSpreadsheetData[prevRow][prevCol].isActive = false;
      }

      // set current cell's isActive state to true
      newSpreadsheetData[newRow][newCol].isActive = true;

      return { spreadsheetData: newSpreadsheetData };
    });
  },
  getIsActiveState: (row, col) => {
    return get().spreadsheetData[row][col].isActive;
  },
}));
