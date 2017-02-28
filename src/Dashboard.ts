import swal from 'sweetalert2';

export class Dashboard {
	async testClick() {
    try
    {
    await swal({titleText: 'Das ist Title',
      text: 'Das ist der Text',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Conf Button',
      cancelButtonText: 'Canc Button',
      allowOutsideClick: false,
      allowEscapeKey: false});

      swal('Confirm');
    }
    catch (ex)
    {
await swal('Cancel');
    }
  }
}
