import React, { useState, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import defaultFace from '../img/face.png'; // Verifica que esta ruta coincida con tu estructura
import './registro.css';

const Escaneo = (props) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isCam, setIsCam] = useState(false);

    const capture = useCallback(() => {
        setIsCam(false);
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        props.setIsTakePhoto(true);
        props.handleSetImage(imageSrc.split(',')[1]);
    }, [webcamRef, props]);

    const retake = () => {
        setIsCam(true);
        setImgSrc(null);
        props.setIsTakePhoto(false);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);

        if (event.target.files && event.target.files[0]) {
            setIsCam(false);
            setImgSrc(null);
            let img = event.target.files[0];
            setImage(URL.createObjectURL(img));
            
            const reader = new FileReader();

            reader.onload = (e) => {
                const mapaDeBitsBinario = e.target.result;
                const mapaDeBitsBase64 = arrayBufferToBase64(mapaDeBitsBinario);
                props.handleSetImage(mapaDeBitsBase64);
                props.setIsTakePhoto(true);
            };
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    };

    function arrayBufferToBase64(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        return btoa(binaryString);
    }

    const handleImage = () => {
        fileInputRef.current.click();
    };

    // Estilos en línea para reemplazar los de Material UI y mantener un diseño atractivo
    const buttonStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const primaryBtn = { ...buttonStyle, backgroundColor: '#1976d2' };
    const successBtn = { ...buttonStyle, backgroundColor: '#2e7d32' };

    return (
        <div className='grid-escaneo-registro'>
            <div className='grid-contenedor' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                
                <div className='escaneo-photo'>
                    {!isCam ? (
                        <img 
                            src={imgSrc ? imgSrc : image ? image : defaultFace} 
                            alt="Perfil" 
                            style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        />
                    ) : (
                        <Webcam
                            screenshotFormat="image/jpeg"
                            width={300}
                            height={250}
                            ref={webcamRef}
                            mirrored={true}
                            screenshotQuality={1}
                            style={{ borderRadius: '10px', border: '3px solid #1976d2' }}
                        />
                    )}
                </div>

                <div className="botones" style={{ display: 'flex', gap: '15px' }}>
                    {!isCam ? (
                        // Agregamos type="button" para evitar que envíen el formulario principal
                        <button type="button" style={primaryBtn} onClick={retake}>Cámara</button>
                    ) : (
                        <button type="button" style={primaryBtn} onClick={capture}>Tomar foto</button>
                    )}
                    <button type="button" style={successBtn} onClick={handleImage}>Importar</button>
                </div>
                
                <input
                    accept="image/*"
                    className='input-photo'
                    id="photo-file"
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
}

export default Escaneo;