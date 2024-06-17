const baseUrl = "https://ifsp.ddns.net/webservices/lembretes";
let form;

$(document).ready(() => {
    const loader = $('#loading');
    const main = $('main');

    //theme();

    setTimeout(() => {
        loader.removeClass('d-flex')
        loader.addClass('d-none');

        main.removeClass('d-none');
    }, 3030);
});

$('form').on('submit', event => {
    const target = event.target;

    event.preventDefault();
    event.stopPropagation();

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

/*
function theme(){
    let savedTheme = localStorage.getItem('theme');
    let htmlElement = document.querySelector('html');
    if (savedTheme) {
        htmlElement.setAttribute('data-bs-theme', savedTheme);
    }
    else {
        localStorage.setItem('theme', 'dark');
        htmlElement.setAttribute('data-bs-theme', 'dark');
        $("body").css("background-color", "#110123");
    }
}


$('#dark-theme-btn').click(function() {
    let htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');

    $("body").css("background-color", "#110123");
});

$('#light-theme-btn').click(function() {
    let htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');

    $("body").css("background-color","#d5d0ff");
});
*/

// ARRUMAR O CONTADOR DE CIMA

// ARRUMAR O DATA-BASE QUE NAO TA NO LOCALSTORAGE

function toggleTheme() {
    const htmlElement = document.querySelector('html');
    const body = document.body;
    const theme = localStorage.getItem("theme");
    const button = $('#toggle-theme');
    const bIcon = $("#toggle-theme i");

    if (theme === "dark") {
        htmlElement.setAttribute('data-bs-theme', 'light');
        body.classList.remove("dark");
        body.classList.add("light");
        button.removeClass('btn btn-outline-light')
        button.addClass('btn btn-outline-dark')
        bIcon.removeClass('bi bi-brightness-high')
        bIcon.addClass('bi bi-moon-fill')
        localStorage.setItem("theme", "light");
    }
    else {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        body.classList.remove("light");
        body.classList.add("dark");
        button.removeClass('btn btn-outline-dark')
        button.addClass('btn btn-outline-light')
        bIcon.removeClass('bi bi-moon-fill')
        bIcon.addClass('bi bi-brightness-high')

        localStorage.setItem("theme", "dark");
    }
}

const initialTheme = localStorage.getItem("theme");
if (initialTheme) {
    document.body.classList.add(initialTheme);
    const button = $('#toggle-theme');
    const bIcon = $("#toggle-theme i");
    if (initialTheme === "dark") {
        button.removeClass('btn btn-outline-dark')
        button.addClass('btn btn-outline-light')
        bIcon.removeClass('bi bi-moon-fill')
        bIcon.addClass('bi bi-brightness-high')
    } else {
        button.removeClass('btn btn-outline-light')
        button.addClass('btn btn-outline-dark')
        bIcon.removeClass('bi bi-brightness-high')
        bIcon.addClass('bi bi-moon-fill')

    }
}

const toggleButton = document.getElementById("toggle-theme");
toggleButton.addEventListener("click", toggleTheme);