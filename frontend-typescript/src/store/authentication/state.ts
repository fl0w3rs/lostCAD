export interface AuthenticationStateInterface {
  status: boolean;
  socketInitialized: boolean;
}

function state(): AuthenticationStateInterface {
  return {
    status: false,
    socketInitialized: false,
  };
}

export default state;
