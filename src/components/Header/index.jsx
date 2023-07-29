import "./style.css"
import Logo from '../../assets/logo.png'

export default function Header(){
    return (
        <header>
            <img src={Logo} alt="" />
            <p>Discografia</p>
        </header>
    );
}