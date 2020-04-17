
const initialState = {
    leadID: 0
  }

// Reducer for handling auth actions
export function preview(state = initialState, action) {
    switch (action.type) {
        case 'PREVIEW.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })
        default:
            return state
    }
}