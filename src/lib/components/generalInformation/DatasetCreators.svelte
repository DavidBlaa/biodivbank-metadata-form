<!-- TODO: append new entry after important -->
<script lang="ts">
	import clsx from 'clsx';
	import { nanoid } from 'nanoid';
	import { flip } from 'svelte/animate';
	import { enhance } from '$app/forms';

	import countries from './countries.json';
	import Pen from '$lib/icons/Pen.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import Handle from '$lib/icons/Handle.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import EditModal from './EditModal.svelte';
	import TextInput from '../TextInput.svelte';
	import OrcId from '../OrcId.svelte';
	import Select from '../Select.svelte';
	import Collapsible from '../Collapsible.svelte';
	import PrimaryContactModal from './PrimaryContactModal.svelte';
	import Ror from '../ROR.svelte';
	import { convertToDataAuthor, convertToListAuthor } from '$lib/helper';
	import { generalInformation } from '$lib/stores/generalInformation';
	import type { ListAuthor, Author, PrimaryContact, ImportAuthor } from '$lib/types/author';

	let authors: ListAuthor[] = [];

	// because of the different data structure of authors in the generalInformation store
	//	we need to convert the data to the correct format
	// authors for the form and authors for the generalInformation store
	authors = $generalInformation.authors
		.map((author) => {
			return convertToListAuthor(author);
		})
		.filter((a) => a.firstName !== '' && a.familyName !== '');

	$: authors, update();

	function update() {
		generalInformation.update((gi) => {
			//update the generalInformation store with the new authors
			gi.authors = authors.map((author) => {
				return convertToDataAuthor(author);
			});
			return gi;
		});
	}

	export let importedAuthors: ImportAuthor[] | null;

	let formEl: HTMLFormElement;
	let firstNameEl: HTMLInputElement;

	let firstName = '';
	let initials = '';
	let familyName = '';
	let orcId = '';
	let noOrcId = false;
	let isPrimaryContact = false;
	let primaryContact: PrimaryContact = {
		email: '',
		institutionName: '',
		institutionCountry: '',
		noRor: false,
		ror: ''
	};
	let orcIdNotAvailable = false;

	let isEditModalOpen = false;
	let isPrimaryContactModalOpen = false;
	let selectedAuthor: ListAuthor | null = null;

	let notAvailable = false;

	function addAuthor() {
		authors = [
			...authors,
			{
				id: nanoid(),
				firstName,
				initials,
				familyName,
				orcId,
				noOrcId,
				isPrimaryContact,
				primaryContact
			}
		];
		formEl.reset();
		initials = '';
		firstNameEl.focus();
		selectedAuthor = null;
		orcIdNotAvailable = false;
		notAvailable = false;
		isPrimaryContact = false;
		primaryContact = {
			email: '',
			institutionName: '',
			institutionCountry: '',
			noRor: false,
			ror: ''
		};
	}

	function addAuthors() {
		if (!importedAuthors) return;
		importedAuthors.forEach((author) => {
			authors = [
				...authors,
				{
					id: nanoid(),
					firstName: author.firstName,
					initials: author.initials ?? '',
					familyName: author.familyName,
					orcId: author.orcId ?? '',
					noOrcId: author.orcId ? false : true,
					isPrimaryContact: false,
					primaryContact: null
				}
			];
		});
	}

	$: {
		if (importedAuthors) {
			addAuthors();
		}
	}

	function removeAuthor(id: string) {
		authors = authors.filter((author) => author.id !== id);
	}

	function openEdit(author: ListAuthor) {
		selectedAuthor = author;
		isEditModalOpen = true;
	}

	function editAuthor(
		id: string,
		firstName: string,
		initials: string,
		familyName: string,
		orcId: string,
		noOrcId: boolean
	) {
		authors = authors.map((author) => {
			if (author.id === id) {
				return { ...author, firstName, initials, familyName, orcId, noOrcId, primaryContact };
			}
			return author;
		});

		isEditModalOpen = false;
		selectedAuthor = null;
	}

	function openPrimaryContactDetails(author: ListAuthor) {
		changePrimaryContactStatus(author.id);
	}

	function editPrimaryContactDetails(
		id: string,
		isPrimaryContact: boolean,
		primaryContact: PrimaryContact | null
	) {
		authors = authors.map((author) => {
			if (author.id === id) {
				return { ...author, isPrimaryContact, primaryContact };
			}
			//console.log("🚀 ~ authors=authors.map ~ author:", author)
			return author;
		});
		isPrimaryContactModalOpen = false;
		selectedAuthor = null;
	}

	let target: EventTarget | null = null;
	let hovering: number | null = null;
	let grabbed = false;

	function dragStart(event: DragEvent, idx: number, author: Author) {
		if (target instanceof Element && target?.id.startsWith('handle')) {
			if (event.dataTransfer) {
				event.dataTransfer.effectAllowed = 'move';
				event.dataTransfer.dropEffect = 'move';
				event.dataTransfer.setData('text/plain', idx.toString());
				grabbed = true;
			}
		} else {
			event.preventDefault();
			grabbed = false;
		}
	}

	function drop(event: DragEvent, idx: number) {
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
			const start = parseInt(event.dataTransfer.getData('text/plain'));
			const newAuthorList = authors;

			if (start < idx) {
				newAuthorList.splice(idx + 1, 0, newAuthorList[start]);
				newAuthorList.splice(start, 1);
			} else {
				newAuthorList.splice(idx, 0, newAuthorList[start]);
				newAuthorList.splice(start + 1, 1);
			}
			authors = newAuthorList;
			hovering = null;
			grabbed = false;
		}
	}

	function changePrimaryContactStatus(id: string) {
		authors = authors.map((author) => {
			if (author.id === id) {
				if (!author.isPrimaryContact) {
					selectedAuthor = author;
					isPrimaryContactModalOpen = true;
				}
				return { ...author, isPrimaryContact: !author.isPrimaryContact };
			}
			return author;
		});
	}

	function cancelEditPrimaryContactModal() {
		selectedAuthor && changePrimaryContactStatus(selectedAuthor.id);
		isPrimaryContactModalOpen = false;
		selectedAuthor = null;
	}

	function isEmpty(author: ListAuthor) {
		return !author.firstName && !author.initials && !author.familyName && !author.orcId;
	}
