<script lang="ts">
	import { step } from '$lib/stores/steps';
	import clsx from 'clsx';
	import StepButton from '$lib/components/formControls/StepButton.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const steps = [1, 2, 3, 4] as const;

	const stepMap = {
		1: '/general-information',
		2: '/dataset-overview',
		3: '/sampling-design-and-location',
		4: '/review'
	};

	$: {
		if (browser) {
			goto(stepMap[$step as keyof typeof stepMap]);
		}
	}
</script>

<header class="px-16 py-10 flex items-center justify-between border-b border-b-divider">
	<img class="h-12" src="/iDivLogo-short.jpg" alt="iDiv Logo" />
	<div class="flex gap-5">
		{#each steps as s, idx}
			<div class="flex items-center gap-5">
				<a
					href={stepMap[s]}
					class={clsx(
						'flex items-center justify-center rounded-full text-[10px]  text-white p-2  transition',
						$step > s ? 'bg-tertiary' : 'bg-neutral-light',
						$step === s && 'bg-secondary box-shadow-glow'
					)}
				>
					<span
						class={clsx(
							'rounded-full w-7 h-7 flex items-center justify-center',
							$step > s ? 'bg-tertiary-dark' : 'bg-neutral',
							$step === s && 'bg-secondary-dark'
						)}>{s}</span
					>
				</a>
				{#if idx < steps.length - 1}
					<div
						class={clsx(
							'h-1 w-32 rounded-lg',
							$step >= idx + 2 ? 'bg-tertiary' : 'bg-neutral-light'
						)}
					/>
				{/if}
			</div>
		{/each}
	</div>
</header>

<main class="max-w-7xl mx-auto pt-20 py-48">
	<slot />
</main>

<div class="flex fixed bottom-5 justify-end inset-x-5 gap-3">

	<div class="w-10">
	{#if $step >	1}
		<StepButton direction="prev" />
	{/if}
</div>

<div class="w-10">
	{#if $step < 4}
		<StepButton direction="next" />
	{/if}
</div>
	<!-- <StepButton direction="prev" />
	<StepButton direction="next" /> -->
</div>
