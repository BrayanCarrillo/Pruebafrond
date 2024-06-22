import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleCaptchaChange = (value) => {
        setCaptcha(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captcha) {
            alert('Por favor, complete el CAPTCHA');
            return;
        }

        try {
            const response = await fetch('https://prueba12-production.up.railway.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, captcha }),
            });

            const data = await response.json();
            if (response.ok) {
                login(); // Set the user as authenticated
                switch (data.role) {
                    case 'admin':
                        navigate('/panel');
                        break;
                    case 'chef':
                        navigate('/Paneljuan');
                        break;
                    case 'mesero':
                        navigate('/PanelPedro');
                        break;
                    default:
                        alert('Error al iniciar sesión');
                        break;
                }
            } else {
                if (response.status === 403 && data.error === "Usuario desactivado") {
                    alert('Usuario desactivado. No puede ingresar.');
                } else {
                    alert(data.error || 'Error al iniciar sesión');
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div className='background-wrapper'>
            <div className='wrapperh'>
                <form onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <div className="input-box wave-group">
                        <FaUser className="icon"/>
                        <input 
                            type="text" 
                            className="input"
                            required 
                            value={username} 
                            onChange={(e) => handleInputChange(e, setUsername)} 
                        />
                        <span className="bar"></span>
                        <label className="label">
                            <span className="label-char" style={{'--index': 0}}>N</span>
                            <span className="label-char" style={{'--index': 1}}>o</span>
                            <span className="label-char" style={{'--index': 2}}>m</span>
                            <span className="label-char" style={{'--index': 3}}>b</span>
                            <span className="label-char" style={{'--index': 4}}>r</span>
                            <span className="label-char" style={{'--index': 5}}>e</span>
                        </label>
                    </div>
                    <div className="input-box wave-group">
                        <input 
                            type="password" 
                            className="input"
                            required 
                            value={password} 
                            onChange={(e) => handleInputChange(e, setPassword)} 
                        />
                        <span className="bar"></span>
                        <label className="label">
                            <span className="label-char" style={{'--index': 0}}>P</span>
                            <span className="label-char" style={{'--index': 1}}>a</span>
                            <span className="label-char" style={{'--index': 2}}>s</span>
                            <span className="label-char" style={{'--index': 3}}>s</span>
                            <span className="label-char" style={{'--index': 4}}>w</span>
                            <span className="label-char" style={{'--index': 5}}>o</span>
                            <span className="label-char" style={{'--index': 6}}>r</span>
                            <span className="label-char" style={{'--index': 7}}>d</span>
                        </label>
                    </div>
                    <div className="recaptcha-wrapper">
                        <ReCAPTCHA
                            sitekey="6LczrvUpAAAAANaraFDZmN3lhEv30kf-MqRhy8hW"
                            onChange={handleCaptchaChange}
                        />
                    </div>
                    <button type="submit" className="btnn">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
