<script>
	import { samplingDesign } from '$lib/stores/samplingDesign';
	import Point from './Point.svelte';
</script>

<div>
	<h2 class="text-2xl font-medium mb-6">Sampling design</h2>
	<div class="space-y-12">
		<section>
			<h3 class="text-xl font-medium mb-4">Study design</h3>
			<div class="divide-y divide-placeholder divide-opacity-40 space-y-2">
				<Point
					label="Did the study involve more than one sampling event?"
					value={$samplingDesign.studyDesign.multipleEvents.join(', ')}
				/>
				{#if $samplingDesign.studyDesign.multipleEvents.length && !$samplingDesign.studyDesign.multipleEvents.includes('no')}
					<Point
						label="Did environmental characteristics (e.g. habitat types, disturbance types) or methods (e.g. devices or effort) vary across sampling events?"
						value={$samplingDesign.studyDesign.envCharacteristics}
					/>
				{/if}
			</div>
		</section>
		<section>
			<h3 class="text-xl font-medium mb-4">Methods</h3>
			<div class="divide-y divide-placeholder divide-opacity-40 space-y-2">
				<Point
					label="What type of inventory process was involved?"
					value={$samplingDesign.methods.inventoryProcess.stageOne.join(', ')}
				/>
				<Point
					label="How were the data obtained?"
					value={$samplingDesign.methods.methodType.stageOne.join(', ')}
				/>
			</div>
		</section>
		<section>
			<h3 class="text-xl font-medium mb-4">Sampling scope</h3>
			<div class="divide-y divide-placeholder divide-opacity-40 space-y-2">
				<Point
					label="Which taxa were the intended targets of the sample? Were any taxa intentionally excluded from sampling?"
					value={$samplingDesign.samplingScope.targetedTaxa}
				/>
				<div class="flex gap-72 [&:not(:first-child)]:pt-2">
					<h4 class="text-description w-52 shrink-0">
						Was a particular sex, age class or life stage, growth form, etc, specifically targeted
						for sampling? Were any groups intentionally excluded from sampling?
					</h4>
					<ul class="space-y-1">
						{#each $samplingDesign.samplingScope.specificCategory.category as category}
							<li>
								<p class="font-medium">
									{#if category === 'Other category'}
										{category}: {$samplingDesign.samplingScope.specificCategory.other.category}
									{:else}
										{category}
									{/if}
								</p>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<Point
				label="Are there taxa or other groups which may have been under-represented in the dataset, for example due to the timing or seasonality of sampling, or the precise methods used?"
				value={$samplingDesign.samplingScope.underRepresentedTaxa.map((t) => t.group).join(', ')}
			/>
		</section>
		<!-- <section>
			<h3 class="text-xl font-medium mb-4">Sampling effort</h3>
			<div class="divide-y divide-placeholder divide-opacity-40 space-y-2">
				<Point label="Describe the intensity of sampling" value={$samplingDesign.effortIntensity} />
				<Point
					label="Was sampling effort identical for all sampling events?"
					value={$samplingDesign.effortIdentical}
				/>
				{#if $samplingDesign.effortIdentical === 'no'}
					<Point
						label="How did sampling effort vary across sampling events?"
						value={$samplingDesign.effortVariation}
					/>
				{/if}
			</div>
		</section> -->
		<section>
			<h3 class="text-xl font-medium mb-4">Further information</h3>
			<div class="divide-y divide-placeholder divide-opacity-40 space-y-2">
				<Point
					label="Are there any details of your sampling methodology that have not been captured by this form?"
					value={$samplingDesign.furtherInformation.details || ''}
				/>
			</div>
		</section>
	</div>
</div>
