const baseUrl = 'https://ifsp.ddns.net/webservices/lembretes';

$(document).ready(() => {
    const loader = $('#loading');
    const main = $('main');

    setTimeout(() => {
        loader.removeClass('d-flex')
        loader.addClass('d-none');

        main.removeClass('d-none');
    }, 3030);
});

