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

    let createAccount;
    function toLoginForm(shouldCreateAccount) {
        accountAction.classList.add('hidden');
        loginForm.classList.remove('hidden');
        createAccount = shouldCreateAccount;
    }
    haveAccountBtn.addEventListener('click', function() {toLoginForm(false)});
    createAccountBtn.addEventListener('click', function() {toLoginForm(true);});

    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        // TODO: add validation api
        loginForm.classList.add('hidden');
        userPage.classList.remove('hidden');
        userGreeting.textContent = `Hi, ${usernameInput.value}`;
        usernameInput.value = '';
        passwordInput.value = '';
    });

    logoutBtn.addEventListener('click', function() {
        userPage.classList.add('hidden');
        accountAction.classList.remove('hidden');
    });
});