/* eslint-disable eqeqeq */
/*
export function someGetter (state) {
}
*/
export const getSelectedIdentifier = (state) => state.selected;
export const getSelectedIdentifierObject = (state) => {
  for (let i = 0; i < state.list.length; i += 1) {
    if (state.list[i].id == state.selected) {
      return state.list[i];
    }
  }
  return null;
};

export const getAllIdentifiers = (state) => state.list;
