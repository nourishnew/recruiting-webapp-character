import { useEffect, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";

function CharacterSheet() {
	//state for current attribute increased, starts with 10 each = 60
	const [sum, setSum] = useState<number>(60);
	// maximum skill points , updated in useEffect
	const [skillSumMax, setSkillSumMax] = useState<number>(0);
	// current skill points used
	const [skillSum, setSkillSum] = useState<number>(0);
	//state for attributes
	const [attributeState, setAttributeStates] = useState(
		ATTRIBUTE_LIST.reduce((acc, item) => {
			acc[item] = 10;
			return acc;
		}, {})
	);
	//state for skills
	const [skillState, setSkillStates] = useState(
		SKILL_LIST.reduce((acc, skill) => {
			acc[skill.name] = 0;
			return acc;
		}, {})
	);
	//state for attribute modifiers
	const [attributeModifierState, setAttributeModifierState] = useState(
		ATTRIBUTE_LIST.reduce((acc, item) => {
			acc[item] = 0;
			return acc;
		}, {})
	);
	useEffect(() => {
		setSkillSumMax(10 + 4 * attributeModifierState["Intelligence"]);
	}, [attributeModifierState]);

	const calculateModifier = (value) => {
		return Math.floor((value - 10) / 2);
	};
	//state for showing red color if thresdold attribute is reached
	const [classStates, setClassStates] = useState(() => {
		const initialState = {};
		Object.keys(CLASS_LIST).forEach((className) => {
			initialState[className] = false;
		});
		return initialState;
    });
    
	//state to determine which class is clicked
	const [classRequirements, setClassRequirements] = useState("");

	//increment attribute, update modifier state, check if sum exceeds 70, check if each attribute threshold is exceeded,
	const incrementItemState = (item) => {
		if (sum >= 70) {
			alert("A character can have upto 70 delegated attribute points");
			return;
		}
		setSum((prevSum) => prevSum + 1);
		setAttributeStates((prevStates) => {
			const newModifier = calculateModifier(prevStates[item] + 1);
			if (item === "Intelligence") {
				setSkillSumMax(10 + 4 * newModifier);
			}
			setAttributeModifierState((prevModifierState) => ({
				...prevModifierState,
				[item]: newModifier,
			}));
			const updatedStates = {
				...prevStates,
				[item]: prevStates[item] + 1,
			};
			checkClassThresholds(updatedStates);

			return updatedStates;
		});
	};

	//decrement attribute, update modifier state, check if each attribute threshold is exceeded,
	const decrementItemState = (item) => {
		setSum((prevSum) => prevSum - 1);
		setAttributeStates((prevStates) => {
			const newModifier = calculateModifier(prevStates[item] - 1);
			setAttributeModifierState((prevModifierState) => ({
				...prevModifierState,
				[item]: newModifier,
			}));
			const updatedStates = {
				...prevStates,
				[item]: prevStates[item] - 1,
			};
			checkClassThresholds(updatedStates);

			return updatedStates;
		});
	};
	//increment skill state, check if total skill points exceeded,
	const incrementSkillState = (item) => {
		if (skillSum >= skillSumMax) {
			alert("You need more skill points. Upgrade intelligence to get more");
			return;
		}
		setSkillSum((prevSum) => prevSum + 1);

		setSkillStates((prevStates) => {
			const updatedStates = {
				...prevStates,
				[item]: prevStates[item] + 1,
			};
			return updatedStates;
		});
	};
	//decrement skill state
	const decrementSkillState = (item) => {
		setSkillSum((prevSum) => prevSum - 1);

		setSkillStates((prevStates) => {
			const updatedStates = {
				...prevStates,
				[item]: prevStates[item] - 1,
			};
			return updatedStates;
		});
	};

	//check if any class meet all its threshold requirements , update class state to show red color
	const checkClassThresholds = (updatedAttributeState) => {
		const updatedClassStates = { ...classStates };

		Object.keys(CLASS_LIST).forEach((className) => {
			const classThresholds = CLASS_LIST[className];

			const meetsThreshold = Object.entries(classThresholds).every(
				([attribute, threshold]) => {
					return updatedAttributeState[attribute] >= threshold;
				}
			);

			updatedClassStates[className] = meetsThreshold;
		});

		setClassStates(updatedClassStates);
	};

	return (
		<div className="App">
			<div className="App-character">
				<div className="App-attributes">
					<h1>Attributes</h1>
					{ATTRIBUTE_LIST.map((attribute) => (
						<div key={attribute} className="App-flex-row">
							<p>
								{attribute}:{attributeState[attribute]}(Modifier:
								{attributeModifierState[attribute]})
							</p>
							<button onClick={() => incrementItemState(attribute)}>+</button>
							<button onClick={() => decrementItemState(attribute)}>-</button>
						</div>
					))}
				</div>
				<div className="App-classes">
					<h1>Classes</h1>
					{Object.keys(CLASS_LIST).map((className) => (
						<p
							key={className}
							style={{
								color: classStates[className] === true ? "red" : "white",
								cursor: "pointer",
							}}
							onClick={() => setClassRequirements(className)}>
							{className}
						</p>
					))}
				</div>
				{classRequirements.length > 0 && (
					<div className="App-class-requirements">
						<button onClick={() => setClassRequirements("")}>Close</button>
						<h1>Class Requirements of {classRequirements}</h1>
						{Object.entries(CLASS_LIST[classRequirements]).map(
							([attribute, threshold]) => (
								<p key={attribute}>
									{attribute}: {threshold as number}
								</p>
							)
						)}
					</div>
				)}
				<div className="App-skills">
					<h1>Skills</h1>
					<p>
						Total skill points available: {skillSumMax - skillSum}
						{SKILL_LIST.map((skill) => (
							<div className="App-skill">
								<p key={skill.name}>
									{skill.name}: {skillState[skill.name]} (Modifier:
									{skill.attributeModifier}:{" "}
									{attributeModifierState[skill.attributeModifier]})
								</p>
								<button onClick={() => incrementSkillState(skill.name)}>
									+
								</button>
								<button onClick={() => decrementSkillState(skill.name)}>
									-
								</button>
								<p>
									total:{" "}
									{skillState[skill.name] +
										attributeModifierState[skill.attributeModifier]}
								</p>
							</div>
						))}
					</p>
				</div>
			</div>
		</div>
	);
}

export default CharacterSheet;
