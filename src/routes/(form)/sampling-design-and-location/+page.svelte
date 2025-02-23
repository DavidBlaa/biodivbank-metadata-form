<script lang="ts">
	import CustomToast from '$lib/components/CustomToast.svelte';
	import Question from '$lib/components/formControls/Question.svelte';
	import Section from '$lib/components/formControls/Section.svelte';
	import StepTitle from '$lib/components/formControls/StepTitle.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import InventoryProcess2 from '$lib/components/sampling-design/InventoryProcess2.svelte';
	import MethodType2 from '$lib/components/sampling-design/MethodType2.svelte';
	import SpecificCategory from '$lib/components/sampling-design/SpecificCategory.svelte';
	import RiverCrossSection from '$lib/components/sampling-design/RiverCrossSection.svelte';
	import RiverZone from '$lib/components/sampling-design/RiverZone.svelte';
	import StreamOrder from '$lib/components/sampling-design/StreamOrder.svelte';
	import TargetedAndExcludedTaxa from '$lib/components/sampling-design/TargetedAndExcludedTaxa.svelte';
	import UnderRepresented from '$lib/components/sampling-design/UnderRepresented.svelte';
	import VegetationLayer from '$lib/components/sampling-design/VegetationLayer.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { datasetOverview } from '$lib/stores/datasetOverview';
	import {
		EffortIdenticalEnum,
		multipleEventsEnum,
		samplingDesignAndLocationSchema
	} from '$lib/schemas/samplingDesignAndLocation';
	import { params } from '$lib/stores/paramsStore';
	import { samplingDesign } from '$lib/stores/samplingDesign';
	import { step } from '$lib/stores/steps';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { datasetIdStore, metadataStructureIdStore } from '$lib/stores/datasetStore';
	import { localDatasetsStore } from '$lib/stores/localDatasets';
	import { generalInformation } from '$lib/stores/generalInformation';
	import type { LocalDataset } from '$lib/types/schema';

	// $: console.log($params);
	console.log('********** SAMPLEDESIGN *************************************');

	console.log(
		'🚀 ~ 3:',
		$datasetIdStore,
		$metadataStructureIdStore,
		$generalInformation,
		$datasetOverview,
		$samplingDesign
	);
	console.log('************************************************************');

	console.log($samplingDesign);

	let multipleEventsInputs = [
		{ label: 'Multiple locations', value: 'Multiple locations' },
		{ label: 'Multiple time points', value: 'Multiple time points' },
		{ label: 'No', value: 'No' }
	];

	onMount(() => {
		step.set(3);

		return () => {
			const result = samplingDesignAndLocationSchema.safeParse($samplingDesign);
			console.log('🚀 ~ return ~ result:', result);
			if (!result.success) {
				toast(CustomToast, {
					// @ts-ignore
					step: 'Dataset overview',
					// @ts-ignore
					incompleteIssues: result.error.errors,
					position: 'bottom-center',
					duration: 10000,
					className: 'w-1/2'
				});
				return;
			}
		};
	});

	samplingDesign.subscribe((value) => {
		if (localStorage) {
			localDatasetsStore.update((current) => {
				if (!current) {
					return [];
				}
				const index = current.findIndex((d: LocalDataset) => d.id === $datasetIdStore);
				if (index === -1) {
					current.push({
						id: $datasetIdStore,
						metadataStructureId: $metadataStructureIdStore as number,
						generalInformation: $generalInformation,
						datasetOverview: $datasetOverview,
						samplingDesign: value
					});
				} else {
					current[index] = {
						id: $datasetIdStore,
						metadataStructureId: $metadataStructureIdStore as number,
						generalInformation: $generalInformation,
						datasetOverview: $datasetOverview,
						samplingDesign: value
					};
				}
				return current;
			});
		}
	});

	// $: {
	// 	if ($samplingDesign.inventory.stage1.includes('restrictedSearch')) {
	// 		selectedStep = 'Stage 2';
	// 	}
	// }

	const no = multipleEventsEnum.enum['No'];
</script>

