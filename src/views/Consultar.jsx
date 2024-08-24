// Importa useState desde React para manejar el estado local en el componente.
import { useState } from 'react';
// Importa un ícono de 'react-icons' para mostrar un spinner animado.
import { ImSpinner9 } from "react-icons/im";
// Importa una instancia configurada de Axios para hacer solicitudes HTTP.
import configAxios from '../config/axios.jsx';
// Importa el componente Alert para mostrar mensajes de alerta en la interfaz.
import Alert from '../componentes/Alert.jsx';

// Define el componente principal 'Consultar', que maneja la lógica de consulta de productos.
export default function Consultar() {
  // Definr estados locales
  const [idproducto, setIdProducto] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [btn, setBtn] = useState(true);
  const [globalErrorMsg, setGlobalErrorMsg] = useState('');

  const [producto, setProducto] = useState(null); // Inicializamos el estado `producto` como `null` para indicar que, inicialmente, no hay ningún producto cargado `producto` será un objeto cuando se obtenga la información del producto tras la consulta exitosa.

  // Maneja el cambio en el campo de entrada del id del producto.
  const handleIdProductoChange = (e) => {
    const value = e.target.value;

    // Solo permite valores numéricos en el campo de entrada.
    if (/^\d*$/.test(value)) {
      setIdProducto(value);
    }

    // Habilita o deshabilita el botón de enviar según si hay un valor en el campo de entrada.
    setBtn(!value);
  };

  // Maneja el envío del formulario cuando el usuario hace clic en "Consultar".
  const handleSubmit = async e => {
    e.preventDefault();

    // Resetea el mensaje de error y el producto antes de hacer la solicitud.
    setGlobalErrorMsg('');
    setProducto(null);
    
    setSpinner(true); // Muestra el spinner para indicar que la solicitud está en curso.
    // Simula un retraso de 1 segundo antes de enviar la solicitud (opcional).
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSpinner(false);

    try {
      // Define la URL para hacer la solicitud GET, incluyendo el id del producto en la ruta.
      const url = `/consultar/${idproducto}`;
      // Realiza la solicitud GET a la API para obtener los datos del producto.
      const { data } = await configAxios.get(url);
      // Almacena los datos del producto en el estado local.
      setProducto(data);
      // Limpia el campo de entrada del id del producto.
      setIdProducto('');
      // Desactiva el botón de enviar.
      setBtn(true);
    } catch (error) {
      // Si ocurre un error, almacena un mensaje de error en el estado local.
      setGlobalErrorMsg({
        msg: error.response?.data?.msg || 'Error en la solicitud: contactar al administrador',
        error: false
      });
    } finally {
      // Borra el mensaje de error después de 3 segundos (opcional).
      await new Promise(resolve => setTimeout(resolve, 3000));
      setGlobalErrorMsg('');
    }
  };

  return (
    <div className="flex flex-col items-center my-4">
      <form
        className="border border-gray-100 rounded-xl w-9/12 md:w-3/12 p-4 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="text-center font-bold">Consultar Producto</div>

        <div className="mt-4">
          <label htmlFor="input-id" className="text-gray-500">Id Producto <span className='text-red-500'>*</span></label>
          <input
            type="number"
            placeholder="Escribe el id del producto"
            id="input-id"
            className="border-gray-100 focus:ring-green-400 bg-gray-100 p-1 rounded-xl w-full outline-none focus:ring-1"
            value={idproducto}
            onChange={handleIdProductoChange}
          />
        </div>

        <button
          type="submit"
          className={`
          ${btn ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-500'} w-full py-3 px-10 rounded-xl 
          text-white uppercase font-bold mt-5 flex items-center justify-center
        `}
          disabled={btn}
        >
          {spinner ? (
            <div className="flex items-center">
              <ImSpinner9 className="animate-spin h-5 w-5 text-white mr-2" />
              Consultando...
            </div>
          ) : (
            'Consultar'
          )}
        </button>

        {/* Muestra el mensaje de error, si existe. */}
        {globalErrorMsg.msg && <Alert props={globalErrorMsg} />}
      </form>

      <div className="flex justify-center w-full">
        <table className="border-separate border-spacing-1 border border-slate-500 rounded w-full mx-1 my-4 md:w-1/2">
          <caption className="caption-top font-bold">
            Producto Consultado
          </caption>
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-slate-600 rounded">Id Producto</th>
              <th className="border border-slate-600 rounded">Nombre del Producto</th>
            </tr>
          </thead>
          {/* Si se ha consultado un producto, muestra sus datos en la tabla. */}
          {producto && (
            <tbody>
              <tr>
                <td>{producto.idproducto}</td>
                <td>{producto.nombre}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};