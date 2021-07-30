export interface AuthenticationStateInterface {
  status: boolean;
}

function state(): AuthenticationStateInterface {
  return {
    status: false,
  };
}

export default state;
