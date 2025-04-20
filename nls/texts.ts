import txt from './locales/pl.json';
export { txt };

export type Translations = {
    title: string;
    rules: string;
    typer: string;
    account: string;
    results: string;
    login: {
        header: string;
        noAccountText: string;
    };
    register: {
        header: string;
        hasAccountText: string;
        passwordMismatch: string;
    };
    forms: {
        fillAllInfo: string;
        username: string;
        email: string;
        password: string;
        repeatPassword: string;
        send: string;
        name: string;
        description: string;
        deadline: string;
    };
    events: {
        title: string;
        page: string;
        from: string;
        deadline: string;
        notFound: string;
        newEvent: string;
        createHeader: string;
    };
    fetchErrorText: string;
    goToEvent: string;
    overdueText: string;
    typerTitleText: string;
    editAnswer: string;
    addAnswer: string;
    searchText: string;
};
