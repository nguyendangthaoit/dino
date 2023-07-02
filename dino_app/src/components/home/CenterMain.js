import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SAVE_IMAGE, CLEAR_CANVAS } from '../../constants/commonConstant';
import { ToolDraw } from "../../constants/masterData";
//import img from "../../assets/images/color.png";
import { showLoad, hideLoad } from "../../share/loading";
class CenterMain extends Component {
    constructor(props) {
        super(props);
        this.state = {imgWidth:null, imgHeight:null};
    }

    componentDidMount() {
        showLoad();
        // innit Canvas draw
        this.canvas = document.getElementById('sketch');
        this.ctx = this.canvas.getContext('2d');
        this.drawing = false;
        this.drawingMode = true;
        this.lastX = 0;
        this.lastY = 0;

        let img = this._getParameterByName('src');
        if (img) {
            img = atob(img);
            // init canvas iamge
            this.canvasImage = document.getElementById('sketch-image');
            let background = new Image();
            background.crossOrigin = 'anonymous';
            background.src = img;
            let ctxIm = this.canvasImage.getContext('2d');
            background.onload = (e) => {
                if(Array.isArray(e.path)) {
                    let dimension = e.path[0];
                    this.setState({imgWidth:dimension.width, imgHeight:dimension.height});
                } else if(e.target && e.target.width && e.target.height) {
                    this.setState({imgWidth:e.target.width, imgHeight:e.target.height});
                } else {
                    this.setState({imgWidth:600, imgHeight:450}); // fall back resolution
                }
                
                ctxIm.drawImage(background, 0, 0, this.canvasImage.width, this.canvasImage.height);
                let imgData = ctxIm.getImageData(0, 0, background.width, background.height); //get pixcel data iamge
                for (let i = 0; i < imgData.data.length; i += 4) { // transparent image
                    if (imgData.data[i] === 255 && imgData.data[i + 1] === 255 && imgData.data[i + 2] === 255) { imgData.data[i + 3] = 0; }
                }
                ctxIm.putImageData(imgData, 0, 0); //set iamge transparented
            }
            this._eventMouse();
        }
        setTimeout(() => { hideLoad(); }, 500);
    }
    _eventMouse() {
        // for laptop
        this.canvasImage.addEventListener('mousedown', (e) => this._handleMouseDown(e));
        this.canvasImage.addEventListener('mousemove', (e) => this._handleMouseMove(e));
        this.canvasImage.addEventListener('mouseout', () => this._handleMouseUp());
        document.addEventListener('mouseup', () => this._handleMouseUp());
        //for mobile
        this.canvasImage.addEventListener('touchstart', (e) => this._handleMouseDown(e, true));
        this.canvasImage.addEventListener('touchmove', (e) => this._handleMouseMove(e, true));
        this.canvasImage.addEventListener('touchend', () => this._handleMouseUp());
    }
    componentWillReceiveProps(newProps) {
        this.drawingMode = newProps.tool !== 'eraser';
        if (newProps.clearCanvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.props.clearCanvasDispatch(CLEAR_CANVAS, false);
        }
        if (newProps.saveImage) {
            this._exportImage(newProps.pictrureNameSave);
        }
    }

