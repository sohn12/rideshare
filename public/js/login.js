const loginForm = document.getElementById('login-form');
const id = document.getElementById('id');

const onLogin = async (e) => {
    e.preventDefault();
    const loginType = document.querySelector('input[name="loginType"]:checked').value;
    const isDriver = loginType === 'driver';
    const isAdmin = loginType === 'admin';

    logIn(id.value, isDriver, isAdmin);
};

loginForm.addEventListener('submit', onLogin);