import { Dispatch, SetStateAction, useCallback, useState } from 'react';

const useToggle = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback(() => {
    setValue(!value);
  }, [value]);
  return [value, handler, setValue];
};

export default useToggle;
