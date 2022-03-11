import * as Actions from '../../actions/main/index';

const initialState = {
  tasks: [],
  options: [],
  approveOptions: [],
  addTermOptions: [],
  exactTermOptions: [],
  equivTermOptions: [],
  disputedOptions: [],
  qualityItem: [],
  structureItem: [],
};

export default (state = initialState, action) => {
  switch(action.type) {
    case Actions.SET_TASKS:
      return {...state, tasks: action.payload };
    case Actions.SET_OPTIONS:
      return {...state, options: action.payload };
    case Actions.SET_APPROVE_OPTIONS:
      return {...state, approveOptions: action.payload };
    case Actions.SET_ADDTERM_OPTIONS:
      return {...state, addTermOptions: action.payload };
    case Actions.SET_EXACTTERM_OPTIONS:
      return {...state, exactTermOptions: action.payload};
    case Actions.SET_EQUIVTERM_OPTIONS:
      return {...state, equivTermOptions: action.payload};
      case Actions.SET_DISPUTED_OPTIONS:
        return {...state, disputedOptions: action.payload};
      case Actions.SET_QUALITY_ITEM:
        return {...state, qualityItem: action.payload};
      case Actions.SET_STRUCTURE_ITEM:
        return {...state, structureItem: action.payload};
    default:
      return state;
  }
};
