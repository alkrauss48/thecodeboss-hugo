const DEFAULT_OPEN_STATE = false;

let _isOpen = DEFAULT_OPEN_STATE;

const isOpen = () => _isOpen;

const setIsOpen = (value: boolean) => _isOpen = value;

const reset = () => _isOpen = DEFAULT_OPEN_STATE;

export default {
  isOpen,
  reset,
  setIsOpen,
};
