<template>
	<ClassLayout title="About">
		<template #default="{ classInst }">
			<div class="p-4 mdlg:p-0">
				<div
					class="w-full bg-white rounded-t-2xl items-start mdlg:rounded-t-none rounded-b-2xl p-4 mdlg:p-6 flex flex-col mdlg:flex-row gap-4">
					<SofaImageLoader class="w-full mdlg:w-[360px] rounded-custom" aspect="3/2" :photoUrl="classInst.picture" />
					<div class="flex flex-col gap-2">
						<SofaHeading :content="classInst.title" size="title2" />
						<UserName :user="classInst.user" as="router-link" class="text-grayColor" />
						<SofaText :content="classInst.description" class="text-grayColor" size="title" />
						<SofaText :content="`Created ${$utils.formatTime(classInst.createdAt)}`" class="text-grayColor" />
					</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>
