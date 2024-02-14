# spreadsheet+

## Logistic

### Details

_Description of your solution and breakdown of interesting technical decisions made. Hints for how to find the interesting pieces of logic will be helpful for your reader_

Logic

1. The Spreadsheet.tsx is the main parent component. Using the initialSpreadsheetData a 2d array to create the UI of the spreadsheet table.
2. Each cell is a react component. Each cell has NumericString, FormulaString and the activeState (for the purpose of highlighting).
3. By default each cell will show the value using the span element, when user triple click, the the span element will be replaced with input element.
4. When user exit the input element (either by clicking outside the element or pressing enter), the function handleUpdateCell() will be called.
5. There are main 4 parts to the logic implemented in handleUpdateCell() function:
   - First, validate the string of the formula entered by the user.
   - Second, calculate the value of the formula.
   - Third, update only the current cell based on the formula.
   - Fourth, update the rest of the cell with formula that depends on this cell. This is where I would implement topological sort and handle circular reference.

Technical decisions:

- Implemented coding best practice throughout the implementation such as using make sure all variable has defined types, extra some logic out as a function so that multiple other function can re-use it and for readibility, and write comments.
- I used Zustand for global state management instead of useContext. This allow much cleaner implementation with less use of nested Provider.
- Instead of modifying the whole spreadsheetData state every single time whenever there's update, I utilize set and get from Zustand to allow more granular state update and therefore should have better performance.
- Update the spreadsheet using event listener and a simple function call instead of using `useEffect` to update spreadsheetData whenever spreadsheetData sate changes. Using `useEffect` somehow cause recursive call (since updating a state will trigger another another useEffect call) and slow the UI rendering.
- Co-location: Make sure each component is inside its own folder for co-location. Each component folder will it's individual tsx file, styling and its unit test file.
- Separation of concern: extra styling in a different file. SCSS module has better performance than styled-component. If I use styled-component, I will also extract styling to a different file. Alternatively, I like to use tailwindCSS as well.
- `@utils/validation.ts`: Implemented simplified validation to validate the input to make sure the input for the formula is only from "A1" to "O15", and the input for the cell must be only integers (both negative and positive) or else it will display "#ERROR!".
- Have an organized React folder structure, with separate global `store.ts`, `types.ts`, and `constants.ts` for reusability throughout multiple components/files.
- Configured `tsconfig.json` and `vite.config.json` to use absolute import path for much cleaner import statement.

### Enhancement

_What you would do if given additional time and the above mentioned limitations were removed? For additional features and enhancements, how would you implement them?_

- [] Use topological sort instead of double for loop for the function handleUpdateSpreadsheet(). This can improve the time complexity from O(V^2) to O(E+V).
- [] Handle circular reference, make sure to return an "#ERROR!" when there's a cycle.
- [] Add unit tests for the components.
- [] UI/UX enhancements
  - [] Double click to edit the cell (currently user have to do triple click to edit the cell).
  - [] Press Enter to edit cell.
  - [] Press delete to clear the cell.

### Dev Setup

_Instructions for how to execute your deliverable._

1. git clone and cd to the folder
2. `pnpm install`
3. `pnpm run dev`
4. Reproduce this demo. Triple click to edit the cell. Click outside of the cell or press enter to exit the exit the input viewer. ![demo](image.gif).

## Checklist

- [✔] The solution fulfills requirements. — Yes.
- [ ] The README answers all prompts. — Yes.
- [✔] Would you submit this for code review in a workplace setting given the scope constraints? — Yes, and only after I added the unit/integration tests and the topological sort.
- [✔] Is this something that you are proud of? — YES!
