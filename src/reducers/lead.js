
const initialState = {}

// Reducer for handling lead actions
export function lead(state = initialState, action) {
    switch (action.type) {
        // initial DTO load for lead data
        case 'LEAD.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })

        // called when a new appointment is booked
        case "LEAD.APPOINTMENT_BOOKED":
            return {
                ...state,
                appointments: [ ...state.appointments, action.data]
            }

        // called when user updates lead's optout preferences
        case "LEAD.UPDATE_CONTACT_PREFERENCES":
            let contactPreferences = { ...state.contact_preferences }
            let logContactPreferences = [ ...state.log_optouts]
            const newLog = {
                field: action.data.field,
                old_value: contactPreferences[action.data.field] ? "1" : "0",
                new_value: action.data.value,
                created_at: action.data.timestamp,
                created_by: action.data.user_label
            }
            logContactPreferences.push(newLog)
            contactPreferences[action.data.field] = action.data.value === "1"
            return {
                ...state,
                contact_preferences: contactPreferences,
                log_optouts: logContactPreferences
            }

        // called when user updates lead's demographic information
        case "LEAD.UPDATE_DETAILS":
            // action.data is an object with only updated fields
            const newDetails = Object.assign({}, state.details, { ...action.data })

            // push any new changelog items
            let newLogs = [ ...state.changelogs]
            if (action.logs.length > 0) {
                newLogs.push(...action.logs)
            }
            
            let newState = {
                ...state,
                details: newDetails,
                changelogs: newLogs
            }

            // add any new region data
            if (action.regionData !== undefined) {
                newState.region_id = action.regionData.region_id
                newState.region = action.regionData.region
            }
            return newState

        // called when user sends an esignature notice to the lead
        case "LEAD.DOCUSIGN.SENT":
            const newEnvelopes = [ action.data, ...state.docusign]
            return {
                ...state,
                docusign: newEnvelopes
            }

        // called when user updates one of their previous notes
        case "LEAD.NOTE_UPDATED":
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

        // called when user saves a new note
        case "LEAD.NOTE_SAVED":
            return {
                ...state,
                notes: [ ...state.notes, action.data]
            }

        // called when user deletes one of their notes
        case "LEAD.NOTE_DELETED":
            return {
                ...state,
                notes: state.notes.filter( note => {
                    return note.id !== action.data.noteID
                })
            }

        // called when user saves updates to client responses
        case "LEAD.CLIENT_RESPONSES.UPDATED":
            const newResponses = state.client_responses.map( existingResponse => {
                // if the questionable ID is contained in changedResponses, let's replace this questionable's data
                const overWriteResponse = action.data.changedResponses.find(changedResponse => changedResponse.questionable_id === existingResponse.questionable_id)
                let newResponse = {...existingResponse}
                if (overWriteResponse === undefined) return newResponse // no change to this questionable, keep the existing one

                // map text answer or answer_ids from changedResponse into newResponse
                if (overWriteResponse.answer !== undefined) {
                    newResponse.answer = overWriteResponse.answer
                } else {
                    newResponse.answer_id = overWriteResponse.answers.map(answer => answer.answer_id)
                }
                return newResponse
            })

            return {
                ...state,
                client_responses: newResponses
            }

        // called when agents sends lead an SMS message
        case "LEAD.TEXT_SENT":
            return {
                ...state,
                texts: [ ...state.texts, action.data]
            }

        // called when agents sends lead an SMS message
        case "LEAD.EMAIL_SENT":
            return {
                ...state,
                emails: [ ...state.emails, action.data]
            }

        // called when appointments get reloaded from backend
        case "LEAD.APPOINTMENTS_LOADED":
            return {
                ...state,
                appointments: action.data.appointments,
                appointment_logs: action.data.appointment_logs
            }

        // called when an appointment confirmation status changes
        case "APPOINTMENT.CONFIRMED":
            const newConfirmedAppointments = state.appointments.map( appt => {
                if (appt.id === action.data.appointmentID) {
                    return { ...appt, confirmed: action.data.confirmedState}
                }
                return { ...appt}
            })

            const newConfirmedLogs = [ ...state.appointment_logs]
            newConfirmedLogs.push(action.data.newLog)
            return {
                ...state,
                appointments: newConfirmedAppointments,
                appointment_logs: newConfirmedLogs
            }

        // called when an appointment gets a verified start time
        case "APPOINTMENT.VERIFIED":
            const newVerifiedAppointments = state.appointments.map( appt => {
                if (appt.id === action.data.appointmentID) {
                    return { 
                        ...appt, 
                        appointment_status_id: action.data.newStatusID, 
                        start_time: action.data.newStartTime
                    }
                }
                return { ...appt}
            })

            const newVerifiedLogs = [ ...state.appointment_logs]
            newVerifiedLogs.push(action.data.newLogs)
            return {
                ...state,
                appointments: newVerifiedAppointments,
                appointment_logs: newVerifiedLogs
            }

        // called when an appointment status changes
        case "APPOINTMENT.STATUS_UPDATED":
            const newStatusAppointments = state.appointments.map( appt => {
                if (appt.id === action.data.appointmentID) {
                    return { ...appt, appointment_status_id: action.data.newStatusID}
                }
                return { ...appt}
            })

            const newStatusLogs = [ ...state.appointment_logs]
            newStatusLogs.push(action.data.newLog)
            return {
                ...state,
                appointments: newStatusAppointments,
                appointment_logs: newStatusLogs
            }

        // called when an interaction first starts, we need to put it into the lead data
        case "INTERACTION.LOAD":
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
