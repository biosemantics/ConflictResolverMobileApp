export const SET_TASKS = '[DATA] SET TASKS';
export const SET_OPTIONS = '[DATA] SET OPTIONS';
export const SET_APPROVE_OPTIONS = '[DATA] SET APPROVE OPTIONS';
export const SET_ADDTERM_OPTIONS = '[DATA] SET ADDTERM OPTIONS';
export const SET_EXACTTERM_OPTIONS = '[DATA] SET EXACTTERM OPTIONS';
export const SET_EQUIVTERM_OPTIONS = '[DATA] SET EQUIVTERM OPTIONS';
export const SET_DISPUTED_OPTIONS = '[DATA] SET DISPUTED OPTIONS';
export const SET_QUALITY_ITEM = '[DATA] SET QUALITY ITEM';
export const SET_STRUCTURE_ITEM = '[DATA] SET STRUCTURE ITEM';

export const set_tasks = (tasks) => {
  return (dispatch) => {
    dispatch({type: SET_TASKS, payload: tasks});
  };
};

export const set_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_OPTIONS, payload: options});
  };
};

export const set_approve_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_APPROVE_OPTIONS, payload: options});
  };
};

export const set_addTerm_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_ADDTERM_OPTIONS, payload: options});
  };
};

export const set_exactTerm_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_EXACTTERM_OPTIONS, payload: options});
  };
};

export const set_equivTerm_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_EQUIVTERM_OPTIONS, payload: options});
  };
};

export const set_disputed_options = (options) => {
  return (dispatch) => {
    dispatch({type: SET_DISPUTED_OPTIONS, payload: options});
  };
};

export const set_quality_item = (options) => {
  return (dispatch) => {
    dispatch({type: SET_QUALITY_ITEM, payload: options});
  };
};

export const set_structure_item = (options) => {
  return (dispatch) => {
    dispatch({type: SET_STRUCTURE_ITEM, payload: options});
  };
};