export const demoTransition = {
  enter: 'transition-opacity duration-300 ease-in-out',
  enterFrom: 'opacity-0',
  enterTo: 'opacity-100',
  leave: 'transition-opacity duration-300 ease-in-out',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0'
};

export const buttonTransition = {
  hover: 'transition-transform duration-200 ease-in hover:scale-105',
  active: 'transition-transform duration-100 ease-in active:scale-95'
};

export const cardTransition = {
  hover: 'transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1'
};