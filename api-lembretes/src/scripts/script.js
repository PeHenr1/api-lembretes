if (typeof (Storage) !== "undefined") {
  console.log('ok')
} else {
  console.log('nao')
}


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

$('.button').on('click', function (e) {
  e.preventDefault();

  target = $(this).parent().parent().attr('id');
  console.log(target)

  if(target === "signup"){
    // Função para o Sign Up
    console.log('oi')
    // NAO ACESSA O FORM
    $('#form-signup').on('submit', function(e) {
      console.log('hehehe')
      e.preventDefault();

      const firstName = $('#first-name').val();
      const lastName = $('#last-name').val();
      const email = $('#signup-email').val();
      const password = $('#signup-password').val();
     
      $.ajax({
          url: 'https://ifsp.ddns.net/webservices/lembretes/usuario/signup',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
              firstName,
              lastName,
              email,
              password
          }),
          
          success: function(response) {
              alert('User registered successfully');
              // Armazenar o token se necessário
              localStorage.setItem('token', response.token);
              // Redirecionar ou atualizar a interface do usuário
              //window.location.href = '/dashboard';
          },
          error: function(error) {
              console.error('Error:', error);
              alert('Failed to register');
          }
      });
    });
  }
  else if(target === "login"){
    $('#form-login').on('submit', function(e) {
      e.preventDefault();

      const email = $('#login-email').val();
      const password = $('#login-password').val();

      $.ajax({
          url: 'https://ifsp.ddns.net/webservices/lembretes/usuario/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
              email,
              password
          }),
          success: function(response) {
              if (response.success) {
                  alert('Login successful');
                  // Armazenar o token se necessário
                  localStorage.setItem('token', response.token);
                  // Redirecionar ou atualizar a interface do usuário
                  window.location.href = '/dashboard';
              } else {
                  alert('Login failed: ' + response.message);
              }
          },
          error: function(error) {
              console.error('Error:', error);
              alert('Failed to login');
          }
      });
    });
  }
  // if == login --> post pra checar se ta cadastrado
  // em ambos os casos, se sucesso, faz sumir o formulario
  $('.form').hide(); 

});

