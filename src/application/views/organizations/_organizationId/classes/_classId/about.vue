<template>
	<ClassLayout>
		<template #default="{ classInst }">
			<div class="w-full mdlg:bg-white mdlg:rounded-2xl mdlg:shadow-custom">
				<SofaHeaderText class="p-4 hidden mdlg:block" content="About" />
				<div class="hidden h-[1px] w-full bg-lightGray mdlg:block" />
				<div class="flex flex-col gap-4 p-0 mdlg:p-4">
					<SofaImageLoader class="mdlg:hidden w-full rounded-custom" :photoUrl="classInst.picture"> </SofaImageLoader>
					<div
						v-for="(item, i) in [
							{ title: 'Name', value: classInst.title },
							{ title: 'Description', value: classInst.description },
							{ title: 'Created', value: $utils.formatTime(classInst.createdAt) },
							{ title: 'Lessons', value: $utils.formatNumber(classInst.lessons.length) },
							{ title: 'Students', value: $utils.formatNumber(classInst.members.students.length) },
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
