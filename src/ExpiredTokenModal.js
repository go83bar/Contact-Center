import React, {Component} from 'react'
import {MDBModal, MDBModalBody} from "mdbreact";
import {connect} from "react-redux";

class ExpiredTokenModal extends Component {
    render() {
        return (
            <MDBModal isOpen={this.props.user.auth.isExpired} centered backdrop={"static"} keyboard={false}>
                <MDBModalBody className="p-4">
                    <h3>{this.props.localization.login.expiredTokenTitle}</h3>
                    <p className="text-center">{this.props.localization.login.expiredTokenNotice}</p>
                </MDBModalBody>
            </MDBModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        user: state.user
    }
}

export default connect(mapStateToProps)(ExpiredTokenModal)
