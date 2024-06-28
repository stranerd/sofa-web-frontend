import { useAsyncFn } from '../core/hooks'
import { AuthRoles, AuthUseCases } from '@modules/auth'
import { UserEntity } from '@modules/users'

export const useToggleRoles = (role: AuthRoles) => {
	const {
		asyncFn: updateRole,
		loading,
		error,
	} = useAsyncFn(
		async (user: UserEntity) => {
			await AuthUseCases.updateRole(user.id, role, !user.roles[role])
		},
		{
			pre: () =>
				$utils.confirm({
					title: "Are you sure you want to change this user's role?",
					sub: '',
					right: { label: 'Yes, change' },
				}),
		},
	)

	return { loading, error, updateRole }
}
