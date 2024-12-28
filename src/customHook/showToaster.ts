import toastr from 'toastr';

const useShowToast = () => {
  return (message: string, type: 'success' | 'error' | 'info', autoHide: boolean = true) => {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      timeOut: autoHide ? 3000 : 0,
      extendedTimeOut: autoHide ? 1000 : 0,
    };

    switch (type) {
      case 'success':
        toastr.success(message);
        break;
      case 'error':
        toastr.error(message);
        break;
      case 'info':
        toastr.info(message);
        break;
      default:
        toastr.info(message);
    }
  };
};

export default useShowToast;
