import { CHANGE_COLOR, CHANGE_TOOL, CHANGE_TOOL_SIZE, SAVE_IMAGE, CLEAR_CANVAS }
    from '../constants/commonConstant';
import { Colors, ToolSize,ToolDraw } from '../constants/masterData'

const INIT_STATE =
{
    colorSelect: Colors[0],
    tool: ToolDraw[0],
    toolSize: ToolSize[1].value,
    saveImage: false,
    clearCanvas: false,
    pictrureNameSave: ''
};

const drawReduct = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_COLOR:
            state = {
                ...state, colorSelect: action.colorSelect
            };
            return state;
        case CHANGE_TOOL:
            state = {
                ...state, tool: action.tool
            };
            return state;
        case CHANGE_TOOL_SIZE:
            state = {
                ...state, toolSize: action.toolSize
            };
            return state;
        case SAVE_IMAGE:
            state = {
                ...state, saveImage: action.dispatchSave.saveImage, pictrureNameSave: action.dispatchSave.pictrureNameSave
            };
            return state;
        case CLEAR_CANVAS:
            state = {
                ...state, clearCanvas: action.clearCanvas
            };
            return state;
        default: return state;
    }
};

export default drawReduct;
