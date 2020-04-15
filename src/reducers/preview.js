
const initialState = {
    leadID: 0
  }

// Reducer for handling auth actions
export function preview(state = initialState, action) {
switch (action.type) {
    case 'LOAD_PREVIEW':
        return {
            ...state,
            leadID: action.payload.leadID,
            callQueueID: action.payload.callQueueID
        }
    default:
        return state
}
}