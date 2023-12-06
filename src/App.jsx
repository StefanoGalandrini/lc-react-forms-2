import { useEffect, useState } from "react";
import TextInput from "./components/inputs/TextInput";
import UserEditDialog from "./components/UserEditDialog";
import ConfirmDialog from "./components/ConfirmDialog";

function App() {
  // const [email, setEmail] = useState("email_iniziale");
  // const [password, setPassword] = useState("");

  const initialFormData = {
    email: "",
    name: "",
    privacy: false,
    gender: "2",
    favColors: ["1", "3"],
  };

  const [usersList, setUsersList] = useState([
    {
      email: "mario.rossi@gmail.com",
      name: "Mario Rossi",
      id: crypto.randomUUID(),
      privacy: true,
    },
    {
      email: "anna.rossi@gmail.com",
      name: "Anna Rossi",
      id: crypto.randomUUID(),
      privacy: false,
    },
    {
      email: "giulia.verdi@gmail.com",
      name: "Giulia Verdi",
      id: crypto.randomUUID(),
      privacy: true,
    }
  ]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [confirmProps, setConfirmProps] = useState({ show: false });

  // ogni volta che showAlert cambia valore, se è true fai partire un timeout di 5 secondi
  // passato il timeout, setta showAlert a false
  useEffect(() => {
    if (showAlert === true) {
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  }, [showAlert]);

  useEffect(() => {
    console.log("Applicazione avviata");
  }, []);

  /**
   * Riceve il nuovo valore da assegnare 
   * alla chiave fieldName sull'oggetto formData
   * 
   * @param {string} newValue 
   * @param {string} fieldName 
   */
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

  /**
   * Gestisce il submit del form
   * Se editingId è vuoto, aggiunge un nuovo elemento all'array usersList
   * Altrimenti modifica l'elemento con l'id editingId
   * 
   * @param {Event} e 
   * @returns 
   */
  function handleFormSubmit(e) {
    // Evita il refresh della pagina come normalmente farebbe il form
    e.preventDefault();

    // se non esiste un editingId, vuol dire che sto creando un nuovo utente
    if (!editingId) {
      setConfirmProps({
        show: true,
        title: "Conferma aggiunta",
        content: `Vuoi aggiungere alla lista degli utenti i dati inseriti?`,
        handleConfirmation: () => {
          // Aggiungo l'utente alla lista usersList
          // Aggiorno lo state
          setUsersList([...usersList, {
            ...formData,
            id: crypto.randomUUID(),
            createAt: new Date(),
          }]);

          setShowAlert(true);

          setConfirmProps({ show: false });
        },
        handleCancelation: () => {
          setConfirmProps({ show: false });
        }
      });
    } else {
      // Versione compatta
      /* setUsersList(usersList.map((user) => {
        if (user.id === editingId) {
          return {
            ...user,
            ...formData,
            updatedAt: new Date(),
          };
        }
      })); */

      // Vuol dire che sto modificando un utente già esistente
      // cerco l'utente con l'id editingId
      const userIndex = usersList.findIndex((user) => user.id === editingId);

      // se non esiste, non faccio nulla
      if (userIndex === -1) {
        return;
      }

      const newUsersList = [...usersList];

      newUsersList[userIndex] = {
        // Inserisco i dati vecchi
        ...usersList[userIndex],
        // Inserisco i dati nuovi
        ...formData,
        updatedAt: new Date(),
      };

      setUsersList(newUsersList);

      // Resetto l'editingId
      setEditingId('');
    }

    // Resetto il form
    setFormData(initialFormData);
  }

  /**
   * Resetta i dati del form inserendo i valori iniziali
   * e resettando l'editingId
   *  
   * @param {Event} e 
   */
  function handleFormReset(e) {
    // Resetto il form
    setFormData(initialFormData);

    // Resetto l'editingId
    setEditingId('');
  }

  /**
   * Dato un id, rimuove l'utente dalla lista usersList
   * 
   * @param {string} idToRemove 
   */
  function removeUser(idToRemove) {
    // const newUsersList = [...usersList]

    // newUsersList.splice(newUsersList.findIndex((user) => user.id === idToRemove), 1)
    const user = usersList.find((user) => user.id === idToRemove);

    setConfirmProps({
      show: true,
      content: `Stai per eliminare in modo definitivo l'utente ${user.name}. Sei sicur* di voler procedere?`,
      handleConfirmation: () => {
        setUsersList(usersList.filter((user) => user.id !== idToRemove));

        setConfirmProps({ show: false });
      },
      handleCancelation: () => {
        setConfirmProps({ show: false });
      }
    });

  }

  /**
   * Dato un id, cerca l'utente con quell'id e lo inserisce nel form
   * e setta l'editingId per indicare che sto modificando un utente
   * 
   * @param {string} idToEdit 
   * @returns 
   */
  function editUser(idToEdit) {
    // cerco un utente con l'id indicato
    const user = usersList.find((user) => user.id === idToEdit);

    // se non esiste, non faccio nulla
    if (!user) {
      return;
    }

    setEditingId(idToEdit);

    // setFormData({
    //   email: user.email,
    //   name: user.name,
    //   privacy: user.privacy,
    // });
  }

  function handleEditDialogSubmit(newData) {
    const user = usersList.find((user) => user.id === editingId);

    setConfirmProps({
      show: true,
      title: "Conferma aggiornamento",
      content: `Stai per aggiornare i dati dell'utente ${user.name}. Sei sicur* di voler procedere?`,
      handleConfirmation: () => {
        const newUsersList = usersList.map((user) => {
          if (user.id === editingId) {
            return {
              ...user,
              ...newData,
              updatedAt: new Date(),
            };
          }

          return user;
        });

        setUsersList(newUsersList);

        // Resetto l'editingId
        setEditingId('');

        setConfirmProps({ show: false });
      },
      handleCancelation: () => {
        setConfirmProps({ show: false });
      }
    });
  }

  function handleFavColorsChange(e) {
    // recupero il valore del checkbox
    const value = e.target.value;

    // recupero lo stato della checkbox
    const checked = e.target.checked;

    let favColors = [...formData.favColors];

    if (checked) {
      favColors.push(value);
    } else {
      favColors = favColors.filter((color) => color !== value);
    }

    updateFormData(favColors, 'favColors');
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

          <select value={formData.gender} onChange={(e) => updateFormData(e.target.value, 'gender')}>
            <option value=""></option>
            <option value="1" /* selected={ formData.gender === '1' } */>Opzione 1</option>
            <option value="2" /* selected={ formData.gender === '2' } */>Opzione 2</option>
            <option value="3" /* selected={ formData.gender === '3' } */>Opzione 3</option>
            <option value="4" /* selected={ formData.gender === '4' } */>Opzione 4</option>
          </select>

          <div className="flex gap-4">
            <label className=""><input type="checkbox" checked={formData.favColors.includes('1')} value="1" onChange={handleFavColorsChange} /> opzione 1</label>
            <label className=""><input type="checkbox" checked={formData.favColors.includes('2')} value="2" onChange={handleFavColorsChange} /> opzione 2</label>
            <label className=""><input type="checkbox" checked={formData.favColors.includes('3')} value="3" onChange={handleFavColorsChange} /> opzione 3</label>
            <label className=""><input type="checkbox" checked={formData.favColors.includes('4')} value="4" onChange={handleFavColorsChange} /> opzione 4</label>
          </div>

          <div className="flex gap-6">
            <button className="px-4 py-3 bg-red-300 hover:bg-red-600"
              type="reset">{editingId ? 'Annulla' : 'Reset'}</button>

            <button className="px-4 py-3 bg-green-300 hover:bg-green-600"
              type="submit">{editingId ? 'Salva modifiche' : 'Submit'}</button>
          </div>
        </form>

        {/* 
          Se showAlert è a true lo mostra, altrimenti no.
          Dopo 5 secondi che è visibile, lo dobbiamo nascondere.
         */}
        {showAlert && <div className="bg-green-300 p-8" >Utente aggiunto correttamente</div>}

        <div className="border-t">
          <ul>
            {usersList.map((user) => (
              <li key={user.id} className="flex py-4 border-b">{user.name} - {user.email}

                <div className="flex gap-4 items-center ml-auto">
                  <button className="px-3 py-2 flex items-center justify-center bg-blue-300 disabled:bg-slate-300 disabled:text-slate-500 font-bold"
                    onClick={() => editUser(user.id)}
                    disabled={!!editingId}>Modifica</button>

                  <button className="w-6 h-6 flex items-center justify-center bg-red-500 disabled:bg-slate-300 text-white font-bold"
                    onClick={() => removeUser(user.id)}
                    disabled={editingId === user.id}>X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* finestra dialog */}
      <UserEditDialog show={!!editingId}
        handleCancel={() => setEditingId('')}
        handleSubmit={handleEditDialogSubmit}
        formData={usersList.find((user) => user.id === editingId)}
      ></UserEditDialog>

      <ConfirmDialog {...confirmProps}></ConfirmDialog>
    </main>
  );
}

export default App;
