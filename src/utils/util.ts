/**
 * Capitalizes a string
 * @param str
 */
export const capitalize = (str = '') => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const setTabBarVisibility = () => {
    let tabsVisible = false;
    switch (window.location.pathname) {
        case '/estates':
            tabsVisible = true;
            break;

        default:
            break;
    }
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = tabsVisible ? 'flex' : 'none';
    }
};

export const showTabBar = (): void => {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = 'flex';
    }
};

export const hideTabBar = (): void => {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = 'none';
    }
};
