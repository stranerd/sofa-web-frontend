<template>
	<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div v-if="classes.length > 0" class="flex flex-col gap-4">
			<ClassCard v-for="cl in filteredClassess" :key="cl.id" :classObj="cl" />
		</div>
		<div v-else class="bg-lightGray p-8 flex flex-col gap-2 items-center justify-center">
			<img src="/images/empty-class.png" class="w-[59px] h-[64px]" />
			<SofaNormalText content="You are not in any class" color="text-grayColor" customClass="font-bold" />
			<SofaNormalText content="Contact your organization to add you to a class." color="text-grayColor" />
		</div>
	</div>
</template>

<script lang="ts">
import ClassCard from '@app/components/organizations/classes/ClassCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity } from '@modules/organizations'
import { computed, defineComponent, ref, PropType } from 'vue'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { ClassCard },
	props: {
		classes: {
			type: Array as PropType<ClassEntity[]>,
			required: true,
		},
	},
	setup(props) {
		const emptyClassContent = {
			imageURL: '/images/empty-class.png',
			title: 'Getting started with classes',
			contents: [
				'Teach all subjects of a class in the same place.',
				'Create lessons for specific subjects.',
				'Make announcements to all student at once.',
				'Set a monthly subscription fee for online students.',
			],
		}

		const { id: organizationId, userType } = useAuth()
		const searchQuery = ref('')

		const filteredClassess = computed(() => {
			if (searchQuery.value) return props.classes.filter((c) => c.search(searchQuery.value))
			else return props.classes
		})

		return {
			emptyClassContent,
			filteredClassess,
			organizationId,
			userType,
		}
	},
})
</script>
