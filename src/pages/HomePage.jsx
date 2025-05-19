import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import GreenhouseCard from "../components/GreenhouseCard";
import { Container, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImg from "../assets/profileImg.jpg";
import "./HomePage.css";
import { Helmet } from "react-helmet";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HomePage() {
  const [greenhouses, setGreenhouses] = useState([]);
  const [userName, setUserName] = useState("usuario");
  const [profilePicUrl, setProfilePicUrl] = useState(profileImg);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Cargar invernaderos
  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const greenhouseCollection = collection(db, "users", uid, "invernaderos");
      const unsubscribe = onSnapshot(
        greenhouseCollection,
        (snapshot) => {
          const ghData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGreenhouses(ghData);
        },
        (error) => {
          console.error("Error al cargar invernaderos:", error);
        }
      );
      return () => unsubscribe();
    }
  }, []);

  // Obtener datos del usuario
  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.nombre);
            if (data.profilePicUrl) {
              setProfilePicUrl(data.profilePicUrl);
            }
          }
        })
        .catch((error) =>
          console.error("Error al obtener el documento del usuario:", error)
        );
    }
  }, []);

  // Actualizar foto de perfil
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uid = auth.currentUser.uid;
      const storageRef = ref(
        storage,
        `profilePictures/${uid}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { profilePicUrl: downloadURL });
      setProfilePicUrl(downloadURL);
    } catch (error) {
      console.error("Error al actualizar la foto de perfil:", error);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("¿Estás seguro que quieres cerrar sesión?");
    if (!confirmed) return;
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Funciones para desplazar el slider horizontal
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ top: 0, left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ top: 0, left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className="homepage-container">
      <Helmet>
        <title>Inicio | GrowSphere</title>
      </Helmet>
      {!showMenu && (
        <button className="config-button" onClick={() => setShowMenu(true)}>
          &#9881;
        </button>
      )}
      <div className={`config-panel ${showMenu ? "active" : ""}`}>
        <FaTimes
          className="close-panel-icon"
          onClick={() => setShowMenu(false)}
        />
        <h3>Configuración</h3>
        <div className="profile-pic-change">
          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="profilePicInput"
            className="btn custom-button change-profile-button"
          >
            Cambiar foto de perfil
          </label>
        </div>
        <button
          className="btn custom-button logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
      <Container fluid className="p-0">
        <div className="welcome-section">
          <div className="header-content">
            <Image
              src={profilePicUrl}
              roundedCircle
              width={120}
              height={120}
              className="profile-image"
            />
            <h1 className="welcome-title">¡Bienvenido {userName}!</h1>
          </div>
        </div>
        <div className="horizontal-scroll-container">
          <div className="slider-wrapper">
            <button className="scroll-button left" onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
            <div className="horizontal-content" ref={sliderRef}>
              {greenhouses.map((gh, index) => (
                <div key={index} className="item">
                  <Link
                    to={`/greenhouse/${gh.id}`}
                    className="text-decoration-none h-100"
                  >
                    <GreenhouseCard
                      name={gh.name}
                      crop={gh.cropInfo?.cropType}
                      status={gh.status || "OK"}
                      image={gh.imageUrl}
                    />
                  </Link>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="add-greenhouse-button-container">
          <Link to="/add-greenhouse" className="add-greenhouse-btn">
            <div className="plus-circle">+</div>
            <p className="add-greenhouse-text">Agregar Invernadero</p>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default HomePage;