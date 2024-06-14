



$('.button').on('click', function (e) {
  let token = ''
  e.preventDefault();

  target = $(this).parent().parent().attr('id');
  console.log(target == "signup")

  if(target == "signup"){
    // Função para o Sign Up
    console.log('hehehe')
    e.preventDefault();

    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    
    $.post('https://ifsp.ddns.net/webservices/lembretes/usuario', {login: email, senha: password}, function(response){
        if(response.success){
            token = response.token;
            alert('Usuário cadastrado com sucesso! Token JWT: ' + token);
        } 
        else {
            alert('Erro ao cadastrar usuário: ' + response.message);
        }
    });

    /*$.ajax({
        url: 'https://ifsp.ddns.net/webservices/lembretes/usuario/signup',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
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
    });*/
   
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

