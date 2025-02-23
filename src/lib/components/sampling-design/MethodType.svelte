<script lang="ts">
	import clsx from 'clsx';
	import Question from '../formControls/Question.svelte';
	import CheckboxGroup from '../CheckboxGroup.svelte';
	import { samplingDesign } from '$lib/stores/samplingDesign';
	import ArrowLeft from '$lib/icons/ArrowLeft.svelte';
	import ArrowRight from '$lib/icons/ArrowRight.svelte';

	let stage1Inputs = [
		{ label: 'Human / direct observation', value: 'human' },
		{ label: 'Machine observation', value: 'machineObservation' },
		{ label: 'Capture', value: 'capture' },
		{ label: 'Environmental sample', value: 'environmentalSample' },
		{ label: 'Physical evidence', value: 'physicalEvidence' }
	];

	let humanInputs = [
		{ label: 'Visual survey', value: 'visualSurvey' },
		{ label: 'Aural survey', value: 'auralSurvey' }
	];

	let machineObservationInputs = [
		{ label: 'Acoustic monitoring', value: 'acousticMonitoring' },
		{ label: 'Camera / video trap', value: 'cameraTrap' },
		{ label: 'Echolocation monitoring', value: 'echolocationMonitoring' },
		{ label: 'Radio tracking', value: 'radioTracking' },
		{ label: 'Passive integrated transponder (PIT) tracking', value: 'pit' },
		{ label: 'Aerial observation (drone, aeroplane)', value: 'aerialObservation' },
		{ label: 'Remotely operated underwater vehicle (ROV)', value: 'rov' },
		null,
		{ label: 'Chlorophyll fluorescence imaging', value: 'chlorophyllFluorescenceImaging' },
		{ label: 'LIDAR / photonic sensing', value: 'lidar' },
		{ label: 'RADAR', value: 'radar' },
		{ label: 'Thermal imaging', value: 'thermalImaging' }
	];

	let captureInputs = [
		{ label: 'Net', value: 'net' },
		{ label: 'Trap', value: 'trap' },
		{ label: 'Trawl', value: 'trawl' },
		{ label: 'Chemical irritant', value: 'chemicalIrritant' },
		{ label: 'Chemical knockdown', value: 'chemicalKnockdown' },
		{ label: 'Electrofishing', value: 'electrofishing' },
		{ label: 'Mark-recapture', value: 'markRecapture' }
	];

	let environmentalSampleInputs = [
		{ label: 'Corer', value: 'corer' },
		{ label: 'Grab', value: 'grab' },
		{ label: 'Tullgren funnel', value: 'tullgrenFunnel' },
		{ label: 'eDNA', value: 'edna' },
		{ label: 'Other', value: 'other' }
	];

	let physicalEvidenceInputs = [
		{ label: 'Burrow / nest', value: 'burrow' },
		{ label: 'Fur / hair', value: 'fur' },
		{ label: 'Pellet', value: 'pellet' },
		{ label: 'Scat', value: 'scat' },
		{ label: 'Tracks / other signs', value: 'tracks' },
		{ label: 'Other', value: 'other' }
	];

	let netInputs = [
		{ label: 'Aerial net', value: 'aerialNet' },
		{ label: 'Cannon net', value: 'cannonNet' },
		{ label: 'Kite net', value: 'kiteNet' },
		{ label: 'Mist net', value: 'mistNet' },
		{ label: 'Sweep net', value: 'sweepNet' },
		null,
		{ label: 'Bongo net', value: 'bongoNet' },
		{ label: 'Gill net', value: 'gillNet' },
		{ label: 'Kick net', value: 'kickNet' },
		{ label: 'Manta / Neuston net', value: 'mantaNet' },
		{ label: 'Plankton net', value: 'planktonNet' },
		{ label: 'Pond net', value: 'pondNet' },
		{ label: 'Pop-net trap', value: 'popNetTrap' },
		{ label: 'PRPOOS net / Soutar-Hemingway Animal Trap', value: 'prpoos' },
		{ label: 'Seine net', value: 'seineNet' }
	];

	let trapInputs = [
		{ label: 'Beating tray / drop cloth', value: 'beatingTray' },
		{ label: 'Bottle trap', value: 'bottleTrap' },
		{ label: 'Harp trap', value: 'harpTrap' },
		{ label: 'Light trap', value: 'lightTrap' },
		{ label: 'Longworth trap', value: 'longworthTrap' },
		{ label: 'Malaise trap', value: 'malaiseTrap' },
		{ label: 'Minnow trap', value: 'minnowTrap' },
		{ label: 'Lures (bait stations, pheromone trap, dung trap)', value: 'lures' },
		{ label: 'Pan trap', value: 'panTrap' },
		{ label: 'Pitfall trap', value: 'pitfallTrap' },
		{ label: 'Pooter', value: 'pooter' },
		{ label: 'Sticky trap', value: 'stickyTrap' },
		{ label: 'Suction trap / inverted leaf blower', value: 'suctionTrap' },
		{ label: 'Other', value: 'other' }
	];

	let trawlInputs = [
		{ label: 'Beam trawl', value: 'beamTrawl' },
		{ label: 'Bottom trawl', value: 'bottomTrawl' },
		{ label: 'Hand trawl', value: 'handTrawl' },
		{ label: 'Other', value: 'other' }
	];

	let chemicalIrritantInputs = [
		{ label: 'Mustard solution', value: 'mustardSolution' },
		{ label: 'Potassium permanganate solution', value: 'potassiumPermanganateSolution' },
		{ label: 'Other', value: 'other' }
	];

	let chemicalKnockdownInputs = [
		{ label: 'Methyl bromide', value: 'methylBromide' },
		{ label: 'Pyrethrin', value: 'pyrethrin' },
		{ label: 'Other', value: 'other' }
	];

	let markRecaptureInputs = [
		{ label: 'Branding', value: 'branding' },
		{ label: 'Elastomer', value: 'elastomer' },
		{ label: 'Mutilation', value: 'mutilation' },
		{ label: 'Paint', value: 'paint' },
		{ label: 'powder', value: 'Powder' },
		{ label: 'Tags', value: 'Tags' },
		{ label: 'Other', value: 'other' }
	];

	let steps = ['Stage 1', 'Stage 2', 'Stage 3'];
	let selectedStep = 'Stage 1';
