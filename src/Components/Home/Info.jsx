import "./Info.css";
function Info() {
  return (
    <div className="info-container">
      <div className="info-text">
        <h3>
          <span>Saarthi</span> is an intelligent assistant built using Google’s{" "}
          <span>Gemma-3N</span> model and developed by Sarthak Bhagat.
        </h3>
        <h3>
          Saarthi is designed to engage in natural conversation, understand
          context, answer follow-up questions, and provide clear explanations.
          Whether you're learning, building, or experimenting, Saarthi adapts to
          your intent and helps you move forward.
        </h3>
        <h3>
          The system is deployed using a complete Docker-based container
          architecture, giving it a stable, isolated, and scalable environment —
          the same approach used by modern production-grade AI applications.
        </h3>
      </div>
    </div>
  );
}
export default Info;
