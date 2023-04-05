import type { SamplingDesign } from '$lib/types/schema';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialStore: SamplingDesign = {
	vegetationLayer: [],
	riverZone: [],
	riverCrossSection: {
		bank: '',
		surface: '',
		riparianZone: false,
		water: false,
		bed: ''
	},
	furtherInformation: '',
	multipleEvents: [],
	envCharacteristics: '',
	inventory: {
		stage1: [],
		stage2: [],
		stage3: []
	},
	effortIdentical: ''
};

let storedValue: SamplingDesign;
if (browser) {
	storedValue = (JSON.parse(localStorage.getItem('samplingDesign') as string) ||
		initialStore) as SamplingDesign;
} else {
	storedValue = initialStore;
}

export const samplingDesign = writable<SamplingDesign>(storedValue);

samplingDesign.subscribe((value) => {
	if (browser) {
		localStorage.setItem('samplingDesign', JSON.stringify(value));
	}
});
