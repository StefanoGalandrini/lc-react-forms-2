# Gestione eventi e form

## Sincronizzazione valore input con variabile reattiva

I form contengono vari tipi di input. Per poter collegare il valore di un input ad una variabile in react, occorre specificare sull'input 2 attributi:
- value={nomeVariabile}
- onChange={funzione}

```js
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value) }>
```

## Modificare dati di un oggetto / array reattivo
Quando il valore di una variable (stato) è un oggetto o un array, nell'invocare la funzione setter, dobbiamo passare come valore, tutto l'oggetto / array, e non solo la parte da modificare.
Per poter fare questo occorre clonare l'oggett / array originale, modificarlo a piacimento e passarlo alla funzione setter.

```js
const [usersList, setUsersList] = useState([]);
const [singleUser, setSingleUser] = useState({
  name: "Giuseppe Verdi",
  email: "giubeppe.verdi@gmail.com"
})

// NON posso fare push diretto
// usersList.push({}) // ERRORE

// Passo un nuovo array contenente tutti i dati del vecchio array più quelli nuovi da aggiungere.
setUsersList([
  ...usersList,
  {
    name: "Mario Rossi"
  }
])

// Anche se voglio modificare SOLO la chiave email, devo passare tutto l'oggetto per intero.
setSingleUser({
  ...singleUser,
  email: "giuseppe.verdi@gmail.com"
})
```

## Cancellazione dati da un array reattivo
Anche in questo caso devo passare alla funzione setter, tutto il nuovo array, senza l'elemento da cancellare. Solitamente possiamo usare il .filter() per scrivere tutto in modo compatto.

```js
const [usersList, setUsersList] = useState([
  /* ...vari dati */
  ]);

// passo al setter un array dal quale ho escluso l'elemento che voglio eliminare.
setUsersList(usersList.filter((user) => user.id !== idToRemove));
