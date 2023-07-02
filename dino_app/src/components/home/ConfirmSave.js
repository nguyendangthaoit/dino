import React, { Component } from 'react';
import { SAVE_IMAGE } from '../../constants/commonConstant'
import { connect } from 'react-redux';
class ConfirmSave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSave: false,
            pictrureName: '',
            authorName: ''
        }
    }
    _save() {
        this.setState({ isSave: true });
        this.pictrureName.focus();
        if (this.state.pictrureName) {
            let dispatch = {
                saveImage: true,
                pictrureNameSave: this.state.authorName ? this.state.pictrureName + '_' + this.state.authorName : this.state.pictrureName
            }
            this.props.saveImageDispatch(SAVE_IMAGE, dispatch)
        }
    }
    _cancel() {
        this.setState({
            pictrureName: '',
            authorName: '',
            isSave: false,
        });
    }

    render() {
        return (
            <div className="modal fade" id="confirmSave" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="pictrureNameLabel">Picture name</label>
                                <input type="text" className="form-control " placeholder="Picture name" ref={ip => (this.pictrureName = ip)}
                                    value={this.state.pictrureName} onChange={e => { this.setState({ pictrureName: e.target.value }) }}
                                    style={{ borderColor: !this.state.pictrureName && this.state.isSave ? 'red' : '' }} />
                            </div>
                            <div className="form-group">
                                <label >Author name</label>
                                <input type="text" className="form-control" placeholder="Author name"
                                    value={this.state.authorName} onChange={e => { this.setState({ authorName: e.target.value }) }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="cancelModalSave" className="btn btn-danger" data-dismiss="modal" style={{ width: 72 }} onClick={this._cancel.bind(this)} >Cancel</button>
                            <button type="button" className="btn btn-success" style={{ width: 72 }} onClick={this._save.bind(this)}>OK</button>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

function mapStateToProps(state) {
    return {
        saveImage: state.drawReduct.saveImage,
    };
}
const mapPropsToDispatch = dispatch => ({
    saveImageDispatch: (action, data) => {
        return dispatch({
            type: action,
            dispatchSave: data
        });
    },
});
export default connect(mapStateToProps, mapPropsToDispatch)(ConfirmSave);
