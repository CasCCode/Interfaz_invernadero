import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Helmet } from 'react-helmet';
import BackButton from '../components/BackButton';
import { FaSeedling } from 'react-icons/fa';
import './AddGreenhouse.css';

const AddGreenhouse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    plantingLocation: "",
    cropSize: "",
    initialTankLevel: "",
    recommendedFrequency: "",
    observations: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cropTypes = {
    "Hortalizas rápidas": {
      frequency: "Cada 2-3 días",
      observations: "Muy susceptibles a plagas por su ciclo corto"
    },
    "Frutales menores": {
      frequency: "Cada 5-7 días",
      observations: "Revisar frutos y hojas"
    },
    "Granos y cereales": {
      frequency: "Cada 7-10 días",
      observations: "Inspeccionar en etapa de floración"
    },
    "Frutales mayores": {
      frequency: "Cada 10-14 días",
      observations: "Plagas pueden ser cíclicas o estacionales"
    },
    "Leguminosas": {
      frequency: "Cada 5-7 días",
      observations: "Sensibles en floración y formación de vaina"
    },
    "Tubérculos": {
      frequency: "Cada 7-10 días",
      observations: "Revisar suelo y parte aérea"
    },
    "Aromáticas y medicinales": {
      frequency: "Cada 3-5 días",
      observations: "Algunas plagas específicas por olor"
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "cropType") {
      const selected = cropTypes[value];
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          recommendedFrequency: selected.frequency,
          observations: selected.observations
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          recommendedFrequency: "",
          observations: ""
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.name ||
      !formData.cropType ||
      !imageFile ||
      !formData.cropSize ||
      !formData.initialTankLevel
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("No hay un usuario autenticado.");
      }
      const uid = auth.currentUser.uid;

      // Subir la imagen a Firebase Storage
      const storageRef = ref(
        storage,
        `invernaderos/${uid}/${Date.now()}_${imageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Calcular la velocidad de bajada de tanques (por ejemplo, 5% del tamaño)
      const computedTankDropRate = Number(formData.cropSize) * 0.05;

      const greenhouseData = {
        name: formData.name,
        imageUrl,
        cropInfo: {
          cropType: formData.cropType,
          plantingLocation: formData.plantingLocation,
          cropSize: Number(formData.cropSize),
          initialTankLevel: Number(formData.initialTankLevel),
          tankDropRate: computedTankDropRate,
          recommendedFrequency: formData.recommendedFrequency,
          observations: formData.observations
        },
        creationDate: serverTimestamp()
      };

      // Guardar documento en la subcolección de invernaderos
      const invernaderosRef = collection(db, "users", uid, "invernaderos");
      await addDoc(invernaderosRef, greenhouseData);

      navigate('/');
    } catch (err) {
      console.error("Error agregando invernadero:", err);
      setError("Error agregando invernadero. Intente nuevamente.");
    }
    setLoading(false);
  };

  return (
    <div className="add-greenhouse-container fade-in-up">
      <Helmet>
        <title>Agregar Invernadero | GrowSphere</title>
      </Helmet>
      <BackButton />
      <h1>
        <FaSeedling /> Agregar Invernadero
      </h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Invernadero *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Imagen del Invernadero *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="image-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label>Tipo de Cultivo *</label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione...</option>
            {Object.keys(cropTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Ubicación de la siembra</label>
          <input
            type="text"
            name="plantingLocation"
            value={formData.plantingLocation}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Tamaño del cultivo (m²) *</label>
          <input
            type="number"
            name="cropSize"
            value={formData.cropSize}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nivel inicial de tanques *</label>
          <input
            type="number"
            name="initialTankLevel"
            value={formData.initialTankLevel}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Frecuencia Recomendada</label>
          <input
            type="text"
            name="recommendedFrequency"
            value={formData.recommendedFrequency}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Invernadero"}
        </button>
      </form>
      <div className="tips-container">
        <h2>Consejos Rápidos</h2>
        <ul>
          <li>Asegúrate de que la imagen sea clara y representativa.</li>
          <li>Verifica que el tipo de cultivo y su tamaño sean correctos.</li>
          <li>
            La frecuencia recomendada y observaciones se llenan automáticamente
            basándose en el tipo de cultivo.
          </li>
        </ul>
      </div>
      <div className="preview-container">
        <h2>Resumen en tiempo real</h2>
        <div className="preview-card">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="preview-image"
            />
          )}
          <p>
            <strong>Nombre:</strong> {formData.name || "N/A"}
          </p>
          <p>
            <strong>Tipo de Cultivo:</strong> {formData.cropType || "N/A"}
          </p>
          <p>
            <strong>Tamaño:</strong>{" "}
            {formData.cropSize ? `${formData.cropSize} m²` : "N/A"}
          </p>
          <p>
            <strong>Nivel Inicial:</strong>{" "}
            {formData.initialTankLevel ? `${formData.initialTankLevel}%` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddGreenhouse;