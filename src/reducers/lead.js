const initialState = {};

// Reducer for handling lead actions
export function lead(state = initialState, action) {
  switch (action.type) {
    // initial DTO load for lead data
    case "LEAD.LOAD":
      return Object.assign({}, state, {
        ...action.payload,
      });

    // called when a new appointment is booked
    case "LEAD.APPOINTMENT_BOOKED":
      return {
        ...state,
        appointments: [...state.appointments, action.data],
      };

    // called when user updates lead's optout preferences
    case "LEAD.UPDATE_CONTACT_PREFERENCES":
      let contactPreferences = { ...state.contact_preferences };
      let logContactPreferences = [...state.log_optouts];
      const newLog = {
        field: action.data.field,
        old_value: contactPreferences[action.data.field] ? "1" : "0",
        new_value: action.data.value,
        created_at: action.data.timestamp,
        created_by: action.data.user_label,
      };
      logContactPreferences.push(newLog);
      contactPreferences[action.data.field] = action.data.value === "1";
      return {
        ...state,
        contact_preferences: contactPreferences,
        log_optouts: logContactPreferences,
      };

    // called when user updates lead's demographic information
    case "LEAD.UPDATE_DETAILS":
      // action.data is an object with only updated fields
      const newDetails = Object.assign({}, state.details, { ...action.data });

      // push any new changelog items
      let newLogs = [...state.changelogs];
      if (action.logs.length > 0) {
        newLogs.push(...action.logs);
      }

      let newState = {
        ...state,
        details: newDetails,
        changelogs: newLogs,
      };

      // add any new region data
      if (action.regionData !== undefined) {
        newState.region_id = action.regionData.region_id;
        newState.region = action.regionData.region;
      }
      return newState;

    // called when user sends an esignature notice to the lead
    case "LEAD.DOCUSIGN.SENT":
      const newEnvelopes = [action.data, ...state.docusign];
      return {
        ...state,
        docusign: newEnvelopes,
      };

    // called when user sends an esignature notice to the lead
    case "LEAD.DOCUSIGN.RESENT":
      let resentEnvelopes = state.docusign.map((envelope) => {
        if (envelope.id === action.data.envelopeID) {
          return { ...envelope, resent_at: action.data.resendTime };
        }
        return { ...envelope };
      });

      return {
        ...state,
        docusign: resentEnvelopes,
      };

    case "LEAD.DOCUSIGN.UPDATE_STATUS":
      let updateStatuses = state.docusign.map((envelope) => {
        if (envelope.id === action.data.envelopeID) {
          envelope.statuses.push(action.data.newStatus);
          return { ...envelope };
        }
        return { ...envelope };
      });

      return {
        ...state,
        docusign: updateStatuses,
      };

    case "LEAD.LAB_ORDERS.ADD_LAB_ORDER":
      return {
        ...state,
        lab_orders: [action.data.newLabOrder, ...state.lab_orders],
      };

    case "LEAD.LAB_ORDERS.DELETE_LAB_ORDER":
      let deleteLabOrder = state.lab_orders.filter(
        (obj) => obj.id !== action.data.id
      );
      return {
        ...state,
        lab_orders: deleteLabOrder,
      };

    case "LEAD.LAB_ORDERS.CONFIRM_LAB_ORDER":
      let confirmedLabOrder = state.lab_orders.map((envelope) => {
        if (envelope.id === action.data.envelopeID) {
          console.log(envelope.id, action.data.envelopeID);
          envelope.deleteable = false;
        }
        return { ...envelope };
      });
      return {
        ...state,
        lab_orders: confirmedLabOrder,
      };

    // called when user updates lead's region
    case "LEAD.REGION_UPDATED":
      // create timeline entry
      const newChangeLog = {
        field: "region_id",
        old_value: state.region_id,
        new_value: action.data.regionID,
        interaction_id: action.data.interactionID,
        created_by: action.data.createdBy,
        created_at: action.data.time,
      };
      return {
        ...state,
        region_id: action.data.regionID,
        region: action.data.newRegion,
        changelogs: [newChangeLog, ...state.changelogs],
      };

    // called when the lead's number is rejected by twilio
    case "LEAD.BAD_NUMBER":
      const fieldName = action.data.fieldName;
      const newLeadDetails = { ...state.details };
      newLeadDetails[fieldName] = null;
      return {
        ...state,
        details: newLeadDetails,
        changelogs: [...state.changelogs, action.data.newLogItem],
      };

    // called when user updates one of their previous notes
    case "LEAD.NOTE_UPDATED":
      const newNotes = state.notes.map((note) => {
        if (note.id === action.data.noteID) {
          return {
            ...note,
            content: action.data.noteContent,
          };
        }

        return note;
      });

      return {
        ...state,
        notes: newNotes,
      };

    // called when user saves a new note
    case "LEAD.NOTE_SAVED":
      return {
        ...state,
        notes: [...state.notes, action.data],
      };

    // called when user deletes one of their notes
    case "LEAD.NOTE_DELETED":
      return {
        ...state,
        notes: state.notes.filter((note) => {
          return note.id !== action.data.noteID;
        }),
      };

    // called when lead reward is resent
    case "LEAD.REWARD_RESENT":
      const newRewards = state.rewards.map((existingReward) => {
        if (action.data.rewardID === existingReward.id) {
          return {
            ...existingReward,
            last_resent_at: action.data.lastResentAt,
            last_sent_to: action.data.sentTo,
            resendable: false,
          };
        }

        return existingReward;
      });

      const newResend = {
        reward_campaign: action.data.campaign,
        interaction_id: action.data.interactionID,
        sent_to: action.data.sentTo,
        created_at: action.data.lastResentAt,
      };

      const newResends = [...state.reward_resends, newResend];

      return {
        ...state,
        rewards: newRewards,
        reward_resends: newResends,
      };

    // called when user saves updates to client responses
    case "LEAD.CLIENT_RESPONSES.UPDATED":
      const newResponses = state.client_responses.map((existingResponse) => {
        // if the questionable ID is contained in changedResponses, let's replace this questionable's data
        const overWriteResponse = action.data.changedResponses.find(
          (changedResponse) =>
            changedResponse.questionable_id === existingResponse.questionable_id
        );
        let newResponse = { ...existingResponse };
        if (overWriteResponse === undefined) return newResponse; // no change to this questionable, keep the existing one

        // map text answer or answer_ids from changedResponse into newResponse
        if (overWriteResponse.answer !== undefined) {
          newResponse.answer = overWriteResponse.answer;
        } else {
          newResponse.answer_id = overWriteResponse.answers.map(
            (answer) => answer.answer_id
          );
        }
        return newResponse;
      });

      return {
        ...state,
        client_responses: newResponses,
      };

    // called when agents sends lead an SMS message
    case "LEAD.TEXT_SENT":
      return {
        ...state,
        texts: [...state.texts, action.data],
      };

    // called when agents sends lead an SMS message
    case "LEAD.EMAIL_SENT":
      return {
        ...state,
        emails: [...state.emails, action.data],
      };

    // called when an email_summary gets marked as current
    case "LEAD.EMAIL_CURRENT":
      let newEmailValue = state.details.email;
      const newSummaryEmails = state.email_summary.map((summary) => {
        let isCurrent = 0;
        if (summary.id === action.payload) {
          isCurrent = 1;
          newEmailValue = summary.email_address;
        }
        return { ...summary, is_current: isCurrent };
      });
      const newEmailDetails = { ...state.details, email: newEmailValue };

      return {
        ...state,
        details: newEmailDetails,
        email_summary: newSummaryEmails,
      };

    // called when a lead has 2 current emails and we're demarking one of them
    case "LEAD.EMAIL_UNMARKED":
      let newMarkedEmailValue = state.details.email;
      const newMarkedEmails = state.email_summary.map((summary) => {
        let isCurrent = summary.is_current;
        if (summary.id === action.payload) {
          isCurrent = 0;
        } else if (isCurrent === 1) {
          // set the other current email into lead details if it isn't already
          newMarkedEmailValue = summary.email_address;
        }
        return { ...summary, is_current: isCurrent };
      });

      return {
        ...state,
        details: { ...state.details, email: newMarkedEmailValue },
        email_summary: newMarkedEmails,
      };

    // called when an email_summary gets validated
    case "LEAD.EMAIL_VALIDATED":
      const newSummary = {
        id: action.payload.summaryID,
        is_current: action.payload.isCurrent,
        is_usable: action.payload.isUsable,
        email_address: action.payload.emailAddress,
      };
      let updatedSummaryEmails = [];
      let updatedContactDetails = { ...state.details };

      let isUpdate = false;
      updatedSummaryEmails = state.email_summary.map((summary) => {
        if (summary.id === newSummary.id) {
          // we updated this existing summary, replace with the new one
          isUpdate = true;
          if (newSummary.is_current) {
            // set contact details value if this new one is current
            updatedContactDetails.email = newSummary.email_address;
          }
          return newSummary;
        }

        // for other summaries, we just need to set their is_current back to 0 if newSummary is now current
        return {
          ...summary,
          is_current: newSummary.is_current ? 0 : summary.is_current,
        };
      });

      if (isUpdate) {
        // we just updated an existing one, and we aren't resorting, so do nothing?
        console.log("Lori was here, testing emails for your sins");
      } else if (action.payload.isCurrent === 1) {
        // set value in current email
        updatedContactDetails.email = action.payload.emailAddress;

        // remove current setting from all existing emails
        updatedSummaryEmails = state.email_summary.map((summary) => {
          return { ...summary, is_current: 0 };
        });

        // add this new one to the front of the array
        updatedSummaryEmails.unshift(newSummary);
      } else {
        updatedSummaryEmails = [...state.email_summary];
        updatedSummaryEmails.push(newSummary);
      }

      return {
        ...state,
        email_summary: updatedSummaryEmails,
        details: updatedContactDetails,
      };

    // called when appointments get reloaded from backend
    case "LEAD.APPOINTMENTS_LOADED":
      return {
        ...state,
        appointments: action.data.appointments,
        appointment_logs: action.data.appointment_logs,
      };

    // called when an appointment confirmation status changes
    case "APPOINTMENT.CONFIRMED":
      const newConfirmedAppointments = state.appointments.map((appt) => {
        if (appt.id === action.data.appointmentID) {
          return { ...appt, confirmed: action.data.confirmedState };
        }
        return { ...appt };
      });

      const newConfirmedLogs = [...state.appointment_logs];
      newConfirmedLogs.push(action.data.newLog);
      return {
        ...state,
        appointments: newConfirmedAppointments,
        appointment_logs: newConfirmedLogs,
      };

    // called when an appointment gets a verified start time
    case "APPOINTMENT.VERIFIED":
      const newVerifiedAppointments = state.appointments.map((appt) => {
        if (appt.id === action.data.appointmentID) {
          return {
            ...appt,
            appointment_status_id: action.data.newStatusID,
            start_time: action.data.newStartTime,
          };
        }
        return { ...appt };
      });

      const newVerifiedLogs = [...state.appointment_logs];
      newVerifiedLogs.push(action.data.newLogs);
      return {
        ...state,
        appointments: newVerifiedAppointments,
        appointment_logs: newVerifiedLogs,
      };

    // called when an appointment status changes
    case "APPOINTMENT.STATUS_UPDATED":
      const newStatusAppointments = state.appointments.map((appt) => {
        if (appt.id === action.data.appointmentID) {
          return { ...appt, appointment_status_id: action.data.newStatusID };
        }
        return { ...appt };
      });

      const newStatusLogs = [...state.appointment_logs];
      newStatusLogs.push(action.data.newLog);
      return {
        ...state,
        appointments: newStatusAppointments,
        appointment_logs: newStatusLogs,
      };

    // called when an interaction first starts, we need to put it into the lead data
    case "INTERACTION.LOAD":
      return {
        ...state,
        interactions: [...state.interactions, action.payload],
      };

    case "INTERACTION.END":
    case "USER.LOG_OUT":
      return initialState;

    default:
      return state;
  }
}
