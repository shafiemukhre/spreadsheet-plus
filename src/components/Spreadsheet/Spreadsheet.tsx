import styles from "./Spreadsheet.module.scss";
import Cell from "@components/Cell/Cell";
import { useSpreadsheetStore } from "store";
import { LABELS } from "constants";

function Spreadsheet() {
  const spreadsheetData = useSpreadsheetStore((state) => state.spreadsheetData);

  return (
    <div className={styles.spreadsheet}>
      <table>
        <thead>
          <tr>
            <th></th>
            {LABELS.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spreadsheetData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowIndex + 1}</th>
              {row.map((cellData, colIndex) => (
                <Cell
                  key={colIndex}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  cellData={cellData}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Spreadsheet;
