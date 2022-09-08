import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LabOrderAPI from "../../../api/labOrderAPI";
import { toast } from "react-toastify";

const AddLabOrder = ({ setToggleAddLadOrderButton }) => {
  const dispatch = useDispatch();

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [reqNum, setReqNum] = useState("");

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const lead_id = useSelector((state) => state.lead.id);
  const addLabOrderSuccessMessage = useSelector(
    (state) => state.localization.toast.editLead.addLabOrderSuccess
  );
  const addLabOrderErrorMessage = useSelector(
    (state) => state.localization.toast.editLead.addLabOrderError
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("confirmation", file);
    formData.append("lead_id", lead_id);
    formData.append("requisition_number", reqNum);
    console.log(formData);
    LabOrderAPI.submitLabOrder(formData)
      .then((response) => {
        if (response.success) {
          // set new lab order in redux
          try {
            dispatch({
              type: "LEAD.LAB_ORDERS.ADD_LAB_ORDER",
              data: {
                newLabOrder: {
                  created_at: response.order.created_at,
                  created_by: response.order.created_by,
                  file_link: response.order.file_link,
                  id: response.order.id,
                  requisition_number: response.order.requisition_number,
                  deleteable: true,
                },
              },
            });
          } catch (err) {
            console.log(err);
          }

          setToggleAddLadOrderButton(false);
          //   // notify user
          toast.success(addLabOrderSuccessMessage);
        } else {
          toast.error(addLabOrderErrorMessage);
          console.log("Failed to add lab order: ", response);
        }
      })
      .catch((error) => {
        toast.error(addLabOrderErrorMessage);
        console.log("Failed to add lab order: ", error);
      });
    return;
  };

  return (
    <form onSubmit={onSubmit}>
      <div tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Lab Order
              </h5>
            </div>
            <div className="modal-body">
              <label style={{ display: "inline-block", minWidth: 120 }}>
                REQ #
              </label>
              <input
                type="text"
                id="lab-order-name"
                name="Lab order name"
                value={reqNum}
                onChange={(e) => setReqNum(e.target.value)}
              />
              <br />
              <input type="file" onChange={onChange} />
              {/* <label htmlFor="customFile">{fileName}</label> */}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-mdb-dismiss="modal"
                onClick={() => setToggleAddLadOrderButton(false)}
              >
                Close
              </button>
              <input type="submit" value="Submit" className="btn btn-primary" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddLabOrder;
