export default function TextInput({ name, label, placeholder, value, onValueChange, type = 'text' }) {

  function handleInputChange(e) {
    let newValue = e.target.value;

    if (type === 'checkbox') {
      newValue = e.target.checked;
    }

    onValueChange(newValue);
  }

  return (<div>
    <label htmlFor={name + '_input'} className=" block font-bold mb-2">{label}</label>

    <input type={type} name={name} placeholder={placeholder}
      id={name + '_input'}
      className="border px-3 py-4 w-full"
      {...{
        value: (type !== 'checkbox' ? value : undefined),
        checked: (type === 'checkbox' ? value : undefined)
      }}
      onChange={handleInputChange}
    />
  </div>);
}