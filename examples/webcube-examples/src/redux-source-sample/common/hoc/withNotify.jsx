import NotificationSystem from 'react-notification-system';
import originWithNotify from 'redux-source-with-notify';

export default function withNotify(config = {}) {
  const {
    position = 'tc',
    successDuration = 2,
    errorDuration = 4,
    successText = 'Success!',
    errorText = 'Operation failed. Please try again or contact admin.',
    errorTexts = {},
    ...otherConfig
  } = config;
  return originWithNotify({
    onSuccess: notify => {
      if (successText) {
        notify.addNotification({
          message: successText,
          level: 'success',
          autoDismiss: successDuration,
          position,
        });
      }
    },
    onError: (notify, errors) => {
      errors.forEach(error => {
        const text = errorTexts[error.message] || errorText;
        if (text) {
          notify.addNotification({
            message: text,
            level: 'error',
            autoDismiss: errorDuration,
            position,
          });
        }
      });
    },
    trigger: NotificationSystem,
    errorTexts,
    ...otherConfig,
  });
}
