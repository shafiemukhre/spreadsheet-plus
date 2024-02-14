import "./App.scss";
import Spreadsheet from "@components/Spreadsheet/Spreadsheet";

function App() {
  return (
    <>
      <div className="title">
        <h1>spreadsheet+</h1>
        <p>a spreadsheet that can only do plus operation 🫠</p>
      </div>
      <Spreadsheet />
    </>
  );
}

export default App;
