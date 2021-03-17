/* eslint-disable eqeqeq */

export const getCharacterList = (state) => state.characterList;
export const getSelectedCharacterId = (state) => state.selectedCharacter;
export const getSelectedCharacter = (state) => {
  for (let i = 0; i < state.characterList.length; i += 1) {
    if (state.characterList[i].id == state.selectedCharacter) {
      return state.characterList[i];
    }
  }
  return null;
};
