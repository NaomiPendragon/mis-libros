import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

const ESTADOS = {
  quiero_leer: 'Quiero leer',
  leyendo: 'Leyendo',
  leido: 'Leído',
  abandonado: 'Abandonado',
}

export default function Pendientes() {
  const [libros, setLibros] = useState([])
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [editando, setEditando] = useState(null) // { id, titulo, autor }
  const [error, setError] = useState('')

  // READ: gracias a RLS solo llegan los libros del usuario con sesión
  async function cargar() {
    const { data, error } = await supabase
      .from('pendiente')
      .select('id, titulo, autor, estado')
      .order('creado', { ascending: false })
    if (error) return setError(error.message)
    setLibros(data)
  }

  useEffect(() => {
    cargar()
  }, [])

  // CREATE: usuario_id lo pone la BD con DEFAULT auth.uid()
  async function agregar(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase
      .from('pendiente')
      .insert({ titulo: titulo.trim(), autor: autor.trim() || null })
    if (error) return setError(error.message)
    setTitulo('')
    setAutor('')
    cargar()
  }

  // UPDATE
  async function actualizar(id, cambios) {
    setError('')
    const { error } = await supabase.from('pendiente').update(cambios).eq('id', id)
    if (error) return setError(error.message)
    setEditando(null)
    cargar()
  }

  // DELETE
  async function borrar(id) {
    if (!confirm('¿Quitar este libro de tu pila?')) return
    setError('')
    const { error } = await supabase.from('pendiente').delete().eq('id', id)
    if (error) return setError(error.message)
    cargar()
  }

  function guardarEdicion() {
    actualizar(editando.id, {
      titulo: editando.titulo.trim(),
      autor: editando.autor.trim() || null,
    })
  }

  return (
    <>
      <form className="tarjeta nuevo" onSubmit={agregar}>
        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <input placeholder="Autor (opcional)" value={autor} onChange={(e) => setAutor(e.target.value)} />
        <button type="submit">+ Agregar libro</button>
      </form>

      {error && <p className="error">{error}</p>}

      {libros.length === 0 && <p className="vacio">Tu pila está vacía. ¡Agrega tu primer libro!</p>}

      <ul className="lista">
        {libros.map((libro) =>
          editando?.id === libro.id ? (
            <li key={libro.id} className="tarjeta">
              <input
                value={editando.titulo}
                onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
              />
              <input
                placeholder="Autor"
                value={editando.autor}
                onChange={(e) => setEditando({ ...editando, autor: e.target.value })}
              />
              <div className="acciones">
                <button onClick={guardarEdicion}>Guardar</button>
                <button className="secundario" onClick={() => setEditando(null)}>
                  Cancelar
                </button>
              </div>
            </li>
          ) : (
            <li key={libro.id} className="tarjeta">
              <div className="info">
                <strong>{libro.titulo}</strong>
                {libro.autor && <span>{libro.autor}</span>}
              </div>
              <select value={libro.estado} onChange={(e) => actualizar(libro.id, { estado: e.target.value })}>
                {Object.entries(ESTADOS).map(([valor, texto]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                ))}
              </select>
              <div className="acciones">
                <button
                  className="secundario"
                  onClick={() => setEditando({ id: libro.id, titulo: libro.titulo, autor: libro.autor ?? '' })}
                >
                  Editar
                </button>
                <button className="peligro" onClick={() => borrar(libro.id)}>
                  Borrar
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  )
}