<StepTitle title="Sampling design" />
<div class="space-y-32">
	<Section title="Study design">
		<Question
			question="Did the study involve more than one sampling event? (Select all that apply)"
			direction="column"
		>
			{#each multipleEventsInputs as { label, value }}
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						{value}
						bind:group={$samplingDesign.studyDesign.multipleEvents}
						name="multipleEvents"
						disabled={value !== no && $samplingDesign.studyDesign.multipleEvents.includes(no)}
					/>
					<span class="text-sm shrink-0">
						{label}&nbsp;
					</span>
				</label>
			{/each}
		</Question>
		{#if $samplingDesign.studyDesign.multipleEvents.length && !$samplingDesign.studyDesign.multipleEvents.includes(no)}
			<Question
				question="Did environmental characteristics (e.g. habitat types, disturbance types) or methods (e.g. devices or effort) vary across sampling events?"
				direction="column"
			>
				<!-- <b>not existing in zod schema: envCharacteristics</b> -->
				<Radio
					label="Identical"
					value="Identical"
					bind:group={$samplingDesign.studyDesign.envCharacteristics}
					name="envCharacteristics"
				/>
				<Radio
					label="Largely similar"
					value="Largely similar"
					bind:group={$samplingDesign.studyDesign.envCharacteristics}
					name="envCharacteristics"
				/>
				<Radio
					label="Variable"
					value="Variable"
					bind:group={$samplingDesign.studyDesign.envCharacteristics}
					name="envCharacteristics"
				/>
			</Question>
		{/if}
	</Section>

	<Section title="Methods">
		<div class="grid gap-40 col-span-2">
			<InventoryProcess2 />
			<MethodType2 />
		</div>
	</Section>

	<Section
		title="Sampling scope"
		description="If a specific checklist of target taxa was used in the survey, please upload it [here]."
	>
		<div class="grid gap-20 col-span-2">
			<div class="col-span-2 gap-8 grid"><TargetedAndExcludedTaxa /></div>
			<div class="col-span-2 gap-8 grid"><SpecificCategory /></div>
			<div class="col-span-2 gap-8 grid"><UnderRepresented /></div>
		</div>
	</Section>

	<Section title="Sampling effort">
		<Question question="Describe the intensity of sampling (i.e. effort)">
			<Textarea
				bind:value={$samplingDesign.samplingEffort.intensity}
				placeholder="E.g. 40 box traps, deployed at even spacings along 4 parallel 100 m transects placed 50 m apart, and visited at 6-hourly intervals over a 48 hour period.
E.g. Two people occupying a bird hide for a period of 8 hours and undertaking a 30-minute count of species within the 150 degree field of view every 2 hours.
E.g. A single baited camera trap station with motion sensor trigger, deployed for a period of 10 days and configured for detecting large fauna moving through a known traffic way."
				label=""
				rows={10}
			/>
		</Question>
		<Question question="Was sampling effort identical for all sampling events?" direction="column">
			<Radio
				label="Yes"
				value={EffortIdenticalEnum.enum['Yes']}
				bind:group={$samplingDesign.samplingEffort.effortIdentical}
				name="effortIdentical"
			/>
			<Radio
				label="No"
				value={EffortIdenticalEnum.enum['No']}
				bind:group={$samplingDesign.samplingEffort.effortIdentical}
				name="effortIdentical"
			/>
			<Radio
				label="Unsure"
				value={EffortIdenticalEnum.enum['Unsure']}
				bind:group={$samplingDesign.samplingEffort.effortIdentical}
				name="effortIdentical"
			/>
			<Radio
				label="Not applicable"
				addition="only 1 sampling event"
				value={EffortIdenticalEnum.enum['Not applicable (only 1 sampling event)']}
				bind:group={$samplingDesign.samplingEffort.effortIdentical}
				name="effortIdentical"
			/>
			{#if $samplingDesign.samplingEffort.effortIdentical === EffortIdenticalEnum.enum['No']}
				<Textarea
					bind:value={$samplingDesign.samplingEffort.description}
					class="col-start-1 col-span-2"
					placeholder="Please describe how effort varied between locations or at different points in time"
					label=""
					rows={6}
				/>
			{/if}
		</Question>
	</Section>

	{#if $datasetOverview.biome.core.freshWater.includes('Rivers and Streams') || $datasetOverview.realm.core.includes('Terrestrial') || $datasetOverview.realm.transitional.some( (realm) => realm
					.toLowerCase()
					.includes('terrestrial') ) || $samplingDesign.samplingLocation.riverCrossSection.type.includes('Riparian Zone')}
		<Section title="Sampling location">
			<div class="grid gap-32 col-span-2">
				<div class="grid gap-24">
					{#if $datasetOverview.biome.core.freshWater.includes('Rivers and Streams')}
						<div><RiverZone /></div>
						<div><StreamOrder /></div>
						<div><RiverCrossSection /></div>
					{/if}
				</div>

				<div>
					{#if $datasetOverview.realm.core.includes('Terrestrial') || $datasetOverview.realm.transitional.some( (realm) => realm
									.toLowerCase()
									.includes('terrestrial') ) || $samplingDesign.samplingLocation.riverCrossSection.type.includes('Riparian Zone')}
						<VegetationLayer />
					{/if}
				</div>
			</div>
		</Section>
	{/if}

	<Section
		title="Further information"
		description={[
			'For example, could another person re-run your field study, or fully interpret and reuse this dataset, without additional information? If not, please use the textbox to add further detail.',
			'Existing summaries from articles or reports are acceptable, provided their use does not violate copyright or any licence stated.'
		]}
	>
		<Question
			question="Are there any details of your sampling methodology that have not been captured by this form?"
		>
			<Textarea
				bind:value={$samplingDesign.furtherInformation.details}
				placeholder="Describe any aspect of the study design, scheduling or spatial distribution of sampling, methodology or equipment used, pre-processing of raw data, environmental conditions during a survey or unforeseen events, that are not covered by this metadata form. Be as specific as possible."
				label=""
				rows={10}
			/>
		</Question>
	</Section>
</div>
