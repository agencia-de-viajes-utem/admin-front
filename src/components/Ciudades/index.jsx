// src/components/Ciudades/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Ciudades.css';
import Spinner from '../../utils/Spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import ModalComponent from '../../utils/ModalComponent';
import { fetchPaises, fetchCiudades } from '../../api';
import CiudadCard from '../CiudadCard'; '../PaisCard'

export default function Ciudades() {
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(true);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(null);
  const [filtroPais, setFiltroPais] = useState(null);
  const [filtroCiudad, setFiltroCiudad] = useState(null);
  const [paises, setPaises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const ciudadesIniciales = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [ciudadSelected, setCiudadSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ciudadesData = await fetchCiudades();
        const paisesData = await fetchPaises();
        ciudadesIniciales.current = ciudadesData;
        
        setCiudades(ciudadesData);
        setLoadingCiudades(false);
        setPaises(paisesData);
        setLoadingPaises(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingCiudades(false);
        setLoadingPaises(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filtrar paises
        setLoadingCiudades(true);
        const data = ciudadesIniciales.current;
        const term = searchTerm.toLowerCase();

        const filteredCiudades02 = data.filter((ciudad) => {
          const cumpleFiltroPais = filtroPais === null || filtroPais.length === 0 || filtroPais.includes(ciudad.pais_id);
          return cumpleFiltroPais;
        });

        // Filtrar por nombre
        if (term === '') {
          setCiudades(filteredCiudades02);
        } else {
          const filteredCiudades = data.filter((ciudad) => {
            const nombreSinTildes = ciudad.nombre
              .normalize('NFD') // Normaliza las tildes a caracteres individuales
              .replace(/[\u0300-\u036f]/g, ''); // Elimina los caracteres diacríticos (tildes)

            return (
              nombreSinTildes.toLowerCase().includes(term)
            );
          });
          const filteredCiudadesMerge = filteredCiudades.filter(item => filteredCiudades02.some(item2 => item2.id === item.id));
          setCiudades(filteredCiudadesMerge);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingCiudades(false);
      }
    };

    fetchData();
  }, [filtroPais, searchTerm]);

  const editCiudadDetail = () => {
    console.log("Se intento editar el elemento.");
  }

  const showCiudadDetail = (ciudad) => {
    const imagenURL = 'https://storage.googleapis.com/tisw-data-bucket/gallery/morris.png';
    const detailModalBody = (
      <div className="ciudadDetalle">
        <div className="ciudadDetailModule">
          <p><b>Nombre:</b></p>
          <div className="ciudadDetailInput">
            <input
              type="text"
              placeholder={ciudad.nombre}
              value={ciudad.nombre}
            />
          
            <div className="ciudadDetailEditButton" onClick={editCiudadDetail}
            >
            <img src={imagenURL}/>
            </div>
          </div>
        </div>
        <div className="ciudadDetailModule">
          <p><b>País:</b></p>
          <div className="ciudadDetailInput">
            <input
              type="text"
              placeholder={ciudad.abrev_pais}
              value={ciudad.abrev_pais}
            />
          
            <div className="ciudadDetailEditButton" onClick={editCiudadDetail}
            >
            <img src={imagenURL}/>
            </div>
          </div>
        </div>
        <div className="ciudadDetailModule">
          <p><b>Abreviatura:</b></p>
          <div className="ciudadDetailInput">
            <input
              type="text"
              placeholder={ciudad.imagenes}
              value={ciudad.imagenes}
            />
          
            <div className="ciudadDetailEditButton" onClick={editCiudadDetail}
            >
            <img src={imagenURL}/>
            </div>
          </div>
        </div>
      </div>
    )
    setShowModal(true);
    setModalBody(detailModalBody);
    console.log("Ciudad clickeada:", ciudadSelected);
}

  const handleFiltroPais = (paisId) => {
    setFiltroPais(paisId);
    setButtonPressed(paisId);
    setFiltroCiudad(null);

  };

  return (
    <div>
      <div className="ciudades-container">
        {loadingPaises && loadingCiudades ? (
          <Spinner />
        ) : (
          <>
            <div>
              <div className="ciudadTitle">
                <h1>Administrador de Ciudades</h1>
              </div>
              <div className="filtro-container">
                <div className="nameSearch">
                  <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Typeahead
                  id="typeahead-paises"
                  labelKey="nombre"
                  multiple
                  options={[
                    { id: null, nombre: 'Todos los países' },
                    ...paises,
                  ]}
                  selected={paises.filter((pais) => buttonPressed !== null && (buttonPressed.includes(pais.id) || buttonPressed.includes(null)))}
                  onChange={(selected) => {
                    const selectedIds = selected.map((item) => item.id);
                    handleFiltroPais(selectedIds.length > 0 ? selectedIds : null);
                  }}
                  placeholder="Filtrar por países..."
                />
              </div>
              
              <div className="ciudadLista">
                {ciudades.map((ciudad) => (
                  <CiudadCard 
                  onClick={() => showCiudadDetail(ciudad)}
                  ciudad={ciudad} 
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <ModalComponent
        title={"Editar ciudad"}
        show={showModal}
        handleClose={() => setShowModal(false)}
        bodyContent={modalBody}

      />
    </div>
  );
}
