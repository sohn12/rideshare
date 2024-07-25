const loginForm = document.getElementById('login-form');
const id = document.getElementById('id');
// const password = document.getElementById('password');

const onLogin = async (e) => {
    e.preventDefault();
    const loginType = document.querySelector('input[name="loginType"]:checked').value;
    const isDriver = loginType === 'driver';

    logIn(id.value, isDriver)
};

loginForm.addEventListener('submit', onLogin);