</script>

<Question question="How were the data obtained? (Select all that apply)" direction="column">
	<div class="flex items-center gap-2 text-sm text-description col-span-full">
		<span
			on:click={() => {
				selectedStep = 'Stage 1';
			}}
			class={clsx(
				'cursor-pointer',
				selectedStep === 'Stage 1' ? 'text-description' : 'text-input-disabled'
			)}>Stage 1</span
		>
		<span>&gt;</span>
		<span
			on:click={() => {
				selectedStep = 'Stage 2';
			}}
			class={clsx(
				'cursor-pointer',
				selectedStep === 'Stage 2' ? 'text-description' : 'text-input-disabled'
			)}>Stage 2</span
		>
		<span>&gt;</span>
		<span
			on:click={() => {
				selectedStep = 'Stage 3';
			}}
			class={clsx(
				'cursor-pointer',
				selectedStep === 'Stage 3' ? 'text-description' : 'text-input-disabled'
			)}>Stage 3</span
		>
	</div>
	{#if selectedStep === 'Stage 1'}
		<CheckboxGroup
			bind:group={$samplingDesign.methodTypes.stage1}
			name="stage-1"
			inputs={stage1Inputs}
		/>
	{:else if selectedStep === 'Stage 2'}
		{#if $samplingDesign.methodTypes.stage1.includes('human')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Human / direct observation</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage2}
				name="stage-2"
				inputs={humanInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage1.includes('machineObservation')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Machine observation</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage2}
				name="stage-2"
				inputs={machineObservationInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage1.includes('capture')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Capture</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage2}
				name="stage-2"
				inputs={captureInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage1.includes('environmentalSample')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Environmental sample</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage2}
				name="stage-2"
				inputs={environmentalSampleInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage1.includes('physicalEvidence')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Physical evidence</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage2}
				name="stage-2"
				inputs={physicalEvidenceInputs}
			/>
		{/if}
		{#if !$samplingDesign.methodTypes.stage1.length}
			<p>No possible input</p>
		{/if}
	{:else if selectedStep === 'Stage 3'}
		{#if $samplingDesign.methodTypes.stage2.includes('net')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Net</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={netInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage2.includes('trap')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Trap</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={trapInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage2.includes('trawl')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Trawl</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={trawlInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage2.includes('chemicalIrritant')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Chemical irritant</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={chemicalIrritantInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage2.includes('chemicalKnockdown')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Chemical knockdown</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={chemicalKnockdownInputs}
			/>
		{/if}
		{#if $samplingDesign.methodTypes.stage2.includes('markRecapture')}
			<h3 class="col-span-2 text-sm text-min-contrast-gray">Mark-recapture</h3>
			<CheckboxGroup
				bind:group={$samplingDesign.methodTypes.stage3}
				name="stage-3-plot"
				inputs={markRecaptureInputs}
			/>
		{/if}
		{#if !$samplingDesign.methodTypes.stage2.length}
			<p>No possible input</p>
		{/if}
	{:else}
		<p>No possible input</p>
	{/if}
	<div class="col-start-1 flex items-center gap-3">
		{#if selectedStep !== 'Stage 1'}
			<button
				on:click={() => (selectedStep = steps[steps.findIndex((s) => s === selectedStep) - 1])}
				class="bg-secondary text-white py-1 px-3 rounded-md flex items-center gap-1"
			>
				<ArrowLeft classes="h-4 w-4" />
				Back
			</button>
		{/if}
		{#if selectedStep !== 'Stage 3'}
			<button
				on:click={() => (selectedStep = steps[steps.findIndex((s) => s === selectedStep) + 1])}
				class="bg-secondary text-white py-1 px-3 rounded-md flex items-center gap-1"
			>
				Next
				<ArrowRight classes="h-4 w-4" />
			</button>
		{/if}
	</div>
</Question>
