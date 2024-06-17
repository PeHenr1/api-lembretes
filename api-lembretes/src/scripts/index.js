const baseUrl = 'https://ifsp.ddns.net/webservices/lembretes';

$(document).ready(() => {
    const loader = $('#loading');
    const main = $('main');

    checkToken();
    loadNotes();
    counter(180);
    theme();

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
            //console.log(response);
            if (response.length > 0) {
                response.forEach(note => {
                    notes += `
                        <tr>
                            <td class="table-secondary" data-note-id=${note.id}>${note.texto}</td>
                        </tr>
                    `
                });
            } else {
                notes += `
                <tr>
                    <td colspan="2" class="text-center table-secondary">No notes found.</td>
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
    const form = $('#note-form');
    const description = $('#note-text').val();

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
                        <td class="table-secondary" data-note-id=${res.id}>${res.texto}</td>
                    </tr>
                `);
                $('#textareaModal').modal('hide');

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
        },
        error: () => {
            const description = $('#editNote').find('#note-text').val();
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

    $('#editNote').find('#note-text').val(noteText);
    $('#editNote').data('note-id', noteId);

    $('#editNote').modal('show');
});

$('#editNote').on('click', '.edit-note', function () {

    const noteId = $('#editNote').data('note-id');
    const originalText = $(`td[data-note-id="${noteId}"]`).text();
    const updatedText = $('#editNote').find('#note-text').val();

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
    const modalTextarea = document.getElementById('note-text');
    const textareaModal = $('#textareaModal');

    initialTextarea.addEventListener('click', () => {
        modalTextarea.value = initialTextarea.value;
        textareaModal.modal('show');
    });

    textareaModal.on('hide.bs.modal', () => {
        initialTextarea.value = modalTextarea.value;
    });

});

function counter(durationInSeconds) {
    let startTime = localStorage.getItem('contadorStartTime');

    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem('contadorStartTime', startTime);
    }
    else {
        let elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
        durationInSeconds -= elapsedTime;

        if (durationInSeconds <= 0) {
            durationInSeconds = 0;
            localStorage.removeItem('contadorStartTime');
            localStorage.removeItem('contadorTempo');
        }
    }

    function updateCountdown() {
        let minutes = Math.floor(durationInSeconds / 60);
        let seconds = durationInSeconds % 60;

        $('#contador').text(('Sessions expires in '+ '0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));

        if (durationInSeconds <= 0) {
            clearInterval(interval);
            localStorage.removeItem('contadorStartTime');
            localStorage.removeItem('contadorTempo');
        } else {
            localStorage.setItem('contadorTempo', durationInSeconds);
            durationInSeconds--;
        }
    }

    updateCountdown();
    let interval = setInterval(updateCountdown, 1000);
}

$('#dark-theme-btn').click(function() {
    let htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
});

$('#light-theme-btn').click(function() {
    let htmlElement = document.querySelector('html');
    htmlElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
});

$('#logout').click(function() {
    localStorage.removeItem('token');
    localStorage.removeItem('contadorStartTime');
    localStorage.removeItem('contadorTempo');
    window.location.href = '../pages/access.html';
});

function theme(){
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        let htmlElement = document.querySelector('html');
        htmlElement.setAttribute('data-bs-theme', savedTheme);
    }
}

setInterval(checkToken, 1000 * 60)