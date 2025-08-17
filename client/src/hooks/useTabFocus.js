import { useEffect } from 'react';

export const useTabFocus = (onBlur) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onBlur();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [onBlur]);
};