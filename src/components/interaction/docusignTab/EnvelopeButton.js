import React, { useState } from "react";
import DocumentAPI from "../../../api/documentAPI";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const EnvelopeButton = ({ id, currentStatuses }) => {
  const dispatch = useDispatch();

  const [isClicked, setIsClicked] = useState(false);
  const localization = useSelector(
    (state) => state.localization.interaction.docusign
  );
  const localizationToast = useSelector(
    (state) => state.localization.toast.docusign
  );

  const updateEnvelopeStatus = (newStatus) => {
    // handle double-clicks
    if (isClicked) {
      return false;
    }
    setIsClicked(true);

    // build payload and send API request
    const docusignParams = {
      envelopeID: id,
      newStatus: newStatus,
    };

    DocumentAPI.updateDocusignStatus(docusignParams)
      .then((response) => {
        if (response.success) {
          // set new resent time on envelope in redux
          dispatch({
            type: "LEAD.DOCUSIGN.UPDATE_STATUS",
            data: {
              envelopeID: id,
              newStatus: response.new_status,
            },
          });
          setIsClicked(false);

          // notify user
          toast.success(localizationToast.updateStatusSuccess);
        } else {
          toast.error(localizationToast.updateStatusError);
          console.log("Send Template error: ", response);
        }
      })
      .catch((error) => {
        toast.error(localizationToast.updateStatusError);
        console.log("Could not send template: ", error);
      });
  };
  let buttonArray = [];
  switch (currentStatuses.length) {
    case 0:
      buttonArray = [
        { buttonName: localization.verifyButtonLabel, type: "Verified" },
        { buttonName: localization.rejectButtonLabel, type: "Rejected" },
      ];
      break;
    case 1:
      if (currentStatuses[0].type === "Verified")
        buttonArray = [
          { buttonName: localization.amendButtonLabel, type: "Amended" },
        ];
      break;
    default:
      buttonArray = [];
  }

  if (isClicked) return <div>{localization.updatingText}</div>;
  return (
    <div style={{ display: "flex", marginBottom: 10, marginLeft: 20 }}>
      {buttonArray.map((obj) => {
        return (
          <a
            onClick={() => updateEnvelopeStatus(obj.type)}
            style={{
              margin: 5,
              padding: 10,
              color: "white",
              background:
                obj.buttonName === localization.verifyButtonLabel
                  ? "#43C7B7"
                  : obj.buttonName === localization.amendButtonLabel
                  ? "orange"
                  : "#d32f2f",
              borderRadius: 20,
              fontWeight: "bold",
            }}
          >
            {obj.buttonName}
          </a>
        );
      })}
    </div>
  );
};

export default EnvelopeButton;
