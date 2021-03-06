"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const todos_context_jsx_1 = require("../contexts/todos.context.jsx");
const useInputState_jsx_1 = __importDefault(require("../hooks/useInputState.jsx"));
const EditTodoFormStyles_js_1 = __importDefault(require("../styles/EditTodoFormStyles.js"));
const actions_1 = require("../constants/actions");
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const useToggleState_jsx_1 = __importDefault(require("../hooks/useToggleState.jsx"));
function EditTodoForm({ id, task, toggleEditForm, restOfTask: restOfProperties }) {
    const classes = EditTodoFormStyles_js_1.default();
    const dispatch = react_1.useContext(todos_context_jsx_1.DispatchContext);
    const [value, handleChange, clearValue] = useInputState_jsx_1.default(task);
    const [isEditing, toggle] = useToggleState_jsx_1.default(false);
    return (<form onSubmit={e => {
            e.preventDefault();
            dispatch({ type: actions_1.EDIT_TODO, ...restOfProperties, id, task: value, initiator: 'USER' });
            toggleEditForm();
            clearValue();
        }} className={classes.EditTodoForm}>
      <TextField_1.default variant={'standard'} autoFocus value={value} onChange={handleChange} onClick={e => e.stopPropagation()} className={classes.input}/>
    </form>);
}
exports.default = EditTodoForm;
