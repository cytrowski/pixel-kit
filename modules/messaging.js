export const makeMessaging = () => {
  const listeners = {};
  const getUUID = ((x = 1) => () => x++)();
  const dispatch = message => {
    console.log("dispatch", message);
    Object.values(listeners).forEach(listener => listener(message));
  };
  const subscribe = listener => {
    const uuid = getUUID();
    listeners[uuid] = listener;
    return () => {
      delete listeners[uuid];
    };
  };

  return {
    dispatch,
    subscribe
  };
};
