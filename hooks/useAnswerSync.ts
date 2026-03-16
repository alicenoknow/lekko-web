import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

export function useAnswerSync<T>(
    savedValue: T | null | undefined,
    onChanged: (value: T) => void
): [T | null, Dispatch<SetStateAction<T | null>>] {
    const [value, setValue] = useState<T | null>(null);
    const onChangedRef = useRef(onChanged);
    onChangedRef.current = onChanged;

    useEffect(() => {
        if (savedValue != null) setValue(savedValue);
    }, [savedValue]);

    useEffect(() => {
        if (value != null && value !== savedValue) {
            onChangedRef.current(value);
        }
    }, [value, savedValue]);

    return [value, setValue];
}
