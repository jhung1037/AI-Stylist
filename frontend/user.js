document.addEventListener('DOMContentLoaded', function() {
  const accountAction = document.getElementById('accountAction');
  const haveAccountBtn = document.getElementById('haveAccountBtn');
  const createAccountBtn = document.getElementById('createAccountBtn');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const userPage = document.getElementById('userPage');
  const userGreeting = document.getElementById('userGreeting');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const logoutBtn = document.getElementById('logoutBtn');

  let createAccount, username;

  function toLoginForm(shouldCreateAccount) {
    accountAction.classList.add('hidden');
    loginForm.classList.remove('hidden');
    createAccount = shouldCreateAccount;
  }
  haveAccountBtn.addEventListener('click', function() {toLoginForm(false)});
  createAccountBtn.addEventListener('click', function() {toLoginForm(true);});

  loginBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    const login = await fetch('http://127.0.0.1:8000/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ create_account : createAccount, username : usernameInput.value, password : passwordInput.value })
    });
    
    const account = await login.json();
    if (account.success) {
      username = usernameInput.value;
      loginForm.classList.add('hidden');
      userPage.classList.remove('hidden');
      userGreeting.textContent = `Hi, ${username}`;
      apiKeyInput.textContent = account.key;
    } //TODO: no username, back to create account; have account already
    usernameInput.value = '';
    passwordInput.value = '';

  });

  logoutBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (apiKeyInput.textContent) {
      const logout = await fetch('http://127.0.0.1:8000/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username : username, apiKey : apiKeyInput.textContent })
      });
    }
    userPage.classList.add('hidden');
    accountAction.classList.remove('hidden');
    apiKeyInput.textContent = '';
    //TODO: API key validation
  });
});