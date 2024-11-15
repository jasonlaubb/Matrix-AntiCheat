export default {
    disableConsoleOutput: false,
    modules: {
        antiFly: true,
        firewall: true,
    } as { [key: string]: boolean },
    command: {
        about: true,
    } as { [key: string]: boolean },
};
