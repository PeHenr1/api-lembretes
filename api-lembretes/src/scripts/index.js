const baseUrl = 'https://ifsp.ddns.net/webservices/lembretes';

$(document).ready(() => {
    const loader = $('#loading');
    const main = $('main');

    checkToken();
    loadNotes();
    initializeTheme();

    setTimeout(() => {
        loader.removeClass('d-flex')
        loader.addClass('d-none');

        main.removeClass('d-none');
    }, 2050);


});

function checkToken() {
    $.ajax({
        url: `${baseUrl}/usuario/check`,
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        error: () => {
            Swal.fire({
                icon: 'error',
                title: 'Uh-Oh...',
                text: 'Session expired! Redirecting to acess page.'
            });
            setTimeout(() => {
                window.location.replace('../pages/access.html');
            }, 2050)
        }
    });
}

function loadNotes() {
    $.ajax({
        url: `${baseUrl}/lembrete`,
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        success: response => {
            const tbody = $('tbody');
            let notes = '';
            if (response.length > 0) {
                response.forEach(note => {
                    notes += `
                        <tr>
                            <td class="table-secondary" data-note-id=${note.id} data-note-date=${note.data}>${note.texto}</td>
                        </tr>
                    `
                });
            } else {
                notes += `
                <tr>
                    <td colspan="2" class="text-center table-secondary no-notes">No notes found.</td>
                </tr>
                `
            }
            tbody.empty().append(notes);
        }
    });
}

$('#create-note').on('click', event => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target;
    const form = $('#note-form-create');
    const description = $('#note-text-create').val();

    if (description.length > 255) {
        Swal.fire({
            icon: 'error',
            title: 'Uh-Oh...',
            text: 'It cannot exceed 255 characters.'
        });
    }
    else if (!form[0].checkValidity()) {
        Swal.fire({
            icon: 'info',
            title: 'Hmm...',
            text: 'Empty note is not valid!'
        });
    } else {
        $.ajax({
            url: `${baseUrl}/lembrete`,
            type: 'POST',
            data: form.serialize(),
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            success: res => {
                const tbody = $('tbody');
                tbody.append(`
                    <tr>
                        <td class="table-secondary" data-note-date=${res.data} data-note-id=${res.id}>${res.texto}</td>
                    </tr>                           
                `);
                $('#textareaModal').modal('hide');
                $('.no-notes').hide();

                Swal.fire({
                    icon: 'success',
                    title: 'All right',
                    text: 'Note saved successfully!'
                });

                $('#initialTextarea').val('');
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Uh-Oh...',
                    text: 'There was a problem creating the note. Please try again.'
                });
            }
        });
    }
});

$('#editNote').on('click', '.delete-note', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const noteId = $('#editNote').data('note-id');

    $.ajax({
        url: `${baseUrl}/lembrete/${noteId}`,
        type: 'DELETE',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        success: () => {
            Swal.fire({
                icon: 'success',
                title: 'All right',
                text: 'Note deleted successfully!'
            });
            $(`td[data-note-id="${noteId}"]`).closest('tr').remove();
            $('#editNote').modal('hide');
            loadNotes()
        },
        error: () => {
            const description = $('#editNote').find('#note-text-edit').val();
            if (description.length > 255) {
                Swal.fire({
                    icon: 'error',
                    title: 'Uh-Oh...',
                    text: 'It cannot exceed 255 characters.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Uh-Oh...',
                    text: 'There was a problem creating the note. Please try again.'
                });
            }
        }
    });
});

$('tbody').on('click', 'td[data-note-id]', function () {
    const noteText = $(this).text();
    const noteId = $(this).data('note-id');
    const noteDate = $(this).data('note-date');

    $('#editNote').find('#note-text-edit').val(noteText);
    $('#editNote').data('note-id', noteId);
    $('#editNote').find('#note-date').text(noteDate);

    $('#editNote').modal('show');
});

$('#editNote').on('click', '.edit-note', function () {

    const noteId = $('#editNote').data('note-id');
    const originalText = $(`td[data-note-id="${noteId}"]`).text();
    const updatedText = $('#editNote').find('#note-text-edit').val();

    if (originalText === updatedText) {
        Swal.fire({
            icon: 'info',
            title: 'Hmm...',
            text: 'The note is the same as before. No update was made.'
        });
        return;
    }

    $.ajax({
        url: `${baseUrl}/lembrete/${noteId}`,
        type: 'PUT',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        data: { texto: updatedText },
        success: () => {
            $(`td[data-note-id="${noteId}"]`).text(updatedText);

            $('#editNote').modal('hide');

            Swal.fire({
                icon: 'success',
                title: 'All right',
                text: 'Note updated successfully!'
            });
        },
        error: () => {
            Swal.fire({
                icon: 'error',
                title: 'Uh-Oh...',
                text: 'There was a problem updating the note. Please try again.'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const initialTextarea = document.getElementById('initialTextarea');
    const modalTextarea = document.getElementById('note-text-create');
    const textareaModal = $('#textareaModal');

    initialTextarea.addEventListener('click', () => {
        modalTextarea.value = initialTextarea.value;
        textareaModal.modal('show');
    });

    textareaModal.on('hide.bs.modal', () => {
        initialTextarea.value = modalTextarea.value;
    });

});

function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('contadorStartTime');
    localStorage.removeItem('contadorTempo');
    window.location.href = '../pages/access.html';
}

$('#logout').click(function () {
    logOut();
});


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
        $("h1").css("color", "black");
        $("h2").css("color", "black");
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
        $("h1").css("color", "white");
        $("h2").css("color", "white");
    }
}

function initializeTheme() {
    const htmlElement = document.querySelector('html');
    const body = document.body;
    const button = $('#toggle-theme');
    const bIcon = $("#toggle-theme i");
    const initialTheme = localStorage.getItem("theme");

    if (initialTheme === "dark") {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        body.classList.add("dark");
        body.classList.remove("light");
        button.removeClass('btn btn-outline-dark');
        button.addClass('btn btn-outline-light');
        bIcon.removeClass('bi bi-moon-fill');
        bIcon.addClass('bi bi-brightness-high');
        $("h1, h2").css("color", "white");
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
        body.classList.add("light");
        body.classList.remove("dark");
        button.removeClass('btn btn-outline-light');
        button.addClass('btn btn-outline-dark');
        bIcon.removeClass('bi bi-brightness-high');
        bIcon.addClass('bi bi-moon-fill');
        $("h1, h2").css("color", "black");
    }
}

const toggleButton = document.getElementById("toggle-theme");
toggleButton.addEventListener("click", toggleTheme);




setInterval(checkToken, 1000 * 60)