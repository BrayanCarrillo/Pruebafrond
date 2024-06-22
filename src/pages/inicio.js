import React from 'react';
import { Link } from 'react-router-dom';
import './inicio.css';
import { Card } from 'react-bootstrap';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'react-bootstrap/Image'; // Importar Image desde react-bootstrap

// Componente de botón personalizado
const CustomButton = ({ onClick, children }) => (
  <button className="custom-button" onClick={onClick}>
    {children}
  </button>
);

function BasicExample({ title, price, description, imageSrc }) {
  return (
    <Card style={{ width: '100%', marginBottom: '20px' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img variant="top" src={imageSrc} style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

const QuienesSomos = () => {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Body style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '1' }}>
          <Card.Title>¿Quiénes somos?</Card.Title>
          <Card.Text>
            La Pescadería es un restaurante dedicado a ofrecer los mejores platos de mariscos frescos. Nuestros productos provienen directamente del mar y son preparados por chefs expertos para brindarte una experiencia gastronómica única y de calidad. En La Pescadería, nos enorgullecemos de promover la pesca sostenible y el consumo responsable de los recursos marinos.
          </Card.Text>
        </div>
        <div style={{ flex: '1', marginLeft: '20px' }}>
          <Card.Img variant="right" src="https://th.bing.com/th/id/OIP.zVEZ-TLvAI1xxa2DSKnvCgHaHG?rs=1&pid=ImgDetMain" alt="Quienes Somos" className="about-image" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'cover' }} />
        </div>
      </Card.Body>
    </Card>
  );
}

const Contactanos = () => {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title style={{ textAlign: 'center', marginBottom: '20px' }}>Contáctanos</Card.Title>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <FaPhone style={{ marginRight: '10px' }} />
          <p>+57 320 3383443</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FaMapMarkerAlt style={{ marginRight: '10px' }} />
          <p>Carrera 69 #31-33 sur, Bogotá, Colombia</p>
        </div>
      </Card.Body>
    </Card>
  );
}

const Inicio = () => {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="App">
      <nav className="navbarr">
        <div className="containerr">
          <h1>La Pescaderia</h1>
          <div className="button-container">
            <CustomButton onClick={() => scrollToSection('menu-section')}>Ver Menú</CustomButton>
            <Link to="/Login" className="custom-button">
              <span>Inicia Sesión</span>
            </Link>
            <CustomButton onClick={() => scrollToSection('contact-section')}>Contáctanos</CustomButton>
          </div>
          <Image src="https://i.postimg.cc/vTsDTr9M/bann.png" fluid className="banner-image" /> {/* Aquí se añade el banner */}
        </div>
      </nav>

      <div className="containerr">
        <div className="page-title">
          <h2>¡Bienvenidos a La Pescaderia!</h2>
        </div>
        <div className="content-wrapper">
          <div className="restaurant-description">
            <p> La Pescadería es un restaurante especializado en deliciosos platos de pescados y mariscos frescos. Nuestros productos provienen directamente del mar y son preparados por chefs expertos para brindarte una experiencia gastronómica única y de calidad.</p>
          </div>
        </div>

        <div className="separator"></div>

        <div className="menu-section" id="menu-section">
          <h2>Nuestro Menú</h2>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <BasicExample
              title="Salmón"
              price="$38.000"
              description="Salmón acompañado de papas a la francesa, arroz, patacón, ensalada y consomé."
              imageSrc="https://www.adrianasbestrecipes.com/wp-content/uploads/2011/06/Shrimp-Ceviche.jpg"
            />
            <BasicExample
              title="Ceviche de camarón"
              price="$20.000"
              description="Ceviche de camarón acompañado de plátano, galletas saladas y consomé."
              imageSrc="https://th.bing.com/th/id/R.e8e53bb864e633644579d81e2d2db73a?rik=%2bKFoKfQJ1LEy%2fA&riu=http%3a%2f%2fcdn.colombia.com%2fsdi%2f2011%2f07%2f29%2fmojarra-frita-519253.jpg&ehk=DvJK6QAgzL7nr6zQ422T5j72nVj30ugzGtTIUOGrFnY%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
            />
            <BasicExample
              title="Mojarra frita"
              price="$28.000"
              description="Mojarra frita acompañada de papas a la francesa, patacón, ensalada y consomé."
              imageSrc="https://th.bing.com/th/id/OIP.oU9xSB4zpyU7Key4z5GvRAHaE7?rs=1&pid=ImgDetMain"
            />
          </div>
        </div>

        <div className="separator">
          <QuienesSomos />
        </div>

        <div className="contact-section" id="contact-section">
          <Contactanos />
        </div>
      </div>

      <footer className="footer">
        <div className="containerrr">
          <p>Copyright OrdenBrivs</p>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;
