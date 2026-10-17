import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import Auth from './Auth.jsx'
import Pendientes from './Pendientes.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Sesión guardada de una visita anterior
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCargando(false)
    })

    // Se dispara al iniciar o cerrar sesión
    const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => setSession(nueva))
    return () => data.subscription.unsubscribe()
  }, [])

  if (cargando) return <p className="centro">Cargando…</p>

  return (
    <div className="app">
      <header>
        <h1>Mis libros</h1>
        {session && (
          <div className="usuario">
            <span>{session.user.email}</span>
            <button className="secundario" onClick={() => supabase.auth.signOut()}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>
      <main>{session ? <Pendientes /> : <Auth />}</main>
    </div>
  )
}
