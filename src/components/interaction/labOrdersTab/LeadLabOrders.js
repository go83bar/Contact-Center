import React, { useState } from "react";
import { MDBBox } from "mdbreact";
import AddLabOrder from "./AddLabOrder";
import LabOrderAPI from "../../../api/labOrderAPI";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const LeadLabOrders = ({ active }) => {
  const dispatch = useDispatch();
  const [toggleAddLabOrderButton, setToggleAddLadOrderButton] = useState(false);
  const deleteLabOrderSuccessMessage = useSelector(
    (state) => state.localization.toast.editLead.deleteLabOrderSuccess
  );
  const deleteLabOrderErrorMessage = useSelector(
    (state) => state.localization.toast.editLead.deleteLabOrderError
  );
  const leadMeta = useSelector((state) => {
      let meta = state.lead.meta
    console.log("Meta: ", meta)
      return meta.find(item => item.key === "alzmatch_id")
  })
  console.log("Found almzatch: ", leadMeta)
  let alzmatchID = ""
  if (leadMeta !== undefined) {
      alzmatchID = leadMeta.value
  }

  const confirmLabOrderSuccessMessage = useSelector(
    (state) => state.localization.toast.editLead.confirmLabOrderSuccess
  );
  const confirmLabOrderErrorMessage = useSelector(
    (state) => state.localization.toast.editLead.confirmLabOrderError
  );

  let lab_orders = useSelector((state) => state.lead.lab_orders);

  const deleteLabOrder = (id) => {
    LabOrderAPI.deleteLabOrder({ order_id: id })
      .then((response) => {
        if (response.success) {
          // set new lab order in redux
          try {
            dispatch({
              type: "LEAD.LAB_ORDERS.DELETE_LAB_ORDER",
              data: {
                id: id,
              },
            });
          } catch (err) {
            console.log(err);
          }
          // notify user
          toast.success(deleteLabOrderSuccessMessage);
        } else {
          toast.error(deleteLabOrderErrorMessage);
          console.log("Failed to delete lab order: ", response);
        }
      })
      .catch((error) => {
        toast.error(deleteLabOrderErrorMessage);
        console.log("Failed to delete lab order: ", error);
      });
    return;
  };

  const confirmLabOrder = (id) => {
    try {
      dispatch({
        type: "LEAD.LAB_ORDERS.CONFIRM_LAB_ORDER",
        data: {
          envelopeID: id,
        },
      });
      toast.success(confirmLabOrderSuccessMessage);
    } catch (err) {
      console.log(err);
      toast.error(confirmLabOrderErrorMessage);
    }
    return;
  };

  return (
    <MDBBox
      className={active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}
    >
      <div className={"d-flex w-100"} style={{justifyContent:"space-between"}}>
        <button
            type="button"
            className="btn btn-primary"
            data-mdb-toggle="modal"
            data-mdb-target="#exampleModal"
            style={{ maxWidth: 150 }}
            onClick={() => setToggleAddLadOrderButton(!toggleAddLabOrderButton)}
        >
          Add Lab Order
        </button>
        <div style={{textAlign: "right", fontSize: "large", paddingTop: "1.5 em", paddingRight: "2em"}}>
          AlzMatch ID: { alzmatchID }
        </div>
      </div>
      {toggleAddLabOrderButton ? (
        <AddLabOrder setToggleAddLadOrderButton={setToggleAddLadOrderButton} />
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            overflowY: "auto",
          }}
        >
          {lab_orders.map((obj) => (
            <div key={obj.id}>
              <div
                style={{
                  width: 350,
                  border: "1px solid #43C7B7",
                  padding: 15,
                  margin: 15,
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 22,
                    borderBottom: "1px solid gray",
                  }}
                >
                  Quest Blood Draw
                </div>
                <br />
                <div>Uploaded by: {obj.created_by}</div>
                <div style={{ color: "gray" }}>{obj.created_at}</div>
                <br />
                <div>REQ # {obj.requisition_number}</div>
                <div style={{ marginTop: 20, marginBottom: 10 }}>
                  {obj?.deleteable ? (
                    <div>
                      <a
                        style={{
                          background: "#43C7B7",
                          color: "white",
                          borderRadius: 5,
                          padding: 10,
                          margin: 5,
                          fontWeight: "bold",
                        }}
                        onClick={() => confirmLabOrder(obj.id)}
                      >
                        CONFIRM
                      </a>
                      <a
                        style={{
                          background: "#465663",
                          color: "white",
                          borderRadius: 5,
                          padding: 10,
                          margin: 5,
                          fontWeight: "bold",
                        }}
                        href={obj.file_link}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        VIEW PDF
                      </a>
                      <a
                        style={{
                          background: "#d32f2f",
                          color: "white",
                          borderRadius: 5,
                          padding: 10,
                          margin: 5,
                          fontWeight: "bold",
                        }}
                        onClick={() => deleteLabOrder(obj.id)}
                      >
                        DELETE
                      </a>
                    </div>
                  ) : (
                    <a
                      style={{
                        background: "#465663",
                        color: "white",
                        borderRadius: 5,
                        padding: 10,
                        margin: 5,
                        fontWeight: "bold",
                      }}
                      href={obj.file_link}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      VIEW PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MDBBox>
  );
};

export default LeadLabOrders;
