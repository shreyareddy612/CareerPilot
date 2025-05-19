import { Button } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Import job images
import job1 from "../assets/homepage.jpg";
import job2 from "../assets/job2.png";
import job3 from "../assets/job3.png";
import job4 from "../assets/job1.png";


const images = [job1, job2, job3, job4];

const content = [
  {
    title: "Discover Jobs That Inspire You",
    subtitle: "Opportunities from top employers worldwide.",
    desc: "CareerPilot helps you navigate your career with meaningful roles across industries and skillsets.",
  },
  {
    title: "Launch Your Future Now",
    subtitle: "Build a path that fits your ambition.",
    desc: "From tech to creative roles, find positions that truly match your interests and passion.",
  },
  {
    title: "We Bring Talent and Opportunity Together",
    subtitle: "Your career upgrade starts here.",
    desc: "Showcase your skills and get matched with jobs that need your expertise. Easy, fast, effective.",
  },
  {
    title: "Work How You Want",
    subtitle: "Remote. Hybrid. On-site. It’s your choice.",
    desc: "Personalized filters to help you land jobs on your own terms.",
  },
  
];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .carousel-container {
        perspective: 1200px;
        width: 100%;
        max-width: 550px;
        height: 350px;
        margin: 1.5rem auto 0;
        overflow: hidden;
        position: relative;
        border-radius: 16px;
      }

      .carousel-track {
        display: flex;
        transform: translateX(-${currentIndex * 100}%);
        transition: transform 1s ease;
      }

      .carousel-slide {
        min-width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0.95) rotateY(5deg);
        transition: transform 0.5s, opacity 1s;
        opacity: 0.7;
        box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      }

      .carousel-slide-active {
        transform: scale(1) rotateY(0deg);
        opacity: 1;
      }

      .carousel-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
      }

      @media (max-width: 768px) {
        .main-flex {
          flex-direction: column;
        }
        .carousel-container {
          height: 220px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [currentIndex]);

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#174EA6" }}>
          CareerPilot
        </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login">
            <Button
              type="primary"
              size="large"
              style={{
                background: "#174EA6",
                borderRadius: "8px",
                padding: "0 2rem",
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/signUp">
            <Button
              type="primary"
              size="large"
              style={{
                background: "#174EA6",
                borderRadius: "8px",
                padding: "0 2rem",
              }}
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Section */}
      <div
        className="main-flex"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          marginTop: "4rem",
        }}
      >
        {/* Carousel */}
        <div className="carousel-container">
          <div className="carousel-track">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`carousel-slide ${
                  idx === currentIndex ? "carousel-slide-active" : ""
                }`}
              >
                <img src={img} alt={`Slide ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Text */}
        <div style={{ flex: "1", maxWidth: "600px" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#174EA6",
              marginBottom: "1rem",
              transition: "opacity 0.8s",
            }}
          >
            {content[currentIndex].title}
          </h2>
          <h3 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {content[currentIndex].subtitle}
          </h3>
          <p
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              lineHeight: "1.6",
              color: "#444",
            }}
          >
            {content[currentIndex].desc}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "5rem",
          textAlign: "center",
          color: "#444",
          fontSize: "1.2rem",
          fontWeight: 500,
          lineHeight: "1.6",
        }}
      >
        <p>Empowering your career journey - one opportunity at a time.</p>
        <p>We connect passion with purpose to help you thrive.</p>
      </div>
    </div>
  );
};

export default LandingPage;
