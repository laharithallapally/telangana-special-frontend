import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import mascotGirl from "../assets/mascots/mascot-girl.webp";
import "./GreetingCharacter.css";

// Only show the greeter on these routes — keeps it off admin/checkout/auth pages
const VISIBLE_ROUTES = ["/home", "/products"];

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 11) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

const TIME_CONTENT = {
  morning: { label: "Good morning", message: "Start your day with something fresh.", icon: "☀️" },
  afternoon: { label: "Good afternoon", message: "Time for a spicy snack break.", icon: "🌤️" },
  evening: { label: "Good evening", message: "Craving something spicy tonight?", icon: "🌙" },
};

function GreetingCharacter() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [walkedIn, setWalkedIn] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const time = getTimeOfDay();
  const content = TIME_CONTENT[time];

  useEffect(() => {
    // fresh per page visit — reset animation + dismissed state on route change or refresh
    setWalkedIn(false);
    setDismissed(false);

    const shouldShow = VISIBLE_ROUTES.includes(location.pathname);
    setVisible(shouldShow);

    if (shouldShow) {
      const t = setTimeout(() => setWalkedIn(true), 150);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!visible || dismissed) return null;

  const greetingText = user?.name
    ? `${content.label}, ${user.name}! ${content.icon}`
    : `${content.label}! ${content.icon}`;

  return (
    <div className="greeter-wrap">
      <div className={`greeter-bubble ${walkedIn ? "show" : ""}`}>
        <button className="greeter-close" onClick={handleDismiss} aria-label="Dismiss greeting">
          ×
        </button>
        <p className="greeter-greeting">{greetingText}</p>
        <p className="greeter-message">{content.message}</p>
      </div>

      <img
        src={mascotGirl}
        alt="Telangana Special mascot"
        className={`greeter-mascot ${walkedIn ? "walked-in" : ""}`}
      />
    </div>
  );
}

export default GreetingCharacter;