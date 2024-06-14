const baseUrl = "https://ifsp.ddns.net/webservices/lembretes";
let form;

// VER ERRO DE BAD REQUEST DO POST 

$(document).ready(() => {
    const loader = $('#loading');
    const main = $('main');

    setTimeout(() => {
        loader.removeClass('d-flex')
        loader.addClass('d-none');

        main.removeClass('d-none');
    }, 3030);
});

$('form').on('submit', event => {
    const target = event.target;
    
    const action = target.id;
    let url;
    let errorMessage;

    if (action === 'form-login') {
        url = `${baseUrl}/usuario/login`;
        errorMessage = 'Invalid credentials.';
        form = $('#form-login'); 
    } 
    else if (action === 'form-signup') {
        url = `${baseUrl}/usuario/signup`;
        errorMessage = 'This email is already registered.';
        form = $('#form-signup');
    }

    event.preventDefault();
    event.stopPropagation();

    if (!target.checkValidity()) {
        Swal.fire({
            icon: 'error',
            title: 'Uh-Oh...',
            text: 'Please fill out all fields in the form.'
        });
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: form.serialize(),
            success: response => {
                localStorage.setItem('token', response.token);
                window.location.replace('../pages/index.html');
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Uh-Oh...',
                    text: errorMessage
                });
            }
        });
    }

});



$('.form').find('input, textarea').on('keyup blur focus', function (e) {
    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
        label.removeClass('active highlight');
        } else {
        label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if ($this.val() === '') {
        label.removeClass('active highlight');
        } else {
        label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {
        if ($this.val() === '') {
        label.removeClass('highlight');
        }
        else if ($this.val() !== '') {
        label.addClass('highlight');
        }
    }
});
  
$('.tab a').on('click', function (e) {
    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);
});