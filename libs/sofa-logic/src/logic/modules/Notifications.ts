import { $api } from '../../services'
import Common from './Common'
import { Logic } from '..'
import { Notification } from '../types/domains/notifications'
import { Paginated, QueryParams } from '../types/domains/common'
import { Conditions } from '../types/common'

export default class Notifications extends Common {
  constructor() {
    super()
  }

  public AllNotifications: Paginated<Notification> | undefined
  public SingleNotification: Notification | undefined

  public GetNotifications = (filters: QueryParams) => {
    return $api.notifications.notifications.fetch(filters).then((response) => {
      this.AllNotifications = response.data
    })
  }

  public GetNotification = (id: string) => {
    return $api.notifications.notifications.get(id).then((response) => {
      this.SingleNotification = response.data
    })
  }

  public ToggleSeenNotifications = (id: string, seen: boolean) => {
    return $api.notifications.notifications
      .toggleNotification({ id, seen })
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public ToggleAllNotifications = (seen: boolean) => {
    return $api.notifications.notifications
      .toggleAllNotification(seen)
      .then((response) => {
        Logic.Notifications.GetNotifications({
          where: [
            {
              field: 'userId',
              condition: Conditions.eq,
              value: Logic.Auth.AuthUser?.id,
            },
          ],
        })
      })
      .catch((error) => {
        //
      })
  }

  public SubscribeDevice = (token: string) => {
    return $api.notifications.pushTokens
      .subscribeDevice({ token })
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public UnSubscribeToken = (token: string) => {
    return $api.notifications.pushTokens
      .unsubscribeDevice({ token })
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }
}
