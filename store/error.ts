import { create } from 'zustand';

interface ErrorStore {
    isDialogVisible: boolean;
    errorMessage: string;
    showErrorDialog: (msg?: string) => void;
    hideErrorDialog: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
    isDialogVisible: false,
    errorMessage: '',
    showErrorDialog: (msg?: string) => {
        set({ isDialogVisible: true, errorMessage: msg ?? '' });
    },
    hideErrorDialog: () => {
        set({ isDialogVisible: false, errorMessage: '' });
    },
}));
