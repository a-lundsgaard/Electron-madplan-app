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
require("./style.css");
const placeholder_png_1 = __importDefault(require("./placeholder.png"));
function uploadImage({ onImageUpload, ...props }) {
    const [{ alt, src }, setImg] = react_1.useState({
        src: placeholder_png_1.default,
        alt: 'Upload an Image'
    });
    react_1.useEffect(() => {
        if (props.src) {
            setImg({
                alt: alt,
                src: props.src,
            });
        }
        if (!props.src) {
            setImg({
                src: placeholder_png_1.default,
                alt: 'Upload an Image'
            });
        }
    }, [props.src]);
    react_1.useEffect(() => {
        if (src !== placeholder_png_1.default)
            onImageUpload(src);
    }, [src]);
    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                src: URL.createObjectURL(e.target.files[0]),
                alt: e.target.files[0].name
            });
        }
    };
    return (<div className={"container"}>
            <img src={src} alt={alt} className={"image"}/>

            <div className={"middle"}>
                <label className={"text"} htmlFor="img">+</label>
                <input type="file" id="img" name="img" accept="image/*" hidden onChange={handleImg}/>
            </div>
        </div>);
}
exports.default = uploadImage;
