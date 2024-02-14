export function isIntegerString(str: string): boolean {
  // check if the first character is a minus sign and adjust the starting index accordingly
  const startIndex = str[0] === "-" ? 1 : 0;

  for (let i = startIndex; i < str.length; i++) {
    const asciiValue = str.charCodeAt(i);
    // check if the character is not a digit (ASCII values  48-57 for digits  0-9)
    if (
      (asciiValue < 48 || asciiValue > 57) &&
      !(i === 0 && asciiValue === 45)
    ) {
      return false;
    }
  }
  return true;
}

export function isFormulaValidated(formula: string): boolean {
  // check if the formula starts with an equals sign
  if (formula.charAt(0) !== "=") {
    return false;
  }

  // split the formula into operands by the plus sign
  const operands = formula.slice(1).split("+");

  // loop through each operand
  for (const operand of operands) {
    // remove whitespace from the operand
    const cleanedOperand = operand.trim();

    // check if the operand is a valid cell reference
    if (!isCellReferenceValid(cleanedOperand)) {
      return false;
    }
  }

  // all operands are valid, so the formula is valid
  return true;
}

function isCellReferenceValid(cellRef: string): boolean {
  // check if the cell reference is between  2 and  3 characters long
  if (cellRef.length < 2 || cellRef.length > 3) {
    return false;
  }

  // extract the column part of the cell reference
  const columnPart = cellRef.charAt(0).toUpperCase();

  // check if the column part is a valid letter from A to O
  if (
    columnPart.charCodeAt(0) < "A".charCodeAt(0) ||
    columnPart.charCodeAt(0) > "O".charCodeAt(0)
  ) {
    return false;
  }

  // extract the row part of the cell reference
  const rowPart = parseInt(cellRef.slice(1), 10);

  // check if the row part is a valid number from  1 to  15
  if (isNaN(rowPart) || rowPart < 1 || rowPart > 15) {
    return false;
  }

  // the cell reference is valid
  return true;
}
