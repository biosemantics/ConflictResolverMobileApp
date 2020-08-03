import * as Actions from '../../actions/main/index';

const initialState = {
  quality: [],
  structure: [],
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.SET_QUALITY:
      return {...state, quality: action.payload };
    case Actions.SET_STRUCTURE:
      console.log(action.payload);
      return {...state, structure: action.payload };
    default:
      return state;
  }
};
