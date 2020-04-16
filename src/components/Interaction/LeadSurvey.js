import React, {Component} from 'react'
import { MDBContainer} from "mdbreact";

class LeadSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBContainer fluid className={"p-0 w-auto"}>
                Lead Survey<br/>
               <p> Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                terry richardson ad squid. 3 wolf moon officia aute, non
                cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                bird on it squid single-origin coffee nulla assumenda shoreditch
                   et. Nihil anim keffiyeh helvetica, craft beer.</p>
            </MDBContainer>
        )
    }
}
export default LeadSurvey;
