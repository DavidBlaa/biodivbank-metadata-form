<script lang="ts">
	import { samplingDesign } from '$lib/stores/samplingDesign';
	import clsx from 'clsx';
	import Question from '../formControls/Question.svelte';
	import TextInput from '../TextInput.svelte';

	const vegetationLayers = [
		{ label: 'Tree layer', value: 'treeLayer', row: 'row-start-1' },
		{ label: 'Shrub layer', value: 'shrubLayer', row: 'row-start-3' },
		{ label: 'Herb layer', value: 'herbLayer', row: 'row-start-4' },
		{ label: 'Moss layer', value: 'mossLayer', row: 'row-start-5' },
		{ label: 'Ground layer', value: 'groundLayer', row: 'row-start-6' }
	];

	const otherOptions = [
		{ label: 'Did not sample in/on vegetation', value: 'noVegetation' },
		{ label: 'Unsure', value: 'unsure' },
		{ label: 'Other', value: 'other' }
	];
</script>

<Question
	title="Vegetation layer"
	question="Did sampling take place in/on vegetation, and if so in which layer? (Select all that apply)"
	direction="column"
>
	<div class="flex">
		<img src="/vegetation.svg" alt="" />
		<div class="w-full grid grid-rows-6">
			{#each vegetationLayers as layer}
				<div class={clsx('grid grid-cols-2 items-center gap-8', layer.row)}>
					<div class="h-px border border-dashed b-black flex-1" />
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							value={layer.value}
							bind:group={$samplingDesign.samplingLocation.vegetationLayer.layer}
							name="vegetationLayer"
						/>
						{layer.label}
					</label>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-8 col-span-1">
		{#each otherOptions as { label, value }}
			<label class="flex items-center gap-3">
				<input
					type="checkbox"
					{value}
					bind:group={$samplingDesign.samplingLocation.vegetationLayer.layer}
					name="vegetationLayer"
				/>
				{label}
			</label>
			{#if value === 'other'}
				<TextInput placeholder="Please tell us more..." label="" />
			{/if}
		{/each}
	</div>
</Question>