</script>

{#if authors?.length}
	<div class="col-span-2 space-y-1">
		{#each authors as author, idx (author.id)}
			<div
				on:mousedown={(e) => {
					target = e.target;
				}}
				animate:flip
				draggable={true}
				on:dragstart={(e) => dragStart(e, idx, author)}
				on:dragover|preventDefault
				on:dragenter={(e) => {
					hovering = idx;
				}}
				on:drop|preventDefault={(e) => drop(e, idx)}
				class={clsx(
					'bg-interactive-surface py-4 px-6 text-subtle-text border border-interactive-surface grid grid-cols-8 items-center',
					hovering === idx && 'border-red-600'
				)}
				role="button"
				tabindex="0"
				aria-grabbed={grabbed}
				aria-roledescription="Authors list"
			>
				{#if !isEmpty(author)}
					<div class="flex items-center gap-10">
						<div id="handle">
							<Handle />
						</div>
						<span>
							<input
								type="checkbox"
								bind:checked={author.isPrimaryContact}
								on:click={() => openPrimaryContactDetails(author)}
								aria-roledescription="Author's primary contact status"
							/>
						</span>
					</div>
					<span class="text-black-text col-span-4 text-start"
						>{author.firstName} {author.initials} {author.familyName}</span
					>
					<span class="col-span-2">{!!author.orcId ? author.orcId : 'No ORCiD provided'}</span>
					<div class="flex items-center gap-6 text-subtle-text justify-end">
						<button type="button" on:click={() => openEdit(author)}>
							<Pen class="h-5 w-5" />
						</button>
						<button type="button" on:click={() => removeAuthor(author.id)}>
							<Trash class="h-5 w-5" />
						</button>
					</div>
				{/if}
			</div>
		{/each}
		<p class="text-subtle-text text-sm flex gap-1.5 items-center pt-2">
			Select the <input
				type="checkbox"
				class="!w-4 !h-4"
				checked
				on:click|preventDefault={() => false}
			/> to indicate which authors are primary contacts. At least one author must be a primary contact
			for the dataset.
		</p>
	</div>
{:else}
	<div
		class="flex items-center justify-center p-4 col-span-2 bg-secondary-white border border-dashed border-secondary-light text-secondary-light"
	>
		No creators added yet
	</div>
{/if}
<div class="h-px col-span-2 my-2" />
<div class="col-span-2">
	<Collapsible title="Add an author *" open={true}>
		<form
			class="flex flex-col col-span-2 gap-4"
			on:submit|preventDefault={addAuthor}
			bind:this={formEl}
		>
			<div class="grid grid-cols-6 xl:flex-row gap-4 mt-1">
				<TextInput
					bind:value={firstName}
					required
					placeholder="E.g. Tarak"
					bind:el={firstNameEl}
					label="First name"
					class="col-span-2"
				/>
				<TextInput
					bind:value={initials}
					placeholder="L."
					label="initials(s)"
					pattern={'^ *?[A-Z]\\.(\\s[A-Z]\\.)* *?$'}
					errorMsg="Please enter initials in capitals separated \nby a dot and a space. Eg: E. G."
				/>
				<TextInput
					bind:value={familyName}
					required
					placeholder="Tidjani Kadal"
					label="Family name(s)"
					class="col-span-3"
				/>
			</div>
			<div class="w-1/2 grid gap-5">
				<OrcId
					bind:value={orcId}
					bind:notAvailable={orcIdNotAvailable}
					name="orcId-author-list"
					label="ORCiD *"
					maxLength={19}
					pattern={`\\d{4}-\\d{4}-\\d{4}-\\d{4}`}
					placeholder="Eg: 0000-0000-0000-0000"
					invalidInputErrorMsg="An ORCiD must contain four 4-digit numbers, separated by hyphens."
					invalidatedErrorMsg="ORCiD does not exist, please check that you have typed it in correctly."
					confirmCheckboxMsg="No ORCiD available?"
					validatedMsg="ORCiD found."
				/>
				<label class="flex items-center gap-3"
					><span class="text-sm shrink-0">Primary contact?</span>
					<input type="checkbox" class="!w-4 !h-4" bind:checked={isPrimaryContact} />
				</label>
			</div>

			{#if isPrimaryContact}
				<TextInput
					class="col-start-1"
					label="Email address"
					required
					pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
					placeholder="E.g. name@organization.domain"
					bind:value={primaryContact.email}
				/>
				<div class="col-span-2 flex justify-between items-center gap-3">
					<TextInput
						label="Institution name"
						required
						placeholder="E.g. Institute of Biodiversity Studies"
						bind:value={primaryContact.institutionName}
					/>
					<Select
						label="Institution country"
						required
						placeholder="Select country..."
						options={countries.map((c) => c.en)}
						bind:value={primaryContact.institutionCountry}
					/>
				</div>
				<div>
					<Ror
						bind:value={primaryContact.ror}
						bind:notAvailable={primaryContact.noRor}
						name="ror-author-list"
						label="Institution ROR ID"
						maxLength={9}
						placeholder="XXXXXXXXX"
						invalidInputErrorMsg="A ROR ID must contain 9 alphanumeric characters."
						invalidatedErrorMsg="ROR ID does not exist, please check that you have typed it in correctly."
						confirmCheckboxMsg="No ROR ID available?"
						validatedMsg="ROR ID found."
					/>
				</div>
			{/if}
			<button
				type="submit"
				class="text-sm shadow-md text-white bg-secondary p-2 mt-3 pr-4 self-start col-span-1 rounded-md flex items-center gap-5"
			>
				<Plus />
				Add
			</button>
		</form>
	</Collapsible>
</div>
<!-- <div class="h-px bg-divider col-span-2" /> -->
<div class="col-span-2">
	<Collapsible title="Import authors"
		><form method="POST" action="?/importAuthors" use:enhance class="col-span-2">
			<div class="flex flex-col justify-start w-max gap-8">
				<input accept="text/csv" type="file" name="csv" id="csv" />
				<button class="text-sm shadow-md text-white bg-secondary p-2 px-4 rounded-md w-max gap-5"
					>Import</button
				>
			</div>
		</form>
		<div class="text-min-contrast-gray text-sm mb-4" slot="description">
			<p>
				You can also import authors from a CSV file. Download a template
				<a class="underline" href="/download?ext=csv">CSV</a>
				or
				<a class="underline" href="/download?ext=xlsx">Excel</a>
				file.
			</p>
		</div>
	</Collapsible>
</div>

{#if isEditModalOpen && selectedAuthor}
	<EditModal bind:isOpen={isEditModalOpen} author={selectedAuthor} {editAuthor} />
{/if}

{#if isPrimaryContactModalOpen && selectedAuthor}
	<PrimaryContactModal
		bind:isOpen={isPrimaryContactModalOpen}
		author={selectedAuthor}
		{editPrimaryContactDetails}
		{cancelEditPrimaryContactModal}
	/>
{/if}
