import React, { useEffect } from 'react';

function Titulo() {
  useEffect(() => {
    document.title = 'GrowSphere';
  }, []);

  return (
    <div>
      <h1>Bienvenido a Mi Página</h1>
    </div>
  );
}

export default Titulo;