import React, { Component } from 'react';
import { Colors } from '../../constants/masterData';
import { CHANGE_COLOR } from '../../constants/commonConstant';
import { connect } from 'react-redux';

class RightColorBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colors: Colors.slice(0, 9),
            pageCOlor: 0,
            pageSizeColor: 9,
            colorSelect: this.props.colorSelect
        }
    }

    _changePageColor(e) {
        var pageCOlor = 0;
        if (e === 'prev')
            pageCOlor = this.state.pageCOlor === 0 ? 0 : this.state.pageCOlor - 1;
        if (e === 'next')
            pageCOlor = this.state.pageCOlor + 1 === Math.ceil(Colors.length / this.state.pageSizeColor) ?
                this.state.pageCOlor : this.state.pageCOlor + 1;
        let colors = Colors.slice(pageCOlor * this.state.pageSizeColor, pageCOlor * this.state.pageSizeColor + this.state.pageSizeColor);
        this.setState({ pageCOlor, colors });
    }
    _changeColor(e) {
        this.setState({ colorSelect: e });
        this.props.changeColorDispatch(CHANGE_COLOR, e);
    }
    render() {
        return (
            <div className="rightcolorbox">
                <ul className="panel">
                    {
                        this.state.colors.map((e, i) => {
                            return <li className={`item ` + (this.state.colorSelect === e ? 'active' : '')} key={i} >
                                <a style={{ backgroundColor: e }} key={e} onClick={this._changeColor.bind(this, e)}>
                                </a>
                            </li>
                        })
                    }
                </ul>
                <span className="prev" onClick={this._changePageColor.bind(this, 'prev')}></span>
                <span className="next" onClick={this._changePageColor.bind(this, 'next')}></span>
            </div >

        );
    }
}
function mapStateToProps(state) {
    return {
        colorSelect: state.drawReduct.colorSelect,
    };
}
const mapPropsToDispatch = dispatch => ({
    changeColorDispatch: (action, data) => {
        return dispatch({
            type: action,
            colorSelect: data
        });
    },
});

export default connect(mapStateToProps, mapPropsToDispatch)(RightColorBox);