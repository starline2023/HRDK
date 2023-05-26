

import firebase from 'react-native-firebase';
// Optional flow type
import type { Notification,NotificationOpen} from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import { ToastAndroid} from 'react-native';
// export default async (message: RemoteMessage) => {
//     // handle your message
//         const {topic, title, body} = message.data;
//         const notification = new firebase.notifications.Notification()
//             .setNotificationId(getRandomNotificationId())
//             .setTitle(title)
//             .setBody(body)
//             .setData(message.data);
//         notification.android.setChannelId('default')
//             //.android.setSmallIcon('ic_stat_ic_notification');
//         .android.setPriority(firebase.notifications.Android.Priority.High)
//         firebase.notifications().displayNotification(notification);

//     return Promise.resolve();
// }

export default async (message) => {
   
    if (message) {
        const {
            topic, title, body
        } = message.data;
        const notification = new firebase.notifications.Notification()
            .setNotificationId(getRandomNotificationId())
            .setTitle(title)
            .setBody(body)
            .setData(message.data);
             notification.android.setChannelId('default')
            //.android.setSmallIcon('ic_stat_ic_notification');
            .android.setPriority(firebase.notifications.Android.Priority.High)

        const channel = new firebase.notifications.Android
        .Channel('default', 'Default Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('The default notification channel.')
        firebase.notifications().android.createChannel(channel)
        firebase.notifications().displayNotification(notification);
    }
    Promise.resolve();
};