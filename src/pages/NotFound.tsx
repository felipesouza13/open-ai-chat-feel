import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-chat-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-chat-text">404</h1>
        <p className="text-xl text-chat-text-muted mb-4">Oops! Página não encontrada</p>
        <a href="/" className="text-chat-accent hover:text-chat-accent-hover underline">
          Voltar ao Chat
        </a>
      </div>
    </div>
  );
};

export default NotFound;
