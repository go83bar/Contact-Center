

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

        case "LEAD.UPDATE_DETAILS":
            // called when user updates lead's contact information
            // action.data is an object with only updated fields
            const newDetails = Object.assign({}, state.details, { ...action.data })
            return {
                ...state,
                details: newDetails
            }

        case "LEAD.NOTE_UPDATED":
            // called when user updates one of their previous notes
            const newNotes = state.notes.map( note => {
                if (note.id === action.data.noteID) {
                    return {
                        ...note,
                        content: action.data.noteContent
                    }
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

        case "LEAD.TEXT_SENT":
            // called when agents sends lead an SMS message
            return {
                ...state,
                texts: [ ...state.texts, action.data]
            }

        case "LEAD.EMAIL_SENT":
            // called when agents sends lead an SMS message
            return {
                ...state,
                emails: [ ...state.emails, action.data]
            }

        case "INTERACTION.LOAD":
            // called when an interaction first starts, we need to put it into the lead data
            return {
                ...state,
                interactions: [ ...state.interactions, action.payload]
            }
        case "INTERACTION.END":
            return {}

        default:
            return state
    }
}
