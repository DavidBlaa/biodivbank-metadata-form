<script lang="ts">
	export let group: string[];
	export let inputs: (string | null)[];
	export let name: string;
	export let other: string | undefined = '';
	export let otherKey: string | undefined = 'Other';
	export let otherPlaceholder: string | undefined = 'Tell us more...';

	let otherChecked: boolean = false;
</script>

{#each inputs as input}
	{#if input}
		<label class="flex items-center gap-3">
			{#if input !== otherKey}
				<input type="checkbox" value={input} bind:group {name} />
			{:else}
				<input type="checkbox" value={input} bind:checked={otherChecked} bind:group {name} />
			{/if}
			<span class="text-sm shrink-0">
				{input}&nbsp;
				{#if input}
					<!-- <span class="text-description text-xs">({input})</span> -->
				{/if}
			</span>
			{#if input === otherKey}
				<input
					type="text"
					placeholder={otherPlaceholder}
					bind:value={other}
					required={otherChecked}
					disabled={!otherChecked}
					class="bg-input rounded-md text-sm px-3 py-2 border-none w-full placeholder:text-placeholder"
				/>
			{/if}
		</label>
	{:else}
		<div class="h-px bg-min-contrast-gray col-span-2 opacity-30 w-1/3" />
	{/if}
{/each}
