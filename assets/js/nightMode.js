var cookieName = 'nightMode';
var isNightMode = false;

window.onload = () => {

    nightModeCookie = getCookie(cookieName);

    console.log(nightModeCookie);

    if (!nightModeCookie) {
        setCookie(cookieName, isNightMode);
    } else {
        isNightMode = nightModeCookie.value;
    }
};