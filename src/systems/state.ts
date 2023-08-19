const STATE_KEY = "monkey-bonacci";
export type Path = "sound" | "screen";

export const HeroPropType = {
	ID: 0,
	HP: 1,
	HP_MAX: 2,
	ATTACK: 3,
	DEFENSE: 4,
} as const;

export type State = {
	lastProcessedAt: number;
	sound: boolean | null;

	level: number;

	numbersChecked: number;
	numbersFound: number[];
	nextFibonacciNumber: number;
};

export const emptyState: State = {
	lastProcessedAt: Date.now(),
	sound: null,

	level: 0,

	numbersChecked: 0,
	numbersFound: [],
	nextFibonacciNumber: 0,
};

export let state: State;

let stateLoaded = false;
let autoSaveInterval: number;

export function initState() {
	loadState();

	autoSaveInterval = setInterval(saveState, 15000);
	globalThis.onbeforeunload = () => {
		saveState();
	};
}

export function resetState() {
	clearInterval(autoSaveInterval);
	globalThis.onbeforeunload = null;
	localStorage.removeItem(STATE_KEY);

	setTimeout(() => {
		globalThis.location.reload();
	}, 500);
}

function loadState() {
	const encodedState = localStorage.getItem(STATE_KEY);
	const decodedState = encodedState ? atob(encodedState) : "{}";
	const jsonState = JSON.parse(decodedState) as State | undefined;

	if (jsonState) {
		state = Object.assign({ ...emptyState }, jsonState);
	} else {
		state = { ...emptyState };
	}

	stateLoaded = true;
}

function saveState() {
	if (!stateLoaded) {
		return;
	}

	const jsonState = JSON.stringify(state);
	const encodedState = btoa(jsonState);
	localStorage.setItem(STATE_KEY, encodedState);
}
