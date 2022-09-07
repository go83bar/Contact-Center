import React, { useState } from "react";
import { MDBBox, MDBBtn, MDBCard, MDBSelect } from "mdbreact";
import { connect } from "react-redux";
import AddLabOrder from "./AddLabOrder";
import LabOrderAPI from "../../../api/labOrderAPI";
import DocumentAPI from "../../../api/documentAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faCircle as faCircleSolid,
  faFile,
} from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { isThisHour } from "date-fns";
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
  let lab_orders = useSelector((state) => state.lead.lab_orders);

  const deleteLabOrder = (id) => {
    console.log(id, "hi");
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

          console.log(response, "hello");

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

  return (
    <MDBBox
      className={active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}
    >
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
                  <a
                    style={{
                      background: "#43C7B7",
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
                  {obj?.deleteable && (
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
