import { useState } from "react";
import TextInput from "./components/inputs/TextInput";

function App() {
  // const [email, setEmail] = useState("email_iniziale");
  // const [password, setPassword] = useState("");

  const initialFormData = {
    email: "mario.rossi@gmail.com",
    name: "Mario Rossi",
    privacy: false
  };

  const [usersList, setUsersList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  function updateFormData(newValue, fieldName) {
    // clono l'oggetto formData
    // usiamo lo spread per eliminare qualsiasi riferimento allo state attuale, 
    // altrimenti avremmo un errore nel momento in cui cercheremo di modificare l'oggetto
    const newFormData = { ...formData };

    // aggiorno la chiave fieldName con il valore newValue
    newFormData[fieldName] = newValue;

    // passo l'oggetto modificato a setFormData
    setFormData(newFormData);

    // Versione compatta
    /* setFormData({
      ...formData,
      [fieldName]: newValue,
    }) */
  }

  function handleFormSubmit(e) {
    // Evita il refresh della pagina come normalmente farebbe il form
    e.preventDefault();

    // Aggiungo l'utente alla lista usersList
    // Aggiorno lo state
    setUsersList([...usersList, {
      ...formData,
      id: crypto.randomUUID(),
      createAt: new Date(),
    }]);

    // Resetto il form
    setFormData(initialFormData);
  }

  function handleFormReset(e) {
    // Resetto il form
    setFormData(initialFormData);
  }

  function removeUser(idToRemove) {
    // const newUsersList = [...usersList]

    // newUsersList.splice(newUsersList.findIndex((user) => user.id === idToRemove), 1)

    setUsersList(usersList.filter((user) => user.id !== idToRemove));
  }

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-4xl">Hello World</h1>

        <form className="flex flex-col gap-4 mx-auto py-8" onSubmit={handleFormSubmit} onReset={handleFormReset}>
          <TextInput name="email" placeholder="Email utente" label="Email" type="email"
            value={formData.email}
            onValueChange={(newValue) => updateFormData(newValue, 'email')}></TextInput>

          <TextInput name="name" placeholder="Come si chiama l'utente?" label="Nome completo"
            value={formData.name}
            onValueChange={(newValue) => updateFormData(newValue, 'name')}></TextInput>

          <TextInput name="privacy" label="Informativa privacy" type="checkbox"
            value={formData.privacy}
            onValueChange={(newValue) => updateFormData(newValue, 'privacy')}></TextInput>

          {/* <div>
            <label htmlFor="email_input" className=" block font-bold mb-2">Email</label>
            <input type="email" name="email" placeholder="Email utente" className="border px-3 py-4 w-full"
              value={formData.email}
              onChange={(e) => updateFormData(e.target.value, 'email')} />
          </div> */}

          {/* <div>
            <label htmlFor="name_input" className=" block font-bold mb-2">Nome</label>
            <input type="text" name="name" placeholder="Come si chiama l'utente?" className="border px-3 py-4 w-full"
              value={formData.name}
              onChange={(e) => updateFormData(e.target.value, 'name')} />
          </div> */}


          <div className="flex gap-6">
            <button className="px-4 py-3 bg-red-300 hover:bg-red-600"
              type="reset">Reset</button>

            <button className="px-4 py-3 bg-green-300 hover:bg-green-600"
            >Submit</button>
          </div>
        </form>

        <div className="border-t">
          <ul>
            {usersList.map((user) => (
              <li key={user.id} className="flex py-4 border-b">{user.name} - {user.email}
                <button className="w-6 h-6 flex items-center justify-center ml-auto bg-red-500 text-white font-bold"
                  onClick={() => removeUser(user.id)}>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default App;
