import React from 'react';
import './CiudadCard.css';

export default function CiudadCard({ ciudad, onClick }) {
    const imagenURL = 'https://storage.googleapis.com/tisw-data-bucket/gallery/morris.png';
    
    // Las rutas GET de ciudad estan corridas 1 puesto. Pais esta vacio, abrev_pais esta marcando el pais y imagenes esta marcando la abreviacion del pais
    // Probablemente sea un error al generar el json
    return (
        <div className="ciudadCard" key={ciudad.id} onClick={onClick}> 
            <img src={imagenURL} alt={`Imagen de ${ciudad.nombre}`} />
            <div className="ciudadCardTitulo"> 
                <p><b>{ciudad.nombre} ({ciudad.abrev_pais})</b></p>
            </div>
            <div className="ciudadCardInfo"> 
                <p><b>Aeropuertos:</b> </p>
                <div className='ciudadCardAeropuertos'>
                <p>- Aeropuerto_nombre</p>
                <p>- Aeropuerto_nombre</p>
                </div>
            </div>
        </div>
    );
}
