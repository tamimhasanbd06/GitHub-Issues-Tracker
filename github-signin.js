function checkCredentials() {

  const username = document.getElementById('username').value.toLowerCase();
  const password = document.getElementById('password').value.toLowerCase();

  if (username === 'admin' && password === 'admin123') {
  
    window.location.href = 'gitHoub-Dashboard.html'
  } 
  else {
    alert('Sign Up Failed');
  }

}

document.getElementById('signInButton').addEventListener('click', checkCredentials);