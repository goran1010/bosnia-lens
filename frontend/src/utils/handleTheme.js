function handleTheme(e, setMode) {
  const newTheme = e.target.value;
  
  setMode(newTheme);
}

export { handleTheme };
