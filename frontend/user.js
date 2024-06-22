document.addEventListener('DOMContentLoaded', function() {
  const accountAction = document.getElementById('accountAction');
  const haveAccountBtn = document.getElementById('haveAccountBtn');
  const createAccountBtn = document.getElementById('createAccountBtn');
  const form = document.getElementById('form');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const formBtn = document.getElementById('formBtn');
  const subBtn = document.getElementById('subBtn');
  const userPage = document.getElementById('userPage');
  const userGreeting = document.getElementById('userGreeting');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const resetBtn = document.getElementById('resetBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  let createAccount, username;

  function toForm(shouldCreateAccount) {
    if (shouldCreateAccount) {
      formBtn.textContent = 'Submit';
      subBtn.textContent = 'Login Page';
    } else {
      formBtn.textContent = 'Login';
      subBtn.textContent = 'Join Instead';
    }
    accountAction.classList.add('hidden');
    form.classList.remove('hidden');
    createAccount = shouldCreateAccount;
  }
  haveAccountBtn.addEventListener('click', function() {toForm(false);});
  createAccountBtn.addEventListener('click', function() {toForm(true);});
  subBtn.addEventListener('click', function() {toForm(!createAccount);});

  formBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (!(usernameInput.value && passwordInput.value)) {
      alert("Please fill out the fields");
    } else {
      const login = await fetch('http://127.0.0.1:8000/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ create_account: createAccount, username: usernameInput.value, password: passwordInput.value })
      });
      
      const account = await login.json();
      if (account.success) {
        username = usernameInput.value;
        form.classList.add('hidden');
        userPage.classList.remove('hidden');
        userGreeting.textContent = `Hi, ${username}`;
        apiKeyInput.value = account.key;
      } else {
        if (createAccount) {
          alert("The username had been taken");
        } else {
          alert("Username or password incorrect");
        }
      }
      usernameInput.value = '';
      passwordInput.value = '';
    }
  });

  resetBtn.addEventListener('click', function() {apiKeyInput.value = "0000000000";});
  logoutBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (!apiKeyInput.value) {
      apiKeyInput.value = "0000000000";
      alert("API key reset to default");
    }
    await fetch('http://127.0.0.1:8000/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username : username, apiKey : apiKeyInput.value })
    });
    userPage.classList.add('hidden');
    accountAction.classList.remove('hidden');
    apiKeyInput.value = '';
  });
});