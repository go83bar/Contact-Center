

const initialState = {}

// Reducer for handling lead actions
export function lead(state = initialState, action) {
    switch (action.type) {
        case 'LEAD.LOAD':
            // initial DTO load for lead data
            return Object.assign({}, state, {
                ...action.payload
            })

        case "LEAD.UPDATE_CONTACT_PREFERENCES":
            // called when user updates lead's optout preferences
            const contactPreferences = { ...state.contact_preferences }
            contactPreferences[action.data.field] = action.data.value
            return {
                ...state,
                contact_preferences: contactPreferences
            }

        case "LEAD.NOTE_UPDATED":
            // called when user updates one of their previous notes
            const notes = [ ...state.notes ]

            const newNotes = notes.map( note => {
                if (note.id === action.data.noteID) {
                    note.content = action.data.noteContent
                }
                return note
            })

            return {
                ...state,
                notes: newNotes
            }

        case "LEAD.NOTE_SAVED":
            // called when user saves a new note
            return {
                ...state,
                notes: [ ...state.notes, action.data]
            }

        case "LEAD.NOTE_DELETED":
            // called when user deletes one of their notes
            return {
                ...state,
                notes: state.notes.filter( note => {
                    return note.id !== action.data.noteID
                })
            }
    
    
        default:
            return state
    }
}
