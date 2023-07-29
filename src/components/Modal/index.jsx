import "./style.css"
import { X} from "@phosphor-icons/react";

export default function Modal({ children, onClick }) {
  return (
    <div className="pelicula"><div className="modal">
    <button className="closeBtn" onClick={onClick}><X size={24}/></button>
    {children}
  </div></div>
    );
}
