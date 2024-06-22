document.addEventListener('DOMContentLoaded', function() {
  const accountAction = document.getElementById('accountAction');
  const haveAccountBtn = document.getElementById('haveAccountBtn');
  const createAccountBtn = document.getElementById('createAccountBtn');
  const Form = document.getElementById('Form');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const formBtn = document.getElementById('formBtn');
  const subBtn = document.getElementById('subBtn');
  const userPage = document.getElementById('userPage');
  const userGreeting = document.getElementById('userGreeting');
  const apiKeyInput = document.getElementById('apiKeyInput');
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
    Form.classList.remove('hidden');
    createAccount = shouldCreateAccount;
  }
  haveAccountBtn.addEventListener('click', function() {toForm(false)});
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
        body: JSON.stringify({ create_account : createAccount, username : usernameInput.value, password : passwordInput.value })
      });
      
      const account = await login.json();
      if (account.success) {
        username = usernameInput.value;
        Form.classList.add('hidden');
        userPage.classList.remove('hidden');
        userGreeting.textContent = `Hi, ${username}`;
        apiKeyInput.textContent = account.key;
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

  logoutBtn.addEventListener('click', async(event) => {
    event.preventDefault();
    if (apiKeyInput.textContent) {
      await fetch('http://127.0.0.1:8000/record', {
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