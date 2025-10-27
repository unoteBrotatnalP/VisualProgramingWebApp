export default function App() {
  const token = localStorage.getItem("token");
  return (
    <div style={{ textAlign: "center", marginTop: 80, fontFamily: "system-ui, sans-serif" }}>
      <h1>Witaj</h1>
      {token ? (
        <p> Jesteś zalogowany. Token zapisany w localStorage.</p>
      ) : (
        <p> Nie zalogowano. Przejdź do Logowanie/Rejestracja.</p>
      )}
    </div>
  );
}
