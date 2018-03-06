import NotificationSystem from 'react-notification-system';
import originWithNotify from 'redux-source-with-notify';

export default function withNotify(config = {}) {
  const {
    position = 'tc',
    successDuration = 2,
    errorDuration = 4,
    successText = 'Success!',
    errorText = 'Operation failed. Please try again or contact admin.',
    sourceStateName,
  } = config;
  return originWithNotify({
    onSuccess: notify => {
      notify.addNotification({
        message: successText,
        level: 'success',
        autoDismiss: successDuration,
        position,
      });
    },
    onError: notify => {
      notify.addNotification({
        message: errorText,
        level: 'error',
        autoDismiss: errorDuration,
        position,
      });
    },
    sourceStateName,
    trigger: NotificationSystem,
  });
}
