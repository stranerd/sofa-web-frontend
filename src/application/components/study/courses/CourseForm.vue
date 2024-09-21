<template>
	<form class="flex flex-col gap-4" @submit.prevent="submit">
		<SofaText v-if="!auth?.roles.isVerified">
			You need to <router-link class="text-primaryBlue" to="/verification">get verified</router-link> to be able to sell this course
			on our marketplace
		</SofaText>

		<div class="w-full md:grid md:grid-cols-2 flex flex-col-reverse gap-4">
			<div class="col-span-1 w-full flex flex-col gap-3">
				<SofaInput v-model="factory.title" placeholder="Enter title" :error="factory.errors.title" />

				<SofaTextarea v-model="factory.description" :rows="4" placeholder="Enter description" :error="factory.errors.description" />

				<SofaSelect
					v-model="factory.topic"
					placeholder="Topic"
					:error="factory.errors.topic"
					:options="topics.map((t) => ({ key: t.title, value: t.title }))"
					custom />

				<SofaInput
					v-if="auth?.roles.isVerified"
					v-model="factory.amount"
					type="number"
					placeholder="Enter price"
					:error="factory.errors.amount">
					<template #suffix>
						<div class="flex items-center gap-1 border-l-2 border-darkLightGray pl-3">
							<SofaHeading size="title" class="text-deepGray">
								{{ $utils.getCurrency(factory.currency) }}
							</SofaHeading>
						</div>
					</template>
				</SofaInput>
			</div>

			<div class="col-span-1 flex flex-col w-full pb-4 md:pb-0">
				<SofaImageLoader class="w-full h-[240px] rounded-custom relative" :photoUrl="factory.photo?.link ?? '/images/default.svg'">
					<div class="absolute bottom-0 left-0 pb-3 flex w-full items-center justify-center">
						<SofaFileInput v-model="factory.photo" accept="image/*">
							<div class="p-3 flex items-center justify-center gap-2 rounded-custom bg-deepGray text-white bg-opacity-50">
								<SofaIcon class="h-[18px] fill-current" name="camera" />
								<SofaText content="Add cover photo" />
							</div>
						</SofaFileInput>
					</div>
				</SofaImageLoader>
			</div>
		</div>

		<div class="w-full flex flex-col gap-2">
			<SofaInput v-model="factory.tagString" name="Tags" placeholder="Tags (Comma separated for multiple)" />
			<div class="w-full flex flex-wrap gap-2 items-center">
				<template v-for="(item, index) in factory.tags" :key="index">
					<div class="p-2 border-2 flex items-center gap-2 rounded-custom border-darkLightGray">
						<SofaText :content="item" />
						<SofaIcon name="circle-close" class="h-[17px]" @click="factory.removeTag(index)" />
					</div>
				</template>
			</div>
		</div>

		<div class="w-full flex items-center justify-between">
			<SofaButton type="button" padding="px-5 py-2" color="white" class="hidden mdlg:inline-block" @click.prevent="cancel">
				Exit
			</SofaButton>

			<div class="mdlg:w-auto w-full flex gap-3 items-center">
				<SofaButton :disabled="!factory.valid" padding="px-5 mdlg:py-2 py-3" class="mdlg:w-auto w-full" type="submit">
					Save
				</SofaButton>
				<SofaButton
					v-if="publish"
					type="button"
					:disabled="!factory.valid"
					padding="px-5 mdlg:py-2 py-3"
					class="mdlg:w-auto w-full"
					@click.prevent="publish">
					Publish
				</SofaButton>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useGenericTagsList, useTopicsList } from '@app/composables/interactions/tags'
import { CourseEntity, CourseFactory } from '@modules/study'

const props = defineProps<{
	course?: CourseEntity
	cancel: () => void
	factory: CourseFactory
	submit: () => void
	publish?: () => void
}>()

const { auth } = useAuth()
const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

watch(
	topics,
	() => {
		if (!topics.length) return
		if (props.factory.topicId && !props.factory.topic) {
			const topic = topics.find((t) => t.id === props.factory.topicId)
			if (topic) props.factory.topic = topic.title
		}
	},
	{ immediate: true },
)

watch(
	tags,
	() => {
		if (!tags.length) return
		if (props.factory.tagIds.length && !props.factory.tags.length) {
			const myTags = tags.filter((t) => props.factory.tagIds.includes(t.id))
			props.factory.tags = props.factory.tagIds.map((t) => myTags.find((mt) => t === mt.id)?.title).filter(Boolean)
		}
	},
	{ immediate: true },
)
</script>