    _getMouseCoordinate(evt) {
        var rect = this.canvas.getBoundingClientRect();
        var scale = 1;
        // //for sacle mobile (able remove)
        // if (window.innerWidth <= 768)
        //     scale = 0.8;
        // if (window.innerWidth <= 576)
        //     scale = 0.45;
        return {
            x: ((evt.clientX ?? evt.touches[0].clientX) - rect.left) / scale,
            y: ((evt.clientY ?? evt.touches[0].clientY) - rect.top) / scale
        }
    };
    _handleMouseDown(e, isTouch) {
        if (this.drawing) return false;
        this.drawing = true;
        if (isTouch) {
            e.preventDefault();
            e.stopPropagation();
        }
        this._handleDraw(e);
    }
    _handleMouseMove(e, isTouch) {
        if (!this.drawing) return false;
        if (isTouch) {
            e.preventDefault();
            e.stopPropagation();
        }
        this._handleDraw(e);
    }
    _handleMouseUp() {
        if (!this.drawing) return false;
        this.drawing = false;
    }
    _handleDraw(e) {
        this.ctx.globalCompositeOperation = this.drawingMode ? 'source-over' : 'destination-out';
        switch (this.props.tool) {
            case ToolDraw[0]:
            case 'eraser':
                this._pencilBrush(e, ToolDraw[0]);
                break;
            case ToolDraw[1]:
                this._pencilBrush(e, ToolDraw[1]);
                break;
            case ToolDraw[2]:
                this._crayonBrush(e);
                break;
            default: this._pencilBrush(e, ToolDraw[0]);
        }
    }
    _pencilBrush(e, type) {
        var mouse = this._getMouseCoordinate(e);
        this.ctx.beginPath();
        if (e.type === 'mousedown' || e.type === 'touchstart') {
            [this.lastX, this.lastY] = [mouse.x, mouse.y];
            if (type === ToolDraw[1]) {
                this.ctx.rect(mouse.x, mouse.y, 0.5, 0.5);
            }
            if (e.type === 'touchstart' && type === ToolDraw[0])
                this.ctx.arc(mouse.x, mouse.y, 0.1, 0, 2 * Math.PI);
        }
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(mouse.x, mouse.y);
        this.ctx.lineWidth = this.props.toolSize;
        this.ctx.strokeStyle = this.props.colorSelect;
        this.ctx.lineCap = type === ToolDraw[0] ? 'round' : 'butt';
        this.ctx.globalAlpha = type === ToolDraw[0] ? 1 : 0.3;
        this.ctx.stroke();
        this.ctx.closePath();
        [this.lastX, this.lastY] = [mouse.x, mouse.y];
    }
    _crayonBrush(e) {
        var mouse = this._getMouseCoordinate(e);
        this.ctx.beginPath();
        for (let i = this.props.toolSize; i--;) {
            this.ctx.rect(mouse.x + Math.random() * this.props.toolSize,
                mouse.y + Math.random() * this.props.toolSize, 1, 1);

            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = this.props.colorSelect;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }

    _exportImage(pictrureNameSave) {
        showLoad();
        let cvs = document.createElement("canvas");
        [cvs.width, cvs.height] = [this.canvas.width, this.canvas.height]
        let ctxCV = cvs.getContext('2d');
        //create a rectangle with the desired color
        ctxCV.fillStyle = "#FFF";
        ctxCV.fillRect(0, 0, cvs.width, cvs.height);
        //draw the original canvas onto the destination canvas
        ctxCV.drawImage(this.canvas, 0, 0);
        ctxCV.drawImage(this.canvasImage, 0, 0);
        // get base64 image canvas
        this.image = cvs.toDataURL("image/png");

        let a = document.createElement("a"); //Create <a>
        a.href = this.image; //Image Base64 Goes here
        a.download = pictrureNameSave; //File name Here
        a.click(); //Downloaded file
        document.getElementById("cancelModalSave").click();
        this.props.saveImageDispatch(SAVE_IMAGE, {
            saveImage: false,
            pictrureNameSave: ''
        })
        setTimeout(() => { hideLoad(); }, 1300);
    }

    _getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    getCanvasHeight(imgWidth, imgHeight, canvasWidth) {
        return Math.ceil( imgHeight* canvasWidth / imgWidth);
    }

    getCanvasWidth(imgHeight, imgWidth, canvasHeight) {
        return Math.ceil( imgWidth* canvasHeight / imgHeight);
    }

    getCanvasSize() {
        let canvasHeight = '';
        let canvasWidth = '';
        if(window.screen.width < 1366) {
            canvasHeight = window.screen.height*0.7;
            canvasWidth = this.state.imgWidth && this.state.imgHeight ? this.getCanvasWidth(this.state.imgHeight, this.state.imgWidth, canvasHeight) : 600;
        }  else {
            canvasWidth = 600;
            canvasHeight = this.state.imgWidth && this.state.imgHeight ? this.getCanvasHeight(this.state.imgWidth, this.state.imgHeight, canvasWidth) : 450;
        }

        return {canvasWidth, canvasHeight};
    }

    render() {
        let canvasSize = this.getCanvasSize();

        return (
            <div id="center" className="mr-auto ml-auto d-block" style={{ width: canvasSize.canvasWidth, maxHeight: canvasSize.canvasHeight }}>
                <div id="canvasDiv" className={this.props.tool}>
                    <canvas id="sketch" width={canvasSize.canvasWidth} height={canvasSize.canvasHeight}>
                    </canvas>
                    <canvas id="sketch-image" width={canvasSize.canvasWidth} height={canvasSize.canvasHeight}>
                    </canvas>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        tool: state.drawReduct.tool,
        toolSize: state.drawReduct.toolSize,
        colorSelect: state.drawReduct.colorSelect,
        clearCanvas: state.drawReduct.clearCanvas,
        saveImage: state.drawReduct.saveImage,
        pictrureNameSave: state.drawReduct.pictrureNameSave,
    };
}
const mapPropsToDispatch = dispatch => ({
    clearCanvasDispatch: (action, data) => {
        return dispatch({
            type: action,
            clearCanvas: data
        });
    },
    saveImageDispatch: (action, data) => {
        return dispatch({
            type: action,
            dispatchSave: data
        });
    },
});
export default connect(mapStateToProps, mapPropsToDispatch)(CenterMain);
