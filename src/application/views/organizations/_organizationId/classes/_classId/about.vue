<template>
	<ClassLayout>
		<template #default="{ classInst }">
			<div class="w-full mdlg:bg-white mdlg:rounded-2xl mdlg:shadow-custom">
				<SofaHeaderText class="p-4 hidden mdlg:block" content="About" />
				<div class="hidden h-[1px] w-full bg-lightGray mdlg:block" />
				<div class="flex flex-col gap-4 p-0 mdlg:p-4">
					<SofaImageLoader
						customClass="block mdlg:hidden w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain"
						:photoUrl="classInst.picture">
					</SofaImageLoader>
					<div
						v-for="(item, i) in [
							{ title: 'Name', value: classInst.title },
							{ title: 'Description', value: classInst.description },
							{ title: 'Created', value: formatTime(classInst.createdAt) },
							{ title: 'Lessons', value: formatNumber(classInst.lessons.length) },
							{ title: 'Students', value: formatNumber(classInst.members.students.length) },
						]"
						:key="item.title"
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText class="text-grayColor">{{ item.title }}</SofaNormalText>
						<SofaNormalText :class="i === 0 ? 'font-bold' : ''">{{ item.value }}</SofaNormalText>
					</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { formatNumber } from 'valleyed'
import { defineComponent } from 'vue'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { formatTime } from '@utils/dates'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAbout',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		return { formatTime, formatNumber }
	},
})
</script>
