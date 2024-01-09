<template>
    <HomeLayout title="Teachers">
		<ClassesForTeachers v-if="userType.isTeacher" />
        <ClassesForOrganization v-if="userType.isOrg" />
	</HomeLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeLayout from '@/components/home/HomeLayout.vue'
import ClassesForTeachers from '@/components/organizations/classes/ClassesForTeachers.vue'
import ClassesForOrganization from '@/components/organizations/classes/ClassesForOrganization.vue'
import { useAuth } from '@/composables/auth/auth'

export default defineComponent({
    name: 'OrganizationClassesPage',
	components: { HomeLayout, ClassesForTeachers, ClassesForOrganization },
    setup(){
        const { userType } = useAuth()
        return {
            userType
        }
    }
})
</script>