import { useState } from "react";
import "./App.css";
import CharacterSheet from "./CharacterSheet";

function App() {
	const [numCharacters, setNumCharacters] = useState(1);

	return (
		<div className="App">
			<header className="App-header">
				<h1>React Coding Exercise</h1>
			</header>
			<section className="App-section">
				<div>
					<button onClick={() => setNumCharacters(numCharacters + 1)}>
						Add Character
					</button>
					Total Characters : {numCharacters}
				</div>
				{Array.from({ length: numCharacters }, (_, index) => (
					<CharacterSheet key={index} />
				))}
			</section>
		</div>
	);
}

export default App;
