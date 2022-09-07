import React, { useState } from "react";
import { MDBBox, MDBBtn, MDBCard } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle as faCircleSolid,
  faFile,
} from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import DocumentAPI from "../../../api/documentAPI";
import { toast } from "react-toastify";
import EnvelopeButton from "./EnvelopeButton";

const Envelope = ({ envelope }) => {
  const timezone = useSelector((state) => state.lead.details.timezone);
  const localization = useSelector(
    (state) => state.localization.interaction.docusign
  );
  const resendSuccessMessage = useSelector(
    (state) => state.localization.toast.docusign.resendSuccess
  );
  const resendErrorMessage = useSelector(
    (state) => state.localization.toast.docusign.resendError
  );
  const dispatch = useDispatch();

  const [isResending, setIsResending] = useState(false);
  const [resendBtnLabel, setResendBtnLabel] = useState();
  // localization.
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateBtnLabel, setUpdateBtnLabel] = useState(
    localization.resendButtonLabel
  );

  const resendEnvelope = () => {
    // handle double-clicks
    if (isResending) {
      return false;
    }
    setIsResending(true);
    setResendBtnLabel(localization.resendingButtonLabel);

    // build payload and send API request
    const docusignParams = {
      envelopeID: envelope.id,
    };

    DocumentAPI.resendDocusign(docusignParams)
      .then((response) => {
        if (response.success) {
          // set new resent time on envelope in redux
          dispatch({
            type: "LEAD.DOCUSIGN.RESENT",
            data: {
              envelopeID: envelope.id,
              resendTime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
            },
          });
          // notify user
          setResendBtnLabel(localization.resentButtonLabel);
          toast.success(resendSuccessMessage);
        } else {
          toast.error(resendErrorMessage);
          console.log("Send Template error: ", response);
        }
      })
      .catch((error) => {
        toast.error(resendErrorMessage);
        console.log("Could not send template: ", error);
      });
  };
  console.log(envelope.statuses);
  return (
    <MDBCard className="d-flex w-100 shadow-sm border-0 mb-2">
      <MDBBox className="d-flex backgroundColorInherit skin-border-primary f-m w-100">
        <div className="d-flex p-1 px-3 w-100">
          <span className="fa-layers fa-fw fa-3x mt-2">
            <FontAwesomeIcon icon={faCircleSolid} className="text-white" />
            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"} />
            <FontAwesomeIcon
              icon={faFile}
              transform={"shrink-8"}
              className={"darkIcon"}
            />
          </span>
          <div className="d-flex p-2 text-left w-75">
            <div>
              <span className="f-l">{envelope.name}</span>
              {envelope.completed_at === null &&
                envelope.declined_at === null &&
                envelope.voided_at === null && (
                  <span>
                    <MDBBtn
                      color="primary"
                      className="my-1 mr-0 py-1 px-2 z-depth-0"
                      size="sm"
                      rounded
                      disabled={isResending}
                      onClick={resendEnvelope}
                    >
                      {resendBtnLabel}
                    </MDBBtn>
                  </span>
                )}
              <div style={{ margin: 5 }}>
                {envelope.statuses.map((status, i) => {
                  return (
                    <div key={i} style={{ paddingBottom: 10 }}>
                      <div style={{ fontSize: 16 }}>
                        <span
                          style={{
                            color:
                              status.type === "Verified"
                                ? "#43C7B7"
                                : status.type === "Amended"
                                ? "orange"
                                : "#d32f2f",
                            fontWeight: "bold",
                          }}
                        >
                          {status.type}{" "}
                        </span>
                        by <span>{status.user}</span>
                      </div>
                      <div style={{ fontSize: 14 }}>{status.created_at}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column f-s justify-content-start p-2 w-25 text-right">
            <span>
              {localization.sentAtLabel}
              <span className="font-weight-bold">
                {moment.utc(envelope.sent_at).tz(timezone).format("MMM D")}
              </span>
              , {moment.utc(envelope.sent_at).tz(timezone).format("h:mm a z")}
            </span>
            {envelope.resent_at !== null && (
              <span>
                {localization.resentAtLabel}
                <span className="font-weight-bold">
                  {moment.utc(envelope.resent_at).tz(timezone).format("MMM D")}
                </span>
                ,{" "}
                {moment.utc(envelope.resent_at).tz(timezone).format("h:mm a z")}
              </span>
            )}
            {envelope.opened_at !== null && (
              <span>
                {localization.openedAtLabel}
                <span className="font-weight-bold">
                  {moment.utc(envelope.opened_at).tz(timezone).format("MMM D")}
                </span>
                ,{" "}
                {moment.utc(envelope.opened_at).tz(timezone).format("h:mm a z")}
              </span>
            )}
            {envelope.completed_at !== null && (
              <span>
                {localization.completedAtLabel}
                <span className="font-weight-bold">
                  {moment
                    .utc(envelope.completed_at)
                    .tz(timezone)
                    .format("MMM D")}
                </span>
                ,{" "}
                {moment
                  .utc(envelope.completed_at)
                  .tz(timezone)
                  .format("h:mm a z")}
              </span>
            )}
            {envelope.declined_at !== null && (
              <span>
                {localization.declinedAtLabel}
                <span className="font-weight-bold">
                  {moment
                    .utc(envelope.declined_at)
                    .tz(timezone)
                    .format("MMM D")}
                </span>
                ,{" "}
                {moment
                  .utc(envelope.declined_at)
                  .tz(timezone)
                  .format("h:mm a z")}
              </span>
            )}
            {envelope.voided_at !== null && (
              <span>
                {localization.voidedAtLabel}
                <span className="font-weight-bold">
                  {moment.utc(envelope.voided_at).tz(timezone).format("MMM D")}
                </span>
                ,{" "}
                {moment.utc(envelope.voided_at).tz(timezone).format("h:mm a z")}
              </span>
            )}
          </div>
        </div>
      </MDBBox>
      {envelope.completed_at && (
        <EnvelopeButton id={envelope.id} currentStatuses={envelope.statuses} />
      )}
    </MDBCard>
  );
};

export default Envelope;
