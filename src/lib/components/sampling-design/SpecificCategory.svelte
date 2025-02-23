<script lang="ts">
	import TextInput from '../TextInput.svelte';
	import Select from '../Select.svelte';
	import Question from '../formControls/Question.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import CheckboxGroup from '../CheckboxGroup.svelte';
	import { samplingDesign } from '../../stores/samplingDesign';
	import CheckboxWithInput from './CheckboxWithInput.svelte';
	import Multistep from '../Multistep.svelte';
	import { CategoryEnum, CategoryKeys } from '$lib/schemas/samplingDesignAndLocation';
	import CheckboxGroupValue from '../CheckboxGroupValue.svelte';
	import { z } from 'zod';

	const mapping: { [key in z.infer<typeof CategoryEnum>]: z.infer<typeof CategoryKeys> } = {
		Sex: 'sex',
		'Life stage / age class': 'lifeStageAgeClass',
		'Reproductive condition': 'reproductiveCondition',
		'Growth form': 'growthForm',
		'Other category': 'other'
	};

	const placeholders = {
		sex: {
			targeted: 'E.g. female',
			excluded: 'E.g. male'
		},
		lifeStageAgeClass: {
			targeted: 'E.g. adult',
			excluded: 'E.g. larva, nestling, seedling'
		},
		reproductiveCondition: {
			targeted: 'E.g. frui-bearing',
			excluded: 'E.g. non-reproductive'
		},
		growthForm: {
			targeted: 'E.g. tree, shrub',
			excluded: 'E.g. sub-shrub'
		},
		other: {
			targeted: '',
			excluded: ''
		}
	};

	$: $samplingDesign.samplingScope.specificCategory.sex.selected =
		$samplingDesign.samplingScope.specificCategory.category.includes('Sex');
	$: $samplingDesign.samplingScope.specificCategory.lifeStageAgeClass.selected =
		$samplingDesign.samplingScope.specificCategory.category.includes('Life stage / age class');
	$: $samplingDesign.samplingScope.specificCategory.reproductiveCondition.selected =
		$samplingDesign.samplingScope.specificCategory.category.includes('Reproductive condition');
	$: $samplingDesign.samplingScope.specificCategory.growthForm.selected =
		$samplingDesign.samplingScope.specificCategory.category.includes('Growth form');
	$: $samplingDesign.samplingScope.specificCategory.other.selected =
		$samplingDesign.samplingScope.specificCategory.category.includes('Other category');
</script>

<!-- <Question
	question="Was a particular sex, age class or life stage, growth form, etc, specifically targeted for sampling? Were any groups intentionally excluded from sampling?"
	helpText="Multiple examples of a category can be entered in the textbox; separate the words or phrases using a comma."
	direction="column"
> -->

<div class="col-span-2">
	<Multistep
		question="Was a particular sex, age class or life stage, growth form, etc, specifically targeted for sampling? Were any groups intentionally excluded from sampling?"
		steps={2}
	>
		<div class="grid gap-8">
			<CheckboxGroupValue
				name="Category"
				bind:group={$samplingDesign.samplingScope.specificCategory.category}
				bind:other={$samplingDesign.samplingScope.specificCategory.other.category}
				otherKey="Other category"
				otherPlaceholder="Provide the name for your category"
				inputs={CategoryEnum.options}
			/>
		</div>

		<div slot="step-2" class="grid gap-16">
			{#if $samplingDesign.samplingScope.specificCategory.category.length > 0}
				<span class="text-description text-sm col-span-2"
					>Multiple examples of a category can be entered in the textbox; separate the words or
					phrases using a comma.</span
				>
			{/if}

			{#each $samplingDesign.samplingScope.specificCategory.category as category}
				<div class="grid gap-8 col-span-2">
					{#if category === 'Other category'}
						<h4 class="col-span-2 -mb-3">
							<span class="text-description">{category}:</span>
							<span class="font-medium"
								>{$samplingDesign.samplingScope.specificCategory.other.category}</span
							>
						</h4>
					{:else}
						<h4 class="col-span-2 font-medium -mb-3">
							{category}
						</h4>
					{/if}
					<TextInput
						bind:value={$samplingDesign.samplingScope.specificCategory[mapping[category]].targeted}
						label="Targeted"
						placeholder={placeholders[mapping[category]].targeted}
						class="col-span-2"
					/>
					<TextInput
						bind:value={$samplingDesign.samplingScope.specificCategory[mapping[category]].excluded}
						label="Excluded"
						placeholder={placeholders[mapping[category]].excluded}
						class="col-span-2"
					/>
				</div>
			{/each}
		</div>
	</Multistep>
</div>